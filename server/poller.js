REDIRECT_URL = 'http://localhost:3000/_oauth/google?close';
Plugins = new Meteor.Collection("plugins");

var cheerio = Meteor.require('cheerio');
var Future = Npm.require('fibers/future');
var Tokens = Package['mongo-livedata'].MongoInternals.defaultRemoteCollectionDriver().open("meteor_accounts_loginServiceConfiguration");
var Pings = new Meteor.Collection("pings");
var LastProcessed = new Meteor.Collection("lastProcessed");

var googleTokens = Tokens.findOne({ service: "google" });

var googleapis = Meteor.require('googleapis');
var OAuth2 = googleapis.auth.OAuth2;
var future = new Future;
googleapis.discover('gmail', 'v1').execute(future.resolver());
var client = future.wait();

var oauth2Client =
  new OAuth2(googleTokens.clientId, googleTokens.secret, REDIRECT_URL);

// for every new user start polling
Accounts.onCreateUser(function (options, user) {
  willPoll[user._id] = true;
  Meteor.defer(function () { pollForUser(user._id); });
  if (options.profile)
    user.profile = options.profile;
  addDefaultPlugins(user);
  return user;
});

// for every existing user start polling on the startup
Meteor.startup(function () {
  Meteor.users.find().forEach(function (user) {
    willPoll[user._id] = true;
    Meteor.defer(function () { pollForUser(user._id); });
  });
});


var willPoll = {};


function pollForUser (userId) {
  var ping = Pings.findOne(userId);
  // don't poll the Gmail API if the user last logged in more than 5 minutes ago
  if (!ping || (+ping.lastPing) < (new Date - 5 * 60 * 1000)) {
    console.log('not polling for user', userId, 'as the last ping was more than 5 minutes ago')
    willPoll[userId] = false;
    return;
  }

  var lastEmails = getApiCall(userId, 'list', { userId: 'me'/*XXX labelsId, q, etc*/ });
  var lastProcessedEmailId = LastProcessed.findOne(userId) || {};
  var f = -1;

  _.each(lastEmails.messages, function (email, index) {
    // break if all the next emails were already processed
    if (email.id === lastProcessedEmailId.id) {
      f = index;
    }
  });
  if (f === -1) f = lastEmails.messages.length;
  var unseenEmails = lastEmails.messages.slice(0, f).reverse();

  // iterate over unseen emails from the oldest to the newest
  _.each(unseenEmails, function (email) {
    var emailObj = getApiCall(userId, 'get', { userId: 'me', id: email.id });

    // XXX iterate over each "plugin" for this user, but since we don't have it
    // yet just extract the first link you find
    var emailBody = emailObj.payload.body;
    if (!emailBody.size)
      return;
    var emailHtml = new Buffer(emailBody.data, 'base64').toString('utf8');
    var $ = cheerio.load(emailHtml);

    var allPlugins = Plugins.find({ user: userId }, { sort: { prioriry: -1 } }).fetch();
    var result = { match: false };
    _.each(allPlugins, function (pluginObj) {
      var plugin = pluginObj.script;
      if (result.match)
        return;
      var fn = new Function('emailObj', '$', '_', plugin);
      try {
        result = fn(emailObj, $, _);
      } catch (err) {}
    });

    if (result.match) {
      var item = _.extend({ user: userId, title: emailObj.snippet }, result);
      Notifications.insert(item);
      console.log("FOUND:", item);
    }

    if (! LastProcessed.findOne(userId))
      LastProcessed.insert({ _id: userId, id: email.id });
    else
      LastProcessed.update({ _id: userId }, { _id: userId, id: email.id });
  });

  // poll again in 30s
  willPoll[userId] = true;
  Meteor.setTimeout(function () {
    pollForUser(userId);
  }, 30 * 1000);
}

function getApiCall (userId, method, options) {
  if (!Meteor.users.findOne(userId)) {
    console.log("The user info not found", userId)
    return;
  }
  var accessToken = Meteor.users.findOne(userId).services.google.accessToken;
  var refreshToken = Meteor.users.findOne(userId).services.google.refreshToken;
  oauth2Client.credentials = {
    access_token: accessToken,
    refresh_token: refreshToken
  };

  var emailGetter = client
    .gmail.users.messages[method](options)
    .withAuthClient(oauth2Client);
  var get = Meteor._wrapAsync(_.bind(emailGetter.execute, emailGetter));
  return get();
}

Meteor.methods({
  ping: function () {
    if (! this.userId)
      throw new Meteor.Error(401);

    console.log("ping from", this.userId)
    // hey, the user pinged us, let's ensure their emails are actually polled
    this.unblock();

    var userId = this.userId;
    if (! Pings.findOne({ _id: userId }))
      Pings.insert({ _id: userId, lastPing: new Date });
    else
      Pings.update({ _id: userId }, { $set: { lastPing: new Date } });

    if (! willPoll[userId]) {
      willPoll[userId] = true;
      Meteor.defer(function () { pollForUser(userId); });
    }
  }
});



REDIRECT_URL = 'http://localhost:3000/_oauth/google?close';

if (Meteor.isServer) {
  var Future = Npm.require('fibers/future');
  var Tokens = Package['mongo-livedata'].MongoInternals.defaultRemoteCollectionDriver().open("meteor_accounts_loginServiceConfiguration");

  var googleTokens = Tokens.findOne({ service: "google" });

  var googleapis = Meteor.require('googleapis');
  var OAuth2 = googleapis.auth.OAuth2;
  var future = new Future;
  googleapis.discover('gmail', 'v1').execute(future.resolver());
  var client = future.wait();

  var oauth2Client =
    new OAuth2(googleTokens.clientId, googleTokens.secret, REDIRECT_URL);

  Meteor.methods({
    foo: function () {
      var accessToken = Meteor.users.findOne(this.userId).services.google.accessToken;
      var refreshToken = Meteor.users.findOne(this.userId).services.google.refreshToken;
      oauth2Client.credentials = {
        access_token: accessToken,
        refresh_token: refreshToken
      };

      var emailGetter = client
        .gmail.users.messages
          .get({ 'userId': 'me', id: '146280dc108e69af' })
        .withAuthClient(oauth2Client);
      var get = Meteor._wrapAsync(_.bind(emailGetter.execute, emailGetter));
      return get();
    }
  });
} else {
  Template.main.events({
    'click .login': function () {
      Meteor.loginWithGoogle({
        requestPermissions: ['email',
          "https://mail.google.com/",
          "https://www.googleapis.com/auth/gmail.readonly"
        ],
        requestOfflineToken: true
      });
    }
  });
}


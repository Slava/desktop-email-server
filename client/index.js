// every 4 minutes, notify server that we still care about email updates
Meteor.setInterval(function () {
  Meteor.call("ping");
}, 4 * 60 * 1000);
Meteor.startup(function () {
  Meteor.call("ping");
});

window.onmessage = function (e) {
  console.log('METEOR', e.data)
}

if (parent) {
  Notifications.find().observe({
    added: function (doc) {
      parent.postMessage(JSON.stringify(doc), "*");
    }
  });
}

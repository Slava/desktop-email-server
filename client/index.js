Template.main.events({
  'click .login': function () {
    Meteor.loginWithGoogle({
      requestPermissions: ['email',
        "https://mail.google.com/",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify"
      ],
      requestOfflineToken: true
    });
  }
});

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


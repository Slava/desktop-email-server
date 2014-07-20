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
Meteor.setTimeout(function () {
  Meteor.call("ping");
}, 4 * 60 * 1000);


if (Meteor.isServer) {
} else {
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
}


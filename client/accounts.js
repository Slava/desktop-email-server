

// Login Buttons
Template.settings.buttonText = function () {
  if (Meteor.user())
    return "Logout " + Meteor.user().profile.name;
  else
    return "Login";
};


Template.main.events({
  'click .login': function () {
    if (! Meteor.userId()) {
      Meteor.loginWithGoogle({
        requestPermissions: ['email',
          "https://mail.google.com/",
          "https://www.googleapis.com/auth/gmail.readonly",
          "https://www.googleapis.com/auth/gmail.modify"
        ],
        requestOfflineToken: true
      }, function (err, res) {
        if (err) {
          console.log('LOGIN FAILED:', err.message);
        } else {
          Meteor.call("ping");
        }
      });
    } else {
      Meteor.logout();
    }
  }
});


Deps.autorun(function () {
  if (! Meteor.userId()) return;
  Meteor.subscribe("my-notifications", Meteor.userId());
  Meteor.subscribe("my-plugins", Meteor.userId());
});


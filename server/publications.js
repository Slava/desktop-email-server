Meteor.publish("my-notifications", function () {
  if (! this.userId) return [];
  return Notifications.find({ user: this.userId });
});

Meteor.publish("my-plugins", function () {
  if (! this.userId) return [];
  return Plugins.find({ user: this.userId });
});

Plugins.allow({
  insert: function (userId, doc) {
    return userId && doc.user === userId;
  },
  update: function (userId, doc) {
    return userId && doc.user === userId;
  },
  remove: function (userId, doc) {
    return userId && doc.user === userId;
  }
});


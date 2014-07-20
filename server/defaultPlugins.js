var defaultPlugins = [
  'forgetpw.js',
  'confirm.js',
  'click-here.js',
  'view.js',
  'see.js',
  'reply.js',
  'learn-more.js',
  'check.js',
  'go.js',
  'no.js',
  'yes.js',
  'your.js',
  'unsubscribe.js'
];

// for every new user setup the default plugins
addDefaultPlugins = function (user) {
  console.log('adding a plugin')
  _.each(defaultPlugins, function (filename, i) {
    var plugin = Assets.getText(filename);
    Plugins.insert({
      user: user._id,
      priority: 20000 - (1000 * i),
      name: filename.substring(0, filename.length - 3),
      script: plugin
    });
  });
};


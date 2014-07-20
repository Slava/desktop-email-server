// for every new user setup the default plugins
addDefaultPlugins = function (user) {
  console.log('adding a plugin')
  Plugins.insert({ user: user._id, priority: 100, script: " var res = { match: false }; _.each($('a'), function (el) { var text = $(el).text().trim().replace(/\\n/g, '').replace(/\\t/g, ''); if (text.match(/your/i)) { res = { match: true, buttonText: text, link: $(el).attr('href') }; } }); return res;" });
  Plugins.insert({ user: user._id, priority: 200, script: "var res = { match: false }; _.each($('a'), function (el) { var text = $(el).text().trim().replace(/\\n/g, '').replace(/\\t/g, ''); if (text.match(/[Rr]eset/)) { res = { match: true, buttonText: 'Reset your password', link: $(el).attr('href') }; } }); return res;" });
};


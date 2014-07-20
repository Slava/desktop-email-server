var res = { match: false };
_.each($('a'), function (el) {
  var text = $(el).text().trim().replace(/\\n/g, '').replace(/\\t/g, '');
  var url = $(el).attr('href');
  if (text === '')
    text = 'Action!';
  if (url.match(/token/i) || url.match(/verify/i) || url.match(/finish/i)) {
    res = { match: true, buttonText: text, link: url };
  }
});
return res;

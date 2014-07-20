var res = { match: false };
_.each($('a'), function (el) {
  var text = $(el).text().trim().replace(/\\n/g, '').replace(/\\t/g, '');
  if (text.match(/reply/i)) {
    res = { match: true, buttonText: text, link: $(el).attr('href') };
  }
});
return res;

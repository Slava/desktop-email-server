var res = { match: false };
_.each($('a'), function (el) {
  var text = $(el).text().trim().replace(/\\n/g, '').replace(/\\t/g, '');
  if (text.match(/no/i)) {
    res = { match: true, buttonText: text, link: $(el).attr('href') };
  }
});
return res;

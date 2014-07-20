var res = { match: false };
_.each($('a'), function (el) {
  var text = $(el).text().trim().replace(/\\n/g, '').replace(/\\t/g, '');
  if (text.match(/reset/i)) {
    res = { match: true, buttonText: "Reset your password", link: $(el).attr('href') };
  }
});
return res;

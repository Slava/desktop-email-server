SimpleRationalRanks = {
  beforeFirst: function (firstRank) { return firstRank + 100; },
  between: function (beforeRank, afterRank) { return (beforeRank + afterRank) / 2; },
  afterLast: function (lastRank) { return lastRank - 100; }
};

Template.settings.plugins = function () {
	return Plugins.find({}, { sort: { priority: -1 }});
};

Template.settings.rendered = function () {
	$("#menu-pages").sortable({
		stop: function (event, ui) { // fired when an item is dropped
      var el = ui.item.get(0), before = ui.item.prev().get(0), after = ui.item.next().get(0);

      var newPriority;
      if (!before) { // moving to the top of the list
        newPriority = SimpleRationalRanks.beforeFirst(UI.getElementData(after).priority);

      } else if (!after) { // moving to the bottom of the list
        newPriority = SimpleRationalRanks.afterLast(UI.getElementData(before).priority);

      } else {
        newPriority = SimpleRationalRanks.between(
          UI.getElementData(before).priority,
          UI.getElementData(after).priority);
      }

      Plugins.update(UI.getElementData(el)._id, {$set: {priority: newPriority}});
    }

	});
};



var _ = require("underscore");

Parse.Cloud.beforeSave("Event", function(request, response) {
    var event = request.object;

    var toLowerCase = function(w) { return w.toLowerCase(); };

    var words = event.get("title").split(/b/);
    words = _.map(words, toLowerCase);
    var stopWords = ["the", "in", "and"]
    words = _.filter(words, function(w) { return w.match(/^w+$/) && ! _.contains(stopWords, w); });

    var hashtags = event.get("title").match(/#.+?b/g);
    hashtags = _.map(hashtags, toLowerCase);

    event.set("words", words);
    event.set("hashtags", hashtags);
    response.success();
});
var _ = require("underscore");

Parse.Cloud.beforeSave("Event", function(request, response) {
    var event = request.object;

    var toLowerCase = function(w) { return w.toLowerCase(); };

    var words = event.get("title").split(" ");
    words = _.map(words, toLowerCase);
    var stopWords = ["the", "in", "and"]
    // words = _.filter(words, (w) => { 
    // 	console.log(w);
    // 	return w.match(/^w+$/) && ! _.contains(stopWords, w); 
    // });

    var wordsx = [];

    words = ArrNoDupe(words);

    if (words) {
    	words.forEach((i) => {
    		if (i !="" && i != "the" && i != "in" && i != "and") {
    			wordsx.push(i);
    		}
    	});
    }
 
    console.log("Words array", words);

    var hashtags = event.get("title").match(/#.+?b/g);
    hashtags = _.map(hashtags, toLowerCase);

    event.set("words", wordsx);
    event.set("hashtags", hashtags);
    response.success();
});

function ArrNoDupe(a) {
  let temp = {};
  for (let i = 0; i < a.length; i++)
    temp[a[i]] = true;
  let r = [];
  for (let k in temp)
    r.push(k);
  return r;
}
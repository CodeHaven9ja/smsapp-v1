/*jshint esversion: 6 */
Parse.Cloud.define('hello', (req, res) => {
  res.success('Hi');
});

Parse.Cloud.afterSave(Parse.User, (req, res) => {
	var user = req.object;
    if (user.existed()) { 
    	if (user.get('role') != "user"){
    		decreaseUser();
    	}
    	return; 
    }
    user.set("role", "user");
    user.set("isActive", false);
    user.save();
    increaseUser();
});

Parse.Cloud.afterDelete(Parse.User, (req, res) =>{
	decreaseUser();
});

function increaseUser() {
	var Count = Parse.Object.extend("Count");
	var cQuery = new Parse.Query(Count);
	cQuery.equalTo('type', 'users');
	cQuery.first().then((count) =>{
    	count.increment('count');
    	count.save();
    });
}

function decreaseUser() {
	var Count = Parse.Object.extend("Count");
	var cQuery = new Parse.Query(Count);
	cQuery.equalTo('type', 'users');
	cQuery.first().then((count) =>{
    	count.increment('count', -1);
    	count.save();
    });
}
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

Parse.Cloud.define('searchParent', (req, res) =>{
  var q = req.params.q;

  var uQuery = new Parse.Query(Parse.User);
  uQuery.startsWith('objectId', q);
  uQuery.doesNotExist('profile');
  uQuery.notEqualTo('role', 'teacher');
  uQuery.notEqualTo('role', 'admin');

  var eQuery = new Parse.Query(Parse.User);
  eQuery.startsWith('email', q);
  eQuery.doesNotExist('profile');
  eQuery.notEqualTo('role', 'teacher');
  eQuery.notEqualTo('role', 'admin');

  var pQuery = new Parse.Query(Parse.User);
  pQuery.startsWith('objectId', q);
  pQuery.equalTo('role', 'parent');

  var mainQuery = Parse.Query.or(uQuery, eQuery, pQuery);
  mainQuery.find().then((users) =>{
    res.success(users);
  });

});

Parse.Cloud.define('linkParent', (req, res) =>{
  var token = req.user.getSessionToken();
  console.log("User Token", token);
  var pid = req.params.pid,
      sid = req.params.sid;
  var student, parent, profile;
  var Profile;

  // Get student
  var sQ = new Parse.Query(Parse.User);

  sQ.equalTo('objectId', sid);
  sQ.first({ sessionToken: token }).then((s) =>{
    student = s;
    console.log(s);
    // Get Parent
    var pQ = new Parse.Query(Parse.User);
    pQ.equalTo('objectId', pid);
    return pQ.first();
  }).then((p) =>{
    console.log(p);
    parent = p;
    return p;
  }).then((p) =>{
    var prQ = new Parse.Query('Profile');
    prQ.equalTo('user', student);
    prQ.equalTo('parent', parent);
    return prQ.first(); 
  }).then((profile) =>{
    if (!profile) {
      var Profile = Parse.Object.extend("Profile");
      profile = new Profile();
    }
    profile.set('type', 'student');
    profile.set('parent', parent);
    profile.set('user', student);
    return profile.save(null,{ useMasterKey: true });
  }).then((profile) =>{
    student.set('profile', profile);
    return student.save(null,{ useMasterKey: true });
  }).then((student) =>{
    res.success(student);
  }).catch((error) =>{
    res.error(error);
  });
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
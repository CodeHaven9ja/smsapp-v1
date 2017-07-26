/*jshint esversion: 6 */

require(__dirname + '/parent.js');
require(__dirname + '/student.js');
require(__dirname + '/class-man.js');
require(__dirname + '/course.js');
require(__dirname + '/jobs.js');
require(__dirname + '/report.js');
require(__dirname + '/term.js');
require(__dirname + '/school.js');
require(__dirname + '/fees.js');
require(__dirname + '/message.js');
require(__dirname + '/event.js');
require(__dirname + '/user.js');

Parse.Cloud.define('hello', (req, res) => {
  res.success('Hi');
});

Parse.Cloud.define('resetPassword', (req, res) =>{
  var q = req.params.q;

  var uQuery = new Parse.Query(Parse.User);
  uQuery.equalTo('username', q);

  var eQuery = new Parse.Query(Parse.User);
  eQuery.equalTo('email', q);

  var mainQuery = Parse.Query.or(uQuery, eQuery);
  mainQuery.first().then((user) => {
    return Parse.User.requestPasswordReset(user.getEmail()).then(() => {
      res.success({reset:true});
    });
  }).catch((error) =>{
    res.error(error);
  });
});

Parse.Cloud.define('getStaffMembers', (req, res) => {
  var token = req.user.getSessionToken();
  var uQuery = new Parse.Query(Parse.User);

  uQuery.equalTo('role', 'teacher');
  uQuery.include('profile');
  uQuery.descending('createdAt');

  uQuery.find({sessionToken : token}).then((users) =>{
    return res.success(users);
  }).catch((error) =>{
    return res.error(error);
  });
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
  var pid = req.params.pid,
      sid = req.params.sid;
  var student, parent, profile;
  var Profile;

  // Get student
  var sQ = new Parse.Query(Parse.User);

  sQ.equalTo('objectId', sid);
  sQ.first({ sessionToken: token }).then((s) =>{
    student = s;
    // Get Parent
    var pQ = new Parse.Query(Parse.User);
    pQ.equalTo('objectId', pid);
    return pQ.first();
  }).then((p) =>{
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

Parse.Cloud.define('cOrUposition', (req, res) =>{
  var token = req.user.getSessionToken();
  var st = req.params.staff;

  console.log(st);

  var staff, profile;

  var sQ = new Parse.Query(Parse.User);

  sQ.equalTo('objectId', st.id);
  sQ.first({ sessionToken: token }).then((s) =>{
    staff = s;
    var prQ = new Parse.Query('Profile');
    prQ.equalTo('user', st.id);
    return prQ.first({ sessionToken: token }); 
  }).then((p) =>{
    if (!p) {
      var Profile = Parse.Object.extend("Profile");
      profile = new Profile();
    } else {
      profile = p;
    }

    profile.set('type', 'staff');
    profile.set('position',st.position);
    return profile.save(null,{ useMasterKey: true });
  }).then((profile) =>{
    staff.set('profile', profile);
    return staff.save(null,{ useMasterKey: true });
  }).then((staff) =>{
    return res.success(staff);
  }).catch((error) =>{
    return res.error(error);
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

function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  } 
  if(mm<10){
      mm='0'+mm;
  } 
  var today = dd+'/'+mm+'/'+yyyy;
  return today;
}
Parse.Cloud.afterSave(Parse.User, (req, res) => {
	var user = req.object;
  var currentUser = req.user;
  if (user.existed()) { 
  	if (user.get('role') != "user"){
  		decreaseUser();
  	}
  	return; 
  } 
  if (!user.existed() && user.get('role') === "teacher") {
    user.set("isActive", false);
    user.save(null,{useMasterKey: true});
    return;
  }
  user.set("role", "user");
  user.set("isActive", false);
  user.save(null,{useMasterKey: true});
  increaseUser();
});

Parse.Cloud.define('getStudentClass', (req, res) =>{
	var token = req.user.getSessionToken();
	var sid = req.params.sid;
	// console.log(token);
	var cQ = new Parse.Query("Classroom");

	cQ.containsAll('students', [sid]);

	cQ.first({sessionToken : token}).then((c) =>{
		return res.success(c);
	}).catch((err) =>{
		return res.error(err);
	});
});

Parse.Cloud.define('tickStudent', (req, res) =>{
	var user = req.user;
	var student = {};
	var sid = req.params.sid;
	var Activity = Parse.Object.extend("Activity");
	var roleACL = new Parse.ACL();

	var sQ = new Parse.Query(Parse.User);
	sQ.equalTo("objectId", sid);

	return sQ.first({sessionToken: user.getSessionToken()}).then((u) =>{
		student = u;
		var activity = new Activity();;
		activity.set("fromUser", student);
		activity.set('type', 'attendance');
		activity.set("tickDate", getDate());

		roleACL.setPublicReadAccess(false);
		roleACL.setReadAccess(student, true);
		roleACL.setRoleReadAccess("parentOf_"+student.id, true);
		roleACL.setRoleReadAccess("admin", true);
		roleACL.setRoleWriteAccess("admin", true);
		roleACL.setRoleReadAccess("teacher", true);
		roleACL.setRoleWriteAccess("teacher", true);

		activity.setACL(roleACL);

		return activity.save(null, {sessionToken: user.getSessionToken()});
	}).then((activity) =>{
		return res.success();
	}).catch((err) =>{
		return res.error(err);
	});
});

Parse.Cloud.define('getStudentAttendanceToday', (req, res) =>{
  var token = req.user.getSessionToken();
  var sid = req.params.sid;

  var user;
  var t = getDate();

  var uQuery = new Parse.Query(Parse.User);
  var aQuery = new Parse.Query('Activity');
  uQuery.equalTo('objectId', sid);
  uQuery.equalTo('role', 'user');
  
  uQuery.first().then((s) =>{
    user = s;
    aQuery.equalTo('fromUser', user);
    aQuery.equalTo('type', 'attendance');
    aQuery.equalTo('tickDate', t);

    return aQuery.first({sessionToken : req.user.getSessionToken()});
  }).then((activity) =>{
    
    if (!activity) {
      return res.error({
        errorCode: 404,
        message: 'Not present.'
      });
    }
    return res.success();
  }).catch((error) =>{
    return res.error(error);
  });
});

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

// Parse.Cloud.job("CreateInitialReportsPerTerm", (req, status) =>{

// });
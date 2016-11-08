Parse.Cloud.define('listChildren', (req, res) => {
	var token = req.user.getSessionToken();

  var uQuery = new Parse.Query("Profile");
  uQuery.equalTo('parent', req.user);
  uQuery.include('user');

  uQuery.find().then((students) =>{
  	return res.success(students);
  }).catch((error) => {
    return res.error(error);
  });
});
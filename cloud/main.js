
Parse.Cloud.define('hello', (req, res) => {
  res.success('Hi');
});

Parse.Cloud.afterSave(Parse.User, (req, res) => {
	var user = request.object;
    if (user.existed()) { return; }
    user.set("role", "user");
    return user.save();
});
/*jshint esversion: 6 */
var check = (parse) => {
	return (req, res, next) => {
		var currentUser = req.session.user;

		if (!currentUser) {
			res.redirect('/home/login');
		} 
		next();
	};
};

var isActive = () =>{
	return (req, res, next) => {
		var currentUser = req.session.user;
		if (!currentUser.isActive) {
			res.redirect('/home/noPermission');
		} else {
			next();
		}
	};
};

var checker = (parse) => {
	return {
		login : check,
		isActive : isActive
	};
};

module.exports = checker;
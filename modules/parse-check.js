var login = (parse) => {
	return (req, res, next) => {
		var currentUser = parse.User.current();
		if (currentUser) {
			req.session.user = currentUser;
			next();
		}
		return res.render('home/login', {message:"You need to login to view this page."});
	}
}

module.exports = login;
var check = (parse) => {
	return (req, res, next) => {
		var currentUser = req.session.user;
		if (!currentUser) {
			res.redirect('/home/login');
		}
		next();
	}
}

module.exports = check;
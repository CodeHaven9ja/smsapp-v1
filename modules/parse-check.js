var check = (parse) => {
	return (req, res, next) => {
		var currentUser = req.session.user;
		if (currentUser) {
			next();
		}
		res.redirect('home/login');
	}
}

module.exports = check;
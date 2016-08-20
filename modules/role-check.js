var service = {};

service.isAdmin = IsAdmin;
service.isTeacher = IsTeacher;
service.isParent = IsParent;
service.isStudent = IsStudent;
service.isElevated = IsElevated;

module.exports = service;

function IsAdmin(user) {
	if (!user && HasRole(user) && !user.role == 'admin')
		return false;
	return true;
}

function IsTeacher(user) {
	if (!user && HasRole(user) && !user.role == 'teacher')
		return false;
	return true;
}

function IsParent(user) {
	if (!user && HasRole(user) && !user.role == 'parent')
		return false;
	return true;
}

function IsStudent(user) {
	if (!user && HasRole(user) && !user.role == 'user')
		return false;
	return true;
}

function IsElevated(user) {
	if (IsStudent(user) || IsParent(user)) {
		return false;
	}
	return true;
}

// private

function HasRole(user) {
	if (!user || !user.role) {
		return false;
	}
	return true;
}
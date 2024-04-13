var Sequelize = require('sequelize');
module.exports = function (req, res, next) {
	const filter = {};
	if (req.query.offset) {
		filter.offset = parseInt(req.query.offset);
	}
	if (req.query.limit) {
		filter.limit = parseInt(req.query.limit);
	}
	req.filter = filter;

	next();
};
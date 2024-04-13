const CommentModel = require('../models').Comment;
const viewedCommentsModel = require('../models').viewedComments;

const users = require('../models').User;
var Sequelize = require('sequelize');

const db = require('../models');


const Methods = {};

Methods.create = async (req, res, next) => {
	const body = { ...req.body, createdBy: req.user.id };
	try {
		var result = await CommentModel.create(body)
		res.json(result);
	}
	catch (error) {
		next(error);
	}
}

Methods.unreadComments = async (req, res, next) => {
	if (typeof req.query.taskIds === "number") {
		req.query.taskIds = req.query.taskIds + '';
	}
	if (!req.query.taskIds || !req.query.taskIds.split) {
		return res.json([]);
	}
	let taskIdParams = req.query.taskIds.split(',');

	try {
		const unreadComments = await db.sequelize.query('select count(*) as unreadCommentsCount, timeEntryId from Comments where timeEntryId  in (:taskIds) and id not in (select commentId from viewedComments where userId = :userId) and createdBy != :userId group by timeEntryId',
			{
				replacements: {
					taskIds: taskIdParams,
					userId: req.user.id
				}, type: Sequelize.QueryTypes.SELECT
			});
		res.json(unreadComments);
	}
	catch (error) {
		next(error);
	}


}

Methods.findAll = async (req, res, next) => {


	const timeEntryId = req.query.timeEntryId;

	try {
		const condition = { active: true, timeEntryId }
		var result = await CommentModel.findAll({
			where: condition,
			include: [
				{
					model: users, as: "userInfo"
				}
			]
		})
		const viewedComments = result.map(c => {
			if (c.createdBy != req.user.id) {
				return {
					commentId: c.id,
					userId: req.user.id
				}
			}
		})
		await viewedCommentsModel.bulkCreate(viewedComments, { ignoreDuplicates: true });
		return res.json(result);
	}
	catch (error) {
		next(error);
	}
}

Methods.findOne = async (req, res, next) => {
	try {
		const condition = { active: false }
		var result = await CommentModel.findByPk(req.params.id,
			{
				where: condition,
				include: [
					{
						model: CommentModel,
						as: "reply"
					},
					{
						model: users, as: "userInfo"
					}
				]
			}
		)
		return res.json(result);
	}
	catch (error) {
		next(error);
	}
}

Methods.update = async (req, res, next) => {
	try {
		const id = req.params.id;
		var result = await CommentModel.update(req.body, { where: { id: id } })
		res.json(result);
	}
	catch (error) {
		next(error);
	}
}

module.exports = Methods;

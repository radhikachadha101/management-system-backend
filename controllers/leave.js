const Leave = require('../models').Leave;
const UserModel = require('../models').User;
const fs = require("fs");
var Sequelize = require('sequelize');
const { Op } = require('sequelize')
const moment = require('moment')
const Methods = {}

Methods.createLeave = async (req, res, next) => {
	try {
        req.body.createdBy = req.user.id;
		req.body.active= true;
		req.body.dateFrom = moment(req.body.dateFrom).format('MM/DD/YYYY');
		if(req.body.dateTo){
		req.body.dateTo = moment(req.body.dateTo).format('MM/DD/YYYY 23:59:59');
		}
		let result = null;
		const user = req.body;
		result = await Leave.create(req.body);
		return res.send(result)
	}
	catch (error) {
		next(error);
	}
}


Methods.findLeaves = async (req, res, next) => {
	var startDate = moment(req.query.startDate).format('MM/DD/YYYY 00:00:00');
	var endDate = moment(req.query.endDate).utc().format('MM/DD/YYYY 23:59:59');
    try {
		const { filter, query, user } = req;
		let result = [];
		let where = {
			active: true
		}
		if (user.userGroup.includes('ADMIN') || user.userGroup.includes('BD MANAGER')) {
			condition = {};
		} else if (user.userGroup.includes('BD TRAINEE')) {
			condition = user ? { createdBy: user.id } : null
			where = condition;

		}
		const ORFilter = [];
		if( query.startDate && query.endDate) {
			ORFilter.push({
				[Op.or]: [{
				dateFrom: {
					[Op.between]: [startDate,endDate]
				}
			}, {
				dateTo: {
					[Op.between]: [startDate, endDate]
				}
			}, {
			[Op.and]: [
				{
					dateFrom: {
						[Op.lte]: startDate
					}
				}, {
					dateTo: {
						[Op.gte]: endDate
					}
				}
		]	}
	]
	
			})
		}

		if (query.type) {
			ORFilter.push({
				type: {
					[Sequelize.Op.like]: `%${query.type}%`
				}
			})
		}

		if (ORFilter.length > 0) {
			where = {
				...where,
				[Sequelize.Op.and]: ORFilter
			}
		} else {
			where = {
				...where,
			}
		}
		let leave = await Leave.findAndCountAll({
            // ...filter,
			include: [
				{
					model: UserModel, as: 'userName',
				}
				],
                order: [
					['createdAt', 'DESC'],
				],
                where: 
				{
					[Sequelize.Op.and]: ORFilter,
				active: true,

            },
		});
		result.push({ data: leave.rows, 'totalRecords': leave.count });
		res.status(201).send(result)

	} catch (err) {
		throw err;

	}

}



Methods.findDateLeaves = async (req, res, next) => {
	try {
		const { filter, query, user } = req;
		let result = [];
		if (user.userGroup.includes('ADMIN') || user.userGroup.includes('BD MANAGER')) {
			condition = {};
		} else if (user.userGroup.includes('BD TRAINEE')) {
			condition = user ? { createdBy: user.id } : null
			where = condition;

		}
		const ORFilter = [];
		
		let leave = await Leave.findAndCountAll({
            ...filter,
			include: [
				{
					model: UserModel, as: 'userName',
				}
				],
                order: [
					['createdAt', 'DESC'],
				],
				where: {
					active: true,
				}
		});
		// result.push({ data: leave.rows, 'totalRecords': leave.count });
		res.status(201).send( leave.rows)

	} catch (err) {
		throw err;

	}

}

Methods.leaveById = async (req, res, next) => {
	try {
		let result = await Leave.findOne(
			{
				where: { id: req.params.id },
					include: [
						{
							model: UserModel, as: 'userName',
						}
						]
			});
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

Methods.updateLeave = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = req.body;
		req.body.updatedBy = req.user.id;
		var result = await Leave.update(user, { where: { id: id }});
		return res.send(result);

	} catch (error) {
		next(error);
	}
}


Methods.leaveDelete = async (req, res, next) => {
	try {
		const { id } = req.params;
		req.body.active= false;
		const user = req.body;
		req.body.updatedBy = req.user.id;
		var result = await Leave.update(user, { where: { id: id }});
		return res.send(result);

	} catch (error) {
		next(error);
	}
}








module.exports = Methods;

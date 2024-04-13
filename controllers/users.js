const UserModel = require('../models').User;
const UserGroupModel = require('../models').UserGroup;
var Sequelize = require('sequelize');
const UserGroupUsersModel =  require('../models').UserGroupUsers;
const createUsers = async (payload, filter = null, updateMany = false) => {

	try {
	
		let result = null;
		if (filter !== null) {
			if (updateMany) {
				result = await UserModel.updateMany(filter, payload);
			} else {
				result = await UserModel.update(payload, { where: filter });

			}
		} else {
			let check = await UserModel.findOne({where:{email:payload.email}});
			if(check && check.dataValues != null){
				return {error:true,message:'Email must be unique'};
			}

			payload.active = true;
			result = await UserModel.create(payload);

	}
		return result;
	} catch (err) {
		throw err;
	}
}
const findUsers = async (req, onlyOne = false) => {
	const { query, filter } = req;
	try {
		let result = [];
		if (onlyOne) {
			result = await UserModel.findOne({
				where: {id: req.id },

				include: [{ model: UserGroupUsersModel, as: 'userId',
				include: [{

					model: UserGroupModel, as: 'userGroup'
				}] }],
			});
		} else {
			let where
			const ORFilter = [];
			if (query.email) {
				ORFilter.push({
					email: {
						[Sequelize.Op.like]: `%${query.email}%`
					}
				})
			}
			if (query.name) {
				ORFilter.push({
					firstName: {
						[Sequelize.Op.like]: `%${query.name}%`
					}
				})

				ORFilter.push({
					lastName: {
						[Sequelize.Op.like]: `%${query.name}%`
					}
				})
			}



			let userGroup = {};
		if(query.userGroup){
			userGroup = {userGroupId: query.userGroup};
		}
			if (ORFilter.length > 0) {
				where = {
					...where,
					[Sequelize.Op.or]: ORFilter
				}
			} else {
				where = {
					...where,
				}
			}

			let users = await UserModel.findAndCountAll({
				include: [{ model: UserGroupUsersModel, as: 'userId',
				where:userGroup,
				include: [{

					model: UserGroupModel, as: 'userGroup'
				}] }],
				...filter,
				order: [
					['active', 'DESC'],
					['createdAt', 'DESC']
				],
				where,
			});
			result.push({ data: users.rows, 'totalRecords': users.count });
		}
		return result;
	}catch (err) {
	throw err;
}
}

const Methods = {};

Methods.create = async (req, res, next) => {
	try {
		const { id } = req.user;
		const user = req.body;
		user.createdBy = id;
		const result = await createUsers(user);
		if (result.dataValues.id && result.dataValues.id > 0) {
			let userGroupId = JSON.parse(JSON.stringify(req.body.userGroupId));
			let userGroupArray = [];
			for (let userGroup of userGroupId) {
			 userGroupArray.push({ userGroupId: userGroup.id, userId: result.dataValues.id, createdBy: req.user.id })
			}
			var data = await UserGroupUsersModel.bulkCreate(userGroupArray);
		}
		res.status(201).json(result);
	}
    catch(error){

		console.log("err ",err)
        next(error);
    }
}

Methods.findAll = async (req, res, next) => {
	try {
		const {id, userGroup } = req.user;
		if (userGroup.includes('ADMIN')) {
			// filter.createdBy = id
		}

		var result = await findUsers(req)
		return res.json(result);
	}
    catch(error){
        next(error);
    }
}

Methods.findOne = async (req, res, next) => {
	try {
		const { id } = req.params;
		var result = await findUsers({ id }, true)
		res.json(result);
	}
    catch(error){
        next(error);
    }
}

Methods.update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedUser = req.body;
		let result = await createUsers(updatedUser, { id });
		let userGroupId =JSON.parse(JSON.stringify(req.body.userGroupId));
		let userGroup = await UserGroupUsersModel.findAll({ where: { userId: req.params.id } });
		let a = [];
		userGroup.forEach(async (userProjects) => {
			let ab = userGroupId.includes(userProjects.dataValues.roll);
			if (ab == false) {
				await UserGroupUsersModel.destroy({ where: { userId: req.params.id } });
			} else {
				a.push(userProjects.dataValues.skillId);
			}
		});

		for (let userGroup of userGroupId) {
			let ab = a.includes(userGroup);
			if (ab == false) {
				result = await UserGroupUsersModel.create({ userId: req.params.id, userGroupId: userGroup.id });
			}
		}
		res.json(result);
	}
    catch(error){
        next(error);
    }
}

Methods.delete = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await createUsers({ active: false }, { id });
		res.json(result);
	}
    catch(error){
        next(error);
    }
}

Methods.passwordUpdate = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedUser = req.body;
		const result = await createUsers(updatedUser, { id });
		res.json(result);
	}
    catch(error){
        next(error);
    }
}

Methods.disableUser = async (req, res, next) => {
	try {
		const { userGroup, id } = req.user;
		if (userGroup.includes('ADMIN')) {
			// filter.createdBy = id
		}
		const { userid } = req.params;
		const updatedUser = req.body;
		var result = await createUsers(updatedUser,{userid});
		return res.json(result);
	}
    catch(error){
        next(error);
    }
}



module.exports = Methods;
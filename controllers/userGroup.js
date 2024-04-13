const userGroup = require('../models').UserGroup;
const userGroupPermission = require('../models').UserGroupPermission;
const RouteModel = require('../models').Route;
const PermissionModel = require('../models').Permission;


const Methods = {}

Methods.findAll = async (req, res, next) => {
    try {
        var result = await userGroup.findAll();
        return res.send(result)
    }
    catch (error) {
        next(error);
    }
}


Methods.findOne = async (req, res, next) => {
    try {
        var result = await userGroup.findOne({ where: { id: req.query.userGroup } });
        return res.send(result)
    }
    catch (error) {
        next(error);
    }
}


Methods.userGroupPermission = async (req, res, next) => {
	try {
		var result = await userGroupPermission.findAll({
			include: [
				{
					model: userGroup, as: 'userGroup',
				},
				{
					model: RouteModel, as: 'route',
				},
                {
					model: PermissionModel, as: 'permission',
				}],
				// group: ["userGroupId"],

		});
		return res.send(result)
	}
	catch (error) {
		next(error);
	}
}


Methods.Routes = async (req, res, next) => {
	try {
		var result = await RouteModel.findAll({
				// group: ["userGroupId"],

		});
		return res.send(result)
	}
	catch (error) {
		next(error);
	}
}


Methods.userGroupPermissionById = async (req, res, next) => {
	try {
		let result = await userGroupPermission.findAll(
			{
				include: [
					{
						model: userGroup, as: 'userGroup',
					},
					{
						model: RouteModel, as: 'route',
					},
					{
						model: PermissionModel, as: 'permission',
					}],
				where: { userGroupId: req.query.userGroup },
			});
		return res.send(result)
	}
	catch (error) {
		next(error);
	}
}


Methods.updateUserGroupPermissions = async (req, res, next) => {
	try {
		const { id } = req.params;
		let result;
		// const result = await createUsers(updatedUser, { id });
		let userGroupPermissions = req.body.Permisssion;

		let userGroupPermissionArray = await userGroupPermission.findAll({ where: { userGroupId: req.body.id } });
		let a = [];
		userGroupPermissionArray.forEach(async (userProjects) => {
			let userPermission =userGroupPermissions.some(i=> i.permission == userProjects.dataValues.permissionId && i.routeId == userProjects.dataValues.routeId);
			if (userPermission == false) {
				await userGroupPermission.destroy({ where: { userGroupId: req.body.id, routeId: userProjects.dataValues.routeId, permissionId:userProjects.dataValues.permissionId } });
			} else {
				a.push({permission:userProjects.dataValues.permissionId, route:userProjects.dataValues.routeId});
			}
			
		}, );

		for (let permission of userGroupPermissions) {
			let ab = a.some(i=> i.permission == permission.permission && i.route == permission.routeId );
			if (ab == false) {
				result = await userGroupPermission.create({ userGroupId: req.body.id, routeId: permission.routeId, permissionId:permission.permission });
			}
		}
		res.json(result);
	}
    catch(error){
        next(error);
    }
}

module.exports = Methods;
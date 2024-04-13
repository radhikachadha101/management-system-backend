var express = require('express');
var router = express.Router();
const ProjectModel = require('../models').Project;
const UserModel = require('../models').User;
const UserProjectModel = require('../models').UserProject;
const TeamLeadProjectModel = require('../models').TeamLeadProject;
var Sequelize = require('sequelize');

const createProjects = async (payload, filter = null, updateMany = false) => {
	try {
		let result = null;
		if (filter !== null) {
			if (updateMany) {
				result = await ProjectModel.updateMany(filter, payload);
			} else {
				const { users, team_leads, ...rest } = payload;
				result = await ProjectModel.update({
					name: payload.name,
					startDate: payload.startDate,
					endDate: payload.endDate,
					description: payload.description
				}, { where: filter });

				// check user project if exists than update if not available than create or delete 
				let allUserProjects = await UserProjectModel.findAll({ where: { projectId: filter.id } });
				let a = [];
				allUserProjects.forEach(async (userProjects) => {
					let ab = users.includes(userProjects.dataValues.userId);
					if (ab == false) {
						await UserProjectModel.destroy({ where: { projectId: filter.id, id: userProjects.dataValues.id } });
					}
					a.push(userProjects.dataValues.userId);
				});

				for (let user of users) {
					let ab = a.includes(user);
					if (ab == false) {
						 result = await UserProjectModel.create({ projectId: filter.id, userId: user });
					}
				}

				// check teamlead project if exists than update if not available than create or delete 
				let allTeamLeadProjects = await TeamLeadProjectModel.findAll({ where: { projectId: filter.id } });
				let t = []
				allTeamLeadProjects.forEach(async (teamLeadProjectsData) => {
					let ab = team_leads.includes(teamLeadProjectsData.dataValues.userId);
					if (ab == false) {
						await TeamLeadProjectModel.destroy({ where: { projectId: filter.id, userId: teamLeadProjectsData.dataValues.userId } });
					}
					t.push(teamLeadProjectsData.dataValues.userId);
				});

				for (let user of team_leads) {
					let ab = t.includes(user);
					if (ab == false) {
						result = await TeamLeadProjectModel.create({ projectId: filter.id, userId: user });
					}
				}
			}
		} else {
			payload.active = true;
			const { users, team_leads, ...rest } = payload;
			result = await ProjectModel.create(rest);
			users.forEach(async (id) => {
				await UserProjectModel.create({ projectId: result.dataValues.id, userId: id })
			})
			team_leads.forEach(async (id) => {
				await TeamLeadProjectModel.create({ projectId: result.dataValues.id, userId: id })
			})

		}
		return result;
	} catch (err) {
		throw err;
	}
}
const findProjects = async (req, onlyOne = false) => {
	try {
		const { filter, query, user } = req;
		let result = [];

		if (onlyOne) {
			result = await ProjectModel.findOne(
				{
					where: { id: req.id },
					include: [
						{
							model: TeamLeadProjectModel, as: 'TeamLeadProject',
							include: [{

								model: UserModel, as: 'userInfo'
							}]
						},
						{
							model: UserProjectModel, as: 'UserProject',
							include: [{

								model: UserModel, as: 'userInfo'
							}]
						}
					]
				},
			);
		} else {


			let where = {
				active: true
			}
			const ORFilter = [];
			if (query.description) {
				ORFilter.push({
					description: {
						[Sequelize.Op.like]: `%${query.description}%`
					}
				})
			}
			if (query.name) {
				ORFilter.push({
					name: {
						[Sequelize.Op.like]: `%${query.name}%`
					}
				})
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


			if (user.userGroup.includes('Dev')) {
				const userProjects = await UserProjectModel.findAll({ where: { userId: user.id }, attributes: ['projectId'] })
				const projectIds = userProjects.map(u => u.get('projectId'))
				where = {
					...where,
					id: {
						[Sequelize.Op.in]: projectIds
					}
				};

			} else if (user.userGroup.includes('TeamLead')) {
				// get tasks for projects created by team lead
				//admin
				const projects = await TeamLeadProjectModel.findAll({ where: { userId: user.id }, attributes: ['projectId'] })
				const projectIds = projects.map(u => u.get('projectId'))
				where = {
					...where,
					id: {
						[Sequelize.Op.in]: projectIds
					}
				};
			}


			let projects = await ProjectModel.findAndCountAll({
				...filter,
				where,
			});
			result.push({ data: projects.rows, 'totalRecords': projects.count });
		}
		return result;
	} catch (err) {
		throw err;
	}
}
router.get(
	'/', async (req, res, next) => {
		try {
			const result = await findProjects(req);
			res.json(result);
		}
		catch (error) {
			next(error);
		}
	}
);
router.post(
	'/', async (req, res, next) => {
		try {
			const project = req.body;
			// project.createdBy = req.user.username;
			const result = await createProjects(project);
			res.json(result);
		}
		catch (error) {
			next(error);
		}
	}
);
router.get(
	'/:id', async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await findProjects({ id: id }, true);
			res.json(result);
		}
		catch (error) {
			next(error);
		}
	}
);
router.put(
	'/:id', async (req, res, next) => {
		try {
			const { id } = req.params;
			const updatedProject = req.body;
			const result = await createProjects(updatedProject, { id: id });
			res.json(result);
		}
		catch (error) {
			next(error);
		}
	}
);

router.delete(
	'/:id', async (req, res, next) => {
		try {
			const { id } = req.params;
			const result = await ProjectModel.update({
				active: false,
			}, { where: { id: id } });

			res.json(result);
		}
		catch (error) {
			next(error);
		}
	}
);
module.exports = router;

const Skills = require('../models').Skill;
const channels = require('../models').Channel;
const bidStatus = require('../models').BidStatus;
const Proposal = require('../models').Proposal;
const ProposalSkill = require('../models').ProposalSkill;
const ProposalType = require('../models').ProposalType;
const ProposalDocument = require('../models').ProposalDocument;
const UserModel = require('../models').User;
const Countries = require('../models').Countries;
const ProposalComments = require('../models').ProposalComments;
const ClientDetail = require('../models').ClientDetail;
const bidProfiles = require('../models').BidProfile;
const HiredProposalProfile = require('../models').HiredProposalProfile;
const fs = require("fs");
var Sequelize = require('sequelize');
const { Op } = require('sequelize')
const moment = require('moment')
const Methods = {}



const skill = async (payload, filter = null, updateMany = false) => {
	let result = null;

	try {
		if (filter !== null) {
			// if (updateMany) {
			// 	result = await bidProfiles.updateMany(filter, payload);
			// } else {
			let checkUpdate = await Skills.findOne({ where: { skill: payload.skill } });
			if (checkUpdate && checkUpdate.dataValues != null) {
				return { error: true, message: 'Skill must be unique' };
			}
			result = await Skills.update(payload, { where: filter });
		}
		else {
			let check = await Skills.findOne({ where: { skill: payload.map((i) => i.skill) } });
			if (check && check.dataValues != null) {
				return { error: true, message: 'Skill must be unique' };
			}

			payload.active = true;
			result = await Skills.bulkCreate(payload);
		}
		return result;
	} catch (err) {
		throw err;
	}
}

Methods.skills = async (req, res, next) => {
	try {
		const { filter, query } = req;
		if (Object.keys(req.query).length == 0) {
			var result = await Skills.findAll();
		}
		if (Object.keys(req.query).length > 0) {
			var result = [];

			let where = {
				active: true
			}
			condition = {};
			const ORFilter = [];

			if (query.name) {
				ORFilter.push({
					skill: {
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


			let proposal = await Skills.findAndCountAll({
				...filter,
				where,
				distinct: true,
				order: [
					['createdAt', 'DESC'],
				],
			});
			result.push({ data: proposal.rows, 'totalRecords': proposal.count });
		}
		// if(result.length){
		return res.send(result)
		// }		}
		// if(result.length){
		// return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

const Profile = async (payload, filter = null, updateMany = false) => {
	let result = null;

	try {
		if (filter !== null) {
			// if (updateMany) {
			// 	result = await bidProfiles.updateMany(filter, payload);
			// } else {
			let checkUpdate = await bidProfiles.findOne({ where: { email: payload.email } });
			if (checkUpdate && checkUpdate.dataValues != null) {
				return { error: true, message: 'Email must be unique' };
			}
			result = await bidProfiles.update(payload, { where: filter });
		}
		else {
			let check = await bidProfiles.findOne({ where: { email: payload.email } });
			if (check && check.dataValues != null) {
				return { error: true, message: 'Email must be unique' };
			}

			payload.active = true;
			result = await bidProfiles.create(payload);
		}
		return result;
	} catch (err) {
		throw err;
	}
}


Methods.updateProfile = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedProfile = req.body;
		var result = await Profile(updatedProfile, { id });
		return res.send(result);

	} catch (error) {
		next(error);
	}
}

Methods.updateSkill = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedSkill = req.body;
		var result = await skill(updatedSkill, { id });
		return res.send(result);

	} catch (error) {
		next(error);
	}
}




Methods.ProfileById = async (req, res, next) => {
	try {
		let result = await bidProfiles.findOne(
			{
				where: { id: req.params.id },
			});
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

Methods.skillById = async (req, res, next) => {
	try {
		let result = await Skills.findOne(
			{
				where: { id: req.params.id },
			});
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}





Methods.createProfile = async (req, res, next) => {
	try {
		let result = null;
		const user = req.body;
		result = await Profile(user);
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

Methods.BidProfiles = async (req, res, next) => {
	try {
		const { filter, query } = req;
		if (Object.keys(req.query).length == 0) {
			var result = await bidProfiles.findAll();
		}
		if (Object.keys(req.query).length > 0) {
			var result = [];

			let where = {
			}
			condition = {};
			const ORFilter = [];

			if (query.name) {
				ORFilter.push({
					name: {
						[Sequelize.Op.like]: `%${query.name}%`
					}
				})
			}
			if (query.email) {
				ORFilter.push({
					email: {
						[Sequelize.Op.like]: `%${query.email}%`
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

			let profile = await bidProfiles.findAndCountAll({
				...filter,
				where,
				distinct: true,
				order: [
					[query.orderBy, query.sortColumn],
				],
			});
			result.push({ data: profile.rows, 'totalRecords': profile.count });
		}
		// if(result.length){
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}
Methods.CreateSkills = async (req, res, next) => {
	try {

		const body = {
			...req.body
		}
		var result = await skill(req.body);
		// if(result.length){

		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}



Methods.client = async (req, res, next) => {
	try {
		const { filter, query } = req;
		if (Object.keys(req.query).length == 0) {
			var result = await ClientDetail.findAll();
		}
		if (Object.keys(req.query).length > 0) {
			var result = [];

			let where = {
			}
			condition = {};
			const ORFilter = [];

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


			let client = await ClientDetail.findAndCountAll({
				...filter,
				where,
				include: [
					{
						model: UserModel, as: 'createdUser',
					},
					{
						model: UserModel, as: 'updatedUser',
					}
				],
				distinct: true,
				order: [
					['createdAt', 'DESC'],
				],
			});

			let proposal = await Proposal.findAndCountAll({
				attributes: ['ClientDetail.*', 'Proposal.*', [Sequelize.fn('COUNT', 'Proposal.statusId'), 'userProposal'
				],
				],
				where: {
					statusId: 5,
				},
				group: ["Proposal.clientId"],

				include: [
					{
						model: ClientDetail, as: 'ClientDetail',
					}
				],
				distinct: true,
				order: [
					['createdAt', 'DESC'],
				],
			});
			let arr = []

			result.push({ data: client.rows, datavalue: proposal.rows, 'totalRecords': client.count });
		}

		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

Methods.countries = async (req, res, next) => {
	try {
		var result = await Countries.findAll();
		// if(result.length){
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}
Methods.changeStatus = async (req, res, next) => {
	try {
		req.body.createdBy = req.user.id;
		if (req.body.comment && req.body.statusId) {
			let updateProposal = await Proposal.update({ statusId: req.body.statusId }, {
				where: { id: req.body.proposalId }, returning: true,
				plain: true
			});
			var result = await ProposalComments.create(req.body);
		}

		if (req.body.statusId == 5) {
			if (!req.body.clientId) {
				var result = await ClientDetail.create(req.body);
				let updateProposal = await Proposal.update({
					statusId: req.body.statusId, updatedBy: req.user.id
					, clientId: result.dataValues.id
				}, {
					where: { id: req.body.proposalId }, returning: true,
					plain: true
				});
				let hireData = req.body.hiredIds.map(item => {
					return {
						profileId: item.profileId,
						contractLimit: item.contractLimit,
						proposalId: req.body.proposalId,
						clientId: result.dataValues.id,
						createdBy: req.user.id,
					};
				});

				var data = await HiredProposalProfile.bulkCreate(hireData);

			}
			if (req.body.clientId) {
				let updateProposal = await Proposal.update({
					statusId: req.body.statusId, updatedBy: req.user.id,
					clientId: req.body.clientId,
				}, {
					where: { id: req.body.proposalId }, returning: true,
					plain: true
				});

				let hireData = req.body.hiredIds.map(item => {
					return {
						profileId: item.profileId,
						contractLimit: item.contractLimit,
						proposalId: req.body.proposalId,
						clientId: req.body.clientId,
						createdBy: req.user.id,
					};
				});

				var data = await HiredProposalProfile.bulkCreate(hireData);

			}

		}
		res.status(201).send(result)

	}
	catch (error) {
		console.log("err ",error)
		next(error);
	}
}


Methods.findOneProposal = async (req, res, next) => {

	try {
		let result = await Proposal.findOne(
			{

				where: { id: req.params.id },
				include: [
					{
						model: channels, as: 'channel',

					},
					{ model: bidProfiles, as: 'profile' },
					{
						model: bidStatus, as: 'status'

					},
					{
						model: ProposalDocument, as: 'ProposalDocuments',

					},
					{
						model: HiredProposalProfile, as: 'HiredProposalProfile',
						include: [{

							model: ClientDetail, as: 'client'
						},
						{ model: bidProfiles, as: 'profile' }
						],

					},
					{
						model: ProposalType, as: 'proposalType',


					},
					{
						model: ProposalSkill, as: 'proposalSkill',
						include: [{

							model: Skills, as: 'skill'
						}]

					},
					{
						model: ClientDetail, as: 'ClientDetail',

						include: [{ model: Countries, as: 'country' }]

					},
					{
						model: ProposalComments, as: 'ProposalComments',
						include: [{ model: UserModel, as: 'user' },
						{
							model: bidStatus, as: 'status',

						}],
					}


				]
			},
		);
		res.status(201).send(result)
	}
	catch (error) {
		next(error);
	}
}

Methods.proposalType = async (req, res, next) => {
	try {
		var result = await ProposalType.findAll();
		// if(result.length){
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

Methods.channels = async (req, res, next) => {
	try {
		var result = await channels.findAll();
		return res.send(result)
	}
	catch (error) {
		next(error);
	}
}

Methods.create = async (req, res, next) => {

	try {

		// const errors = validationResult(req)
		// if(!errors.isEmpty()){
		//     return res.status(400).json({errors: errors.array()})
		// }
		var fullUrl = req.protocol + '://' + req.get('host');

		const body = {
			name: req.body.name,
			createdBy: req.user.id,
			userId: req.user.id,
			active: true,
			...req.body
		};
		var result = await Proposal.create(body);
		if (result.dataValues.id && result.dataValues.id > 0) {
			let skills = JSON.parse(req.body.skill);
			let skillarray = [];
			for (let skill of skills) {
				skillarray.push({ skillId: skill, proposalId: result.dataValues.id, createdBy: req.user.id })
			}
			var data = await ProposalSkill.bulkCreate(skillarray);

		}
		if (result.dataValues.id && result.dataValues.id > 0) {
			let files = req.files
			let filesarray = [];
			for (let file of files) {
				var filename = file.path.substring(file.path.lastIndexOf("/") + 0);
				var url = `${fullUrl + '/uploads/proposals/' + filename}`
				filesarray.push({
					originalName: file.originalname,
					documentUrl: url,
					filePath: file.path,
					mimeType: file.mimetype,
					filename: file.filename,
					proposalId: result.dataValues.id,
					createdBy: req.user.id
				})
			}

			var data = await ProposalDocument.bulkCreate(filesarray);
		}
		res.status(201).send(result)
	}
	catch (error) {
		next(error);
	}
}

Methods.update = async (req, res, next) => {
	try {
		// const errors = validationResult(req)
		// if(!errors.isEmpty()){
		//     return res.status(400).json({errors: errors.array()})
		// }
		var fullUrl = req.protocol + '://' + req.get('host');

		const body = {
			name: req.body.name,
			updatedBy: req.user.id,
			userId: req.user.id,
			active: true,
			...req.body
		};
		var result = await Proposal.update(body, {
			where: { id: req.params.id }, returning: true,
			plain: true
		});
		let skills = JSON.parse(req.body.skill);
		let skillarray = [];

		let allpurposalSkills = await ProposalSkill.findAll({ where: { proposalId: req.params.id } });

		let a = [];
		allpurposalSkills.forEach(async (userProjects) => {
			let ab = skills.includes(userProjects.dataValues.skillId);
			if (ab == false) {
				await ProposalSkill.destroy({ where: { id: userProjects.dataValues.id } });
			} else {
				a.push(userProjects.dataValues.skillId);
			}
		});

		for (let user of skills) {
			let ab = a.includes(user);
			if (ab == false) {
				resuaslt = await ProposalSkill.create({ proposalId: req.params.id, skillId: user });
			}
		}

		if (req.params.id && req.files && req.files.length > 0) {

			let files = req.files
			// const { image, fileName } = req.body;
			let filesarray = [];
			for (let file of files) {
				var filename = file.filename;
				var url = `${fullUrl + '/uploads/proposals/' + filename}`
				filesarray.push({
					originalName: file.originalname,
					documentUrl: url,
					filePath: file.path,
					mimeType: file.mimetype,
					filename: file.filename,
					proposalId: req.params.id,
					createdBy: req.user.id
				})
			}

			var data = await ProposalDocument.bulkCreate(filesarray);
		}
		res.status(201).send(result)
	}
	catch (error) {
		next(error);
	}
}

Methods.status = async (req, res, next) => {
	try {
		var result = await bidStatus.findAll();
		return res.send(result)
	}
	catch (error) {
		next(error);
	}
}

Methods.findProposals = async (req, res, next) => {
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


		if (query.channels && !query.status && !query.name && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				channelId: {
					[Sequelize.Op.like]: `%${query.channels}%`
				}
			})
		}
		if (query.startDate && query.endDate && !query.channels && !query.status && !query.name && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				createdAt: {
					[Op.between]: [moment(query.startDate).utc().format('MM/DD/YYYY'), moment(query.endDate).utc().format('MM/DD/YYYY 23:59:59')]
				}
			})
		}


		if (query.user && !query.channels && !query.status && !query.name && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				createdBy: {
					[Sequelize.Op.like]: `%${query.user}%`
				}
			})
		}

		if (query.client && !query.status && !query.name && !query.skills && !query.profile && !query.channels) {
			ORFilter.push({
				clientId: {
					[Sequelize.Op.like]: `%${query.client}%`
				}
			})
		}
		if (query.profile && !query.status && !query.name && !query.skills && !query.channels && !query.client) {
			ORFilter.push({
				profileId: {
					[Sequelize.Op.like]: `%${query.profile}%`
				}
			})
		}
		if (query.status && !query.channels && !query.name && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				statusId: {
					[Sequelize.Op.like]: `%${query.status}%`
				}
			})
		}
		if (query.name && !query.status && !query.channels && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				name: {
					[Sequelize.Op.like]: `%${query.name}%`
				}
			})
		}
		if (query.status && !query.channels && !query.name && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				statusId: {
					[Sequelize.Op.like]: `%${query.status}%`
				}
			})
		}
		if (query.name && query.status && !query.channels && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				name: {
					[Sequelize.Op.like]: `%${query.name}%`
				}
			})
			ORFilter.push({
				statusId: {
					[Sequelize.Op.like]: `%${query.status}%`
				}
			})
		}
		if (query.name && !query.status && !query.channels && !query.skills && query.profile && !query.client) {
			ORFilter.push({
				name: {
					[Sequelize.Op.like]: `%${query.name}%`
				}
			})

			ORFilter.push({
				profileId: {
					[Sequelize.Op.like]: `%${query.profile}%`
				}
			})
		}
		if (query.name && !query.status && !query.channels && !query.skills && !query.profile && query.client) {
			ORFilter.push({
				name: {
					[Sequelize.Op.like]: `%${query.name}%`
				}
			})

			ORFilter.push({
				clientId: {
					[Sequelize.Op.like]: `%${query.client}%`
				}
			})
		}
		if (query.name && !query.status && !query.channels && !query.skills && !query.profile && !query.client) {
			ORFilter.push({
				name: {
					[Sequelize.Op.like]: `%${query.name}%`
				}
			})

			ORFilter.push({
				channelId: {
					[Sequelize.Op.like]: `%${query.channels}%`
				}
			})
		}
		if (!query.name && query.status && query.channels) {
			ORFilter.push({
				statusId: {
					[Sequelize.Op.like]: `%${query.status}%`
				}
			})

			ORFilter.push({
				channelId: {
					[Sequelize.Op.like]: `%${query.channels}%`
				}
			})
		}

		if (query.name && query.status && query.channels) {
			ORFilter.push({
				name: {
					[Sequelize.Op.like]: `%${query.name}%`
				}
			})

			ORFilter.push({
				statusId: {
					[Sequelize.Op.like]: `%${query.status}%`
				}
			})

			ORFilter.push({
				channelId: {
					[Sequelize.Op.like]: `%${query.channels}%`
				}
			})
		}
		if (!query.name && query.status && query.client) {
			ORFilter.push({
				statusId: {
					[Sequelize.Op.like]: `%${query.status}%`
				}
			})

			ORFilter.push({
				clientId: {
					[Sequelize.Op.like]: `%${query.client}%`
				}
			})
		}

		// if (query.jobUrl) {
		// 	ORFilter.push({
		// 		name: {
		// 			[Sequelize.Op.like]: `%${query.JobUrl}%`
		// 		}
		// 	})
		// }
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
		let a = {};
		if (query.skill) {
			a = { skillId: query.skill };
		}

		let proposal = await Proposal.findAndCountAll({
			...filter,
			where,
			include: [
				{
					model: channels, as: 'channel',
				},
				{
					model: ProposalComments, as: 'ProposalComments',
					order: [['id', 'DESC']]
				},
				{
					model: bidStatus, as: 'status',
				},
				{
					model: ProposalSkill, as: 'proposalSkill',
					where: a,
					include: [{

						model: Skills, as: 'skill',
					}]

				},
				{
					model: UserModel, as: 'userInfo',
				},
				{
					model: bidProfiles, as: 'profile',
				},

			],
			distinct: true,
			order: [
				[query.orderBy, query.sortColumn],
			],
		});
		result.push({ data: proposal.rows, 'totalRecords': proposal.count });
		res.status(201).send(result)

	} catch (err) {
		throw err;

	}

}

Methods.statistics = async (req, res, next) => {
	var startDate = moment(req.query.startDate).format('MM/DD/YYYY');
	var endDate = moment(req.query.endDate).utc().format('MM/DD/YYYY 23:59:59')
	const { data } = req.query;
	try {
		const { filter, query, user } = req;

		let where = {
			active: true
		}
		if (user.userGroup.includes('ADMIN') || user.userGroup.includes('BD MANAGER')) {
			condition = {};
		} else if (user.userGroup.includes('BD TRAINEE')) {
			condition = user ? { createdBy: user.id } : null
			where = condition;

		}
		var result = await Proposal.findAll({
			...filter,
			attributes: ['userInfo.*', 'Proposal.*', [Sequelize.fn('COUNT', 'Proposal.id'), 'userProposal'
			],
			],
			include: [{
				model: UserModel, as: 'userInfo',
			},],
			group: ["Proposal.createdBy"],
			where: {
				...where,
				createdAt: {
					[Op.between]: [startDate, endDate]
				}
			},


		});
		return res.send(result)
	}
	catch (error) {
		next(error);
	}
}



Methods.findstatus = async (req, res, next) => {
	var startDate = moment(req.query.startDate).format('MM/DD/YYYY');
	var endDate = req.query.endDate
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
		if (query.jobUrl) {
			ORFilter.push({
				name: {
					[Sequelize.Op.like]: `%${query.JobUrl}%`
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

		let proposal = await Proposal.findAndCountAll({
			...filter,
			where,
			include: [
				{
					model: channels, as: 'channel',


				},
				{
					model: bidStatus, as: 'status',
				},
				{
					model: ProposalSkill, as: 'proposalSkill',
					include: [{

						model: Skills, as: 'skill'
					}]

				}
			],
			distinct: true,
			order: [
				['proposalDate', 'DESC'],
			],
			where:
			{
				...where,
				createdAt: {
					[Op.between]: [startDate, endDate]
				},
				active: true

			},

		});
		return res.send(proposal.rows)
	} catch (err) {
		throw err;

	}

}


Methods.bidstatus = async (req, res, next) => {
	try {
		const { filter, query } = req;
		if (Object.keys(req.query).length == 0) {
			var result = await bidStatus.findAll();
		}
		if (Object.keys(req.query).length > 0) {
			var result = [];

			let where = {
			}
			condition = {};
			const ORFilter = [];

			if (query.status) {
				ORFilter.push({
					status: {
						[Sequelize.Op.like]: `%${query.status}%`
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

			let profile = await bidStatus.findAndCountAll({
				...filter,
				where,
				distinct: true,
				order: [
					[query.orderBy, query.sortColumn],
				],
			});
			result.push({ data: profile.rows, 'totalRecords': profile.count });
		}
		// if(result.length){
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

const Status = async (payload, filter = null, updateMany = false) => {
	let result = null;

	try {
		if (filter !== null) {
			// if (updateMany) {
			// 	result = await bidProfiles.updateMany(filter, payload);
			// } else {
			let checkUpdate = await bidStatus.findOne({ where: { status: payload.status } });
			if (checkUpdate && checkUpdate.dataValues != null) {
				return { error: true, message: 'Status must be unique' };
			}
			result = await bidStatus.update(payload, { where: filter });
		}
		else {
			let check = await bidStatus.findOne({ where: { status: payload.status } });
			if (check && check.dataValues != null) {
				return { error: true, message: 'status must be unique' };
			}

			payload.active = true;
			result = await bidStatus.create(payload);
		}
		return result;
	} catch (err) {
		throw err;
	}
}


Methods.createStatus = async (req, res, next) => {
	try {
		let result = null;
		const user = req.body;
		result = await Status(user);;
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

Methods.StatusById = async (req, res, next) => {
	try {
		let result = await bidStatus.findOne(
			{
				where: { id: req.params.id },
			});
		return res.send(result)
		// }
		// throw new Error("No data found")
	}
	catch (error) {
		next(error);
	}
}

Methods.updateStatus = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updatedStatus = req.body;
		var result = await Status(updatedStatus, { id });
		return res.send(result);

	} catch (error) {
		next(error);
	}
}


Methods.addComment = async (req, res, next) => {
	try {
		req.body.createdBy = req.user.id;
		var result = await ProposalComments.create(req.body);
		res.status(201).send(result)

	}
	catch (error) {
		next(error);
	}
}


const client = async (payload, filter = null, updateMany = false) => {
	let result = null;
	try {
		if (filter !== null) {

			result = await ClientDetail.update(payload, { where: filter });
		}
		else {
			let check = await ClientDetail.findOne({ where: { email: payload.email } });
			if (check && check.dataValues != null) {
				return { error: true, message: 'Client must be unique' };
			}

			// payload.active = true;
			result = await ClientDetail.create(payload);
		}
		return result;
	} catch (err) {
		throw err;
	}
}

Methods.addClient = async (req, res, next) => {
	try {
		// let result = null;
		const user = req.body;
		req.body.createdBy = req.user.id;
		var result = await client(user);
		return res.send(result)

	}
	catch (error) {
		next(error);
	}
}

Methods.clientById = async (req, res, next) => {
	try {
		let result = await ClientDetail.findOne(
			{
				where: { id: req.params.id },
				include: [
					{
						// model: ClientDetail, as: 'ClientDetail',
						model: Countries, as: 'country',

					},
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

Methods.updateClient = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = req.body;
		req.body.updatedBy = req.user.id;
		var result = await client(user, { id });
		return res.send(result);

	} catch (error) {
		next(error);
	}
}

Methods.documemtDelete = async (req, res, next) => {
	try {
		const { id } = req.params;
		let data = await ProposalDocument.findOne({ where: { id: id } });
		if (data.dataValues.id > 0) {
			fs.unlinkSync(data.dataValues.filePath);
		}
		const result = await ProposalDocument.destroy({
			where: {
				id: id
			}
		}
		);
		res.json(result);
	}
	catch (error) {
		next(error);
	}
}
module.exports = Methods;
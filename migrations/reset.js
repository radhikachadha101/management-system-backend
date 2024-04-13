/**
 * This script is responsible for reseting the SQL database.
 * Run it via `npm run db:reset`.
 */
require('dotenv').config()
const { model } = require('mongoose');
const models = require('../models');
const userGroup =  require('./userGroup');
const taskStatuses =  require('./taskStatuses');
const approvedStatuses =  require('./approvedStatuses');
const channels =  require('./channels');
const skills =  require('./skills');
const bidStatus =  require('./bidStatus');
const proposalType =  require('./proposalType');
const countries =  require('./countries');
const BidProfile = require('./bidProfile');
const permissions = require('./permission');
const routes = require('./routes');
const userGroupPermissions = require('./userGroupPermissions')



console.log(`Resetting Database...`);

models.sequelize
	.sync({
		force: true
	})

	.then(async () => {
		await models.UserGroup.bulkCreate(userGroup);
		await models.TaskStatus.bulkCreate(taskStatuses);
		await models.ApprovedStatus.bulkCreate(approvedStatuses);
		await models.Channel.bulkCreate(channels);
		await models.Skill.bulkCreate(skills);
		await models.BidStatus.bulkCreate(bidStatus);
		await models.ProposalType.bulkCreate(proposalType);
		await models.Countries.bulkCreate(countries);
		await models.BidProfile.bulkCreate(BidProfile);
		await models.Permission.bulkCreate(permissions);
		await models.Route.bulkCreate(routes);
		await models.UserGroupPermission.bulkCreate(userGroupPermissions);

		

		console.log('OK');
		process.exit();
	})
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});

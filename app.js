var debug = require('debug')('simpleserver:app');
var express = require('express');
var dottenv = require('dotenv');
var cookieParser = require('cookie-parser');
var morganLogger = require('morgan');
var passport = require('passport');
var cors = require('cors');
dottenv.config();
var dbConn = require('./models');
var addAbility = require('./middlewares/auth/ability');
const pagination = require('./middlewares/filter/pagination');
const errorLogs = require('./controllers/errorLog');
const logger = require('./util/Logger')
const cron = require('node-cron');
const Proposal = require('./models').Proposal;
const CronJob = require('cron').CronJob;
const ProjectModel = require('./models').Project;

//Connect Database

// const checkStatus =  new CronJob({
//     cronTime: '* * * * *', // every 24 hours
//     onTick: function() {
//       console.log(`
//            Runing a job at 01:00`
//       );
// 	//  let where
// 	// result = await ClientDetail.update(payload, { where: filter });
// 	Proposal.update(
		
// 		{
// 			statusId: '2'
// 	// 	, createdAt: { 
//     //     $lt: new Date(), 
//     //    $gt: new Date(new Date().setDate(new Date().getDate()-1))
//     //  }
// 	}, {  where: {
// 		statusId: '4'
// 	}
//    })
//     },
//     start: true,
//     timezone: "+05:30"
//   });



const serveIndex = require('serve-index');


process.on("uncaughtException", (e) => {
	try {
		logger.error('uncaughtException ===================>')
		logger.error(e);
		errorLogs.errorLogging(null, err);
	} catch (error) {

	}


});
process.on("unhandledRejection", (e) => {
	try {
		logger.error('unhandledRejection ===================>')
		logger.error(e);
		errorLogs.errorLogging(null, err);
	} catch (error) {

	}
});

dbConn.sequelize
	.authenticate()
	.then(() => {
		logger.info('DB Connection has been established successfully.');
	})
	.catch(err => {
		logger.info('Unable to connect to the database:', err);
	});

require('./auth/auth');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

app.use(morganLogger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads',express.static('uploads'));
app.use('/', indexRouter,express.static('/uploads'));
app.use('/api', passport.authenticate('jwt', { session: false }), addAbility, pagination, apiRouter,);
app.use(function (err, req, res, next) {
	logger.error('ErronHandler ===================>')
	logger.log(err);
	errorLogs.errorLogging(req, err);
	res.status(err.status || 500);
	res.json({ error: err });
});

module.exports = app;

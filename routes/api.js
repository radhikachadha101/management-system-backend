var express = require('express');
var router = express.Router();
var usersRouter = require('./users');
var projectsRouter = require('./projects');
var tasksRouter =  require('./tasks');
var commentRouter =  require('./comments');
var userGroupRouter =  require('./userGroup');
var errorLogRouter =  require('./errorLogs');
var biddingRouter =  require('./bidding');
var leaveRouter = require('./leave')


router.use('/users', usersRouter);
router.use('/projects', projectsRouter);
router.use('/tasks', tasksRouter);
router.use('/comments', commentRouter);
router.use('/userGroup', userGroupRouter);
router.use('/errorlogs', errorLogRouter);
router.use('/bidding', biddingRouter);
router.use('/leave', leaveRouter);



module.exports = router;

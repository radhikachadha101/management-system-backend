var express = require('express');
var router = express.Router();
var leaveController = require('../controllers/leave')


router.delete('/leave/:id', leaveController.leaveDelete);
router.post('/leavecreate', leaveController.createLeave);
router.get('/leaverecord',leaveController.findLeaves);
router.get('/leavecalendar',leaveController.findDateLeaves);
router.get('/leave/:id',leaveController.leaveById);
router.put('/leave/update/:id',leaveController.updateLeave);

module.exports = router;
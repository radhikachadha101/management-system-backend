var express = require('express');
var router = express.Router();
var TaskController = require('../controllers/task')

/* GET task listing. */
router.get('/', TaskController.findAll);
router.get('/reports', TaskController.taskReport);
router.get('/inprogress', TaskController.findInProgress);
router.get('/:id', TaskController.findOne);
router.post('/', TaskController.create);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);

module.exports = router;

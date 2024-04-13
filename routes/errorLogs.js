var express = require('express');
var router = express.Router();
const ErrorLogController = require('../controllers/errorLog');

router.get('/', ErrorLogController.findAll);

module.exports = router;

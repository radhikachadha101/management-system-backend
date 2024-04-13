var express = require('express');
var router = express.Router();
var userGroupController = require('../controllers/userGroup')
/* GET userGroup listing. */
router.get('/', userGroupController.findAll);
router.get('/userGroupPermission',userGroupController.userGroupPermission)
router.get('/routes',userGroupController.Routes);
router.get('/id', userGroupController.userGroupPermissionById);
router.put('/updatepermissions', userGroupController.updateUserGroupPermissions);
router.get('/usergroup', userGroupController.findOne);
module.exports = router;

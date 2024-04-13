var express = require('express');
var router = express.Router();
var CommentController = require('../controllers/comment')

router.get('/', CommentController.findAll);
router.get('/unreadComments', CommentController.unreadComments);
router.post('/', CommentController.create);
router.get('/:id', CommentController.findOne);
router.put('/:id', CommentController.update);
module.exports = router;

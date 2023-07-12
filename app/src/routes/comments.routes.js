const express = require('express');
const CommentController = require('../controllers/comments.controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();
const commentController = new CommentController();

router.get('/:postId/comments', commentController.getComments);
router.post(
  '/:postId/comments',
  authMiddleware,
  commentController.createComment
);
router.put(
  '/:postId/comments/:commentId',
  authMiddleware,
  commentController.updateComment
);
router.delete(
  '/:postId/comments/:commentId',
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;

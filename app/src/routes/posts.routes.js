const express = require('express');
const PostController = require('../controllers/posts.controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();
const postController = new PostController();

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);
router.post('/', authMiddleware, postController.createPost);
router.put('/:postId', authMiddleware, postController.updatePost);
router.delete('/:postId', authMiddleware, postController.deletePost);

module.exports = router;

const express = require('express');
const PostController = require('../controllers/posts.controller');
const authmiddleware = require('../middlewares/auth-middleware');

const router = express.Router();
const postController = new PostController();

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);
router.post('/', authmiddleware, postController.createPost);
router.put('/:postId', authmiddleware, postController.updatePost);
router.delete('/:postId', authmiddleware, postController.deletePost);

module.exports = router;

const express = require('express');
const PostController = require('../controllers/posts.controller');

const router = express.Router();
const postController = new PostController();

router.get('/', postController.getPosts);
router.get('/:postId', postController.getPost);
router.post('/', postController.createPost);
router.put('/postId', postController.updatePost);
router.delete('/postId', postController.deletePost);

module.exports = router;

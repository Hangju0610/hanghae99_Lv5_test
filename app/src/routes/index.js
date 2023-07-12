const express = require('express');
const userRouter = require('./users.routes');
const postRouter = require('./posts.routes');
const commentRouter = require('./comments.routes');
const likeRouter = require('./likes.routes');

const router = express.Router();

router.use('/', userRouter);
router.use('/posts', likeRouter, postRouter, commentRouter);

module.exports = router;

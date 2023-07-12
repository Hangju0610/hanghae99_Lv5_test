const express = require('express');
const userRouter = require('./users.routes');
const postRouter = require('./posts.routes');
const commentRouter = require('./comments.routes');

const router = express.Router();

router.use('/', userRouter);
router.use('/posts', postRouter, commentRouter);

module.exports = router;

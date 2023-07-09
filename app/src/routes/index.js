const express = require('express');
const userRouter = require('./users.routes');
const postRouter = require('./posts.routes');

const router = express.Router();

router.use('/', userRouter);
router.use('/posts', postRouter);

module.exports = router;

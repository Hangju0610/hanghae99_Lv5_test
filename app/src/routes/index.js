const express = require('express');
const userRouter = require('./users.routes');

const router = express.Router();

router.use('/', userRouter);

module.exports = router;

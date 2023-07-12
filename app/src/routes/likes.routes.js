const express = require('express');
const LikeController = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();
const likeController = new LikeController();

router.get('/like', authMiddleware, likeController.findPost);
router.post('/:postId/like', authMiddleware, likeController.createOrDelete);

module.exports = router;

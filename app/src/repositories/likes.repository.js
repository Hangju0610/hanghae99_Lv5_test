const { Likes } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  // 좋아요 찾기
  findLike = async (postId, userId) => {
    const findLikeData = await Likes.findOne({
      where: {
        [Op.and]: [{ postId }, { userId }],
      },
      raw: true,
    });

    return findLikeData;
  };

  // 좋아요 추가
  createLike = async (postId, userId) => {
    const createLikeData = await Likes.create({ postId, userId });

    return createLikeData;
  };

  // 좋아요 삭제
  deleteLike = async (postId, userId) => {
    const deleteLikeData = await Likes.destroy({
      where: {
        [Op.and]: [{ postId }, { userId }],
      },
    });

    return deleteLikeData;
  };
}

module.exports = LikeRepository;

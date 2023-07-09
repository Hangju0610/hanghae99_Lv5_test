const { Posts } = require('../models');
const { Op } = require('sequelize');

class PostRepository {
  // DB에서 게시글 전체 조회하기(Like, nickname 포함)
  findAllPost = async () => {
    const allPost = await Posts.findAll({
      attributes: [
        'postId',
        'userId',
        'Users.nickname',
        'title',
        [sequelize.fn('COUNT', sequelize.col('Likes.postId')), 'likes'],
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: [],
          required: false,
        },
        {
          model: Likes,
          attriubtes: [],
          required: false,
        },
      ],
      group: ['postId'],
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    return allPost;
  };

  // DB에서 게시글 하나 조회하기(Like, nickname 포함)
  findPostByPostId = async (postId) => {
    const post = await Posts.findOne({
      attributes: [
        'postId',
        'userId',
        'Users.nickname',
        'title',
        'content',
        [sequelize.fn('COUNT', sequelize.col('Likes.postId')), 'likes'],
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: [],
          required: false,
        },
        {
          model: Likes,
          attriubtes: [],
          required: false,
        },
      ],
      group: ['postId'],
      where: { postId },
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    return post;
  };

  // 편집 및 삭제 권한용 DB 데이터 확인
  validatePostByUserId = async (postId, userId) => {
    const validatePost = await Posts.findOne({
      where: {
        [Op.and]: [{ postId }, { userId }],
      },
    });

    return validatePost;
  };

  createPost = async (userId, title, content) => {
    const createPostData = await Posts.create({
      userId,
      title,
      content,
    });

    return createPostData;
  };

  updatePost = async (postId, title, content) => {
    const updatePostData = await Posts.update(
      { title, content },
      { where: { postId } }
    );

    return updatePostData;
  };

  deletePost = async (postId) => {
    const deletePostData = await Posts.delete({ where: { postId } });

    return deletePostData;
  };
}

module.exports = PostRepository;

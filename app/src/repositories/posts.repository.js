const { Posts, Users, Likes, sequelize } = require('../models');
const { Op } = require('sequelize');

class PostRepository {
  // // 의존성 주입을 위한 생성자
  // constructor(postsModel) {
  //   this.postsModel = postsModel;
  // }

  // DB에서 게시글 전체 조회하기(Like, nickname 포함)
  findAllPost = async () => {
    const allPost = await Posts.findAll({
      attributes: [
        'postId',
        'userId',
        'title',
        [sequelize.fn('COUNT', sequelize.col('Likes.postId')), 'likes'],
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
        {
          model: Likes,
          attriubtes: [],
        },
      ],
      group: ['postId'],
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    // const allPost = await this.postsModel.findAll();

    return allPost;
  };

  // DB에서 게시글 하나 조회하기(Like, nickname 포함)
  findPostByPostId = async (postId) => {
    const post = await Posts.findOne({
      attributes: [
        'postId',
        'userId',
        'title',
        'content',
        [sequelize.fn('COUNT', sequelize.col('Likes.postId')), 'likes'],
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
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

    // 테스트 코드용
    // const post = await this.postsModel.findOne(postId);

    return post;
  };

  // 좋아요한 게시물 찾기용
  findPostOrderLike = async (userId) => {
    console.log(userId);
    const allPost = await Posts.findAll({
      attributes: [
        'postId',
        'userId',
        'title',
        [sequelize.fn('COUNT', sequelize.col('Likes.postId')), 'likes'],
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
        {
          model: Likes,
          attributes: [],
        },
      ],
      where: {
        postId: {
          [Op.in]: sequelize.literal(
            `(SELECT postId FROM Likes WHERE userId = ${userId})`
          ),
        },
      },
      order: [[sequelize.literal('likes'), 'DESC']],
      group: ['postId'],
      raw: true,
    });

    return allPost;
  };

  // 편집 및 삭제 권한용 DB 데이터 확인
  validatePostByUserId = async (postId, userId) => {
    const validatePost = await Posts.findOne({
      attributes: ['postId', 'userId'],
      where: {
        [Op.and]: [{ postId }, { userId }],
      },
      raw: true,
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
    const deletePostData = await Posts.destroy({ where: { postId } });

    return deletePostData;
  };
}

module.exports = PostRepository;

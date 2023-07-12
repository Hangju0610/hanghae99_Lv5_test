const { Comments, Users } = require('../models');
const { Op } = require('sequelize');

class CommentRepository {
  findAllComment = async (postId) => {
    const allComment = await Comments.findAll({
      attributes: [
        'commentId',
        'postId',
        'userId',
        'comment',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
          required: false,
        },
      ],
      where: { postId },
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    return allComment;
  };

  // 댓글 하나 조회
  findComment = async (commentId) => {
    const comment = await Comments.findOne({
      where: { commentId },
      raw: true,
    });
    return comment;
  };

  // 댓글 편집 권한 및 삭제 권한 조회
  validateCommentByUserId = async (commentId, userId) => {
    const validateComment = await Comments.findOne({
      attributes: ['commentId', 'userId'],
      where: {
        [Op.and]: [{ commentId }, { userId }],
      },
      raw: true,
    });

    return validateComment;
  };

  // 댓글 생성
  createComment = async (postId, userId, comment) => {
    const createCommentData = await Comments.create({
      postId,
      userId,
      comment,
    });

    return createCommentData;
  };

  // 댓글 수정
  updateComment = async (commentId, comment) => {
    const updatePostData = await Comments.update(
      { comment },
      { where: { commentId } }
    );

    return updatePostData;
  };

  // 댓글 삭제
  deleteComment = async (commentId) => {
    const deleteCommentData = await Comments.destroy({
      where: { commentId },
    });

    return deleteCommentData;
  };
}

module.exports = CommentRepository;

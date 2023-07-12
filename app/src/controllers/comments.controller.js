const CommentService = require('../services/comments.service');
const commentSchema = require('../validations/comment.validation');

class CommentController {
  commentService = new CommentService();

  getComments = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const comments = await this.commentService.findAllComment(postId);

      res.status(200).json({ data: comments });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };

  createComment = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const { comment } = req.body;

      const { error } = commentSchema.validate({ comment });
      if (error)
        return res.status(412).json({ errorMessage: error.details[0].message });

      const createCommentData = await this.commentService.createComment(
        postId,
        userId,
        comment
      );

      return res.status(201).json({ createCommentData });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };

  updateComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;
      const { comment } = req.body;

      const { error } = commentSchema.validate({ comment });
      if (error)
        return res.status(412).json({ errorMessage: error.details[0].message });

      const updateCommentData = await this.commentService.updateComment(
        commentId,
        postId,
        userId,
        comment
      );

      res.status(200).json({ updateCommentData });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;

      const deleteCommentData = await this.commentService.deleteComment(
        commentId,
        postId,
        userId
      );

      res.status(200).json({ deleteCommentData });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };
}

module.exports = CommentController;

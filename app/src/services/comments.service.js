const CommentRepository = require('../repositories/comments.repository');
const PostRepository = require('../repositories/posts.repository');

class CommentService {
  commentRepository = new CommentRepository();
  postRepository = new PostRepository();

  // DB에서 댓글 전체 조회하기
  findAllComment = async (postId) => {
    // 게시글 조회
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    // 게시글이 있다면 댓글 전체 조회
    const allComment = await this.commentRepository.findAllComment(postId);

    return allComment.map((comment) => {
      return {
        commentId: comment.commentId,
        postId: comment.postId,
        userId: comment.userId,
        nickname: comment['User.nickname'],
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
  };

  // 댓글 생성하기
  createComment = async (postId, userId, comment) => {
    // 게시글 조회
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    // 게시글이 있다면 댓글 생성

    const createCommentData = await this.commentRepository.createComment(
      postId,
      userId,
      comment
    );

    return { success: true };
  };

  // 댓글 수정하기
  updateComment = async (commentId, postId, userId, comment) => {
    // 게시글 조회
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }
    // 댓글 조회
    const findComment = await this.commentRepository.findComment(commentId);
    if (!findComment) {
      const error = new Error('댓글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    // 댓글 편집 권한 조회
    const validateComment =
      await this.commentRepository.validateCommentByUserId(commentId, userId);
    if (!validateComment) {
      const error = new Error('댓글의 편집 권한이 없습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 403; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    // 댓글 수정
    const updateCommentData = await this.commentRepository.updateComment(
      commentId,
      comment
    );

    return { success: true };
  };

  deleteComment = async (commentId, postId, userId) => {
    // 게시글 조회
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    // 댓글 조회
    const findComment = await this.commentRepository.findComment(commentId);
    if (!findComment) {
      const error = new Error('댓글이 존재하지 않습니다.');
      error.status = 404;
      throw error;
    }

    // 댓글 삭제 권한 조회
    const validateComment =
      await this.commentRepository.validateCommentByUserId(commentId, userId);
    if (!validateComment) {
      const error = new Error('댓글의 편집 권한이 없습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 403; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    // 댓글 삭제
    const deleteCommentData = await this.commentRepository.deleteComment(
      commentId
    );

    return { success: true };
  };
}

module.exports = CommentService;

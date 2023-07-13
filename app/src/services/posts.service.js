const PostRepository = require('../repositories/posts.repository');
// 생성자 주입으로 변경
const { Posts } = require('../models');

class PostService {
  // postRepository = new PostRepository();
  // 의존성 주입
  postRepository = new PostRepository(Posts);

  // 게시물 전체 조회
  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();

    return allPost.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post['User.nickname'],
        title: post.title,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  // 게시글 하나 조회
  findPost = async (postId) => {
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 404; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    return {
      postId: post.postId,
      userId: post.userId,
      nickname: post['User.nickname'],
      title: post.title,
      content: post.content,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  // 게시글 생성
  createPost = async (userId, title, content) => {
    const createPostData = await this.postRepository.createPost(
      userId,
      title,
      content
    );

    return { success: true };
  };

  updatePost = async (postId, userId, title, content) => {
    // 게시글 확인
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 404; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    // 편집 권한 확인
    const validatePost = await this.postRepository.validatePostByUserId(
      postId,
      userId
    );
    if (!validatePost) {
      const error = new Error('게시글의 편집 권한이 없습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 403; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    const updatePostData = await this.postRepository.updatePost(
      postId,
      title,
      content
    );

    return { success: true };
  };

  deletePost = async (postId, userId) => {
    // 게시글 확인
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 404; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    // 삭제 권한 확인
    const validatePost = await this.postRepository.validatePostByUserId(
      postId,
      userId
    );

    if (!validatePost) {
      const error = new Error('게시글의 삭제 권한이 없습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 403; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    const deletePostData = await this.postRepository.deletePost(postId, userId);

    return { success: true };
  };
}

module.exports = PostService;

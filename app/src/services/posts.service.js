const PostRepository = require('../repositories/posts.repository');

class PostService {
  postRepository = new PostRepository();

  // 게시물 전체 조회
  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();

    allPost.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allPost.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  findPost = async (postId) => {
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) throw new Error('게시글이 없습니다.');

    return {
      postId: post.postId,
      userId: post.userId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };

  createPost = async (userId, title, content) => {
    const createPostData = await this.postRepository.createPost(
      userId,
      title,
      content
    );

    return { success: true };
  };

  updatePost = async (postId, userId, title, content) => {
    // 편집 권한 확인
    const validatePost = await this.postRepository.validatePostByUserId(
      postId,
      userId
    );
    if (validatePost) throw new Error('편집 권한이 없습니다.');

    const updatePostData = await this.postRepository.updatePost(
      postId,
      title,
      content
    );

    return { success: true };
  };

  deletePost = async (postId, userId) => {
    // 삭제 권한 확인
    const validatePost = await this.postRepository.validatePostByUserId(
      postId,
      userId
    );
    if (validatePost) throw new Error('삭제 권한이 없습니다.');

    const deletePostData = await this.postRepository.deletePost(postId, userId);

    return { success: true };
  };
}

module.exports = PostService;

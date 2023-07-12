const PostRepository = require('../repositories/posts.repository');
const LikeRepository = require('../repositories/likes.repository');

class LikeService {
  postRepository = new PostRepository();
  likeRepository = new LikeRepository();

  findPostOrderLike = async (userId) => {
    const allPost = await this.postRepository.findPostOrderLike(userId);

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

  createOrDeleteLike = async (postId, userId) => {
    // 게시글 확인
    const post = await this.postRepository.findPostByPostId(postId);
    if (!post) {
      const error = new Error('게시글이 존재하지 않습니다.'); // ERROR 생성자를 통해 message 전달
      error.status = 404; // ERROR 객체를 통해서 Status 추가
      throw error;
    }

    //좋아요 찾기
    const existLike = await this.likeRepository.findLike(postId, userId);

    if (!existLike) {
      await this.likeRepository.createLike(postId, userId);
      return { message: '게시글의 좋아요를 등록하였습니다.' };
    } else {
      await this.likeRepository.deleteLike(postId, userId);
      return { message: '게시글의 좋아요를 취소하였습니다.' };
    }
  };
}

module.exports = LikeService;

const PostService = require('../services/posts.service');

class PostController {
  postService = new PostService();

  // 게시물 전체 조회
  getPosts = async (_, res, next) => {
    try {
      const posts = await this.postService.findAllPost();

      res.status(200).json({ data: posts });
    } catch (error) {
      console.log(error);
      res.json({ errorMessege: error });
    }
  };

  // 게시물 조회
  getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.findPost(postId);

      res.status(200).json({ data: post });
    } catch (error) {
      console.log(error);
      res.json({ errorMessege: error });
    }
  };

  // 게시물 생성
  createPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { title, content } = req.body;

      const createPostData = await this.postService.createPost(
        userId,
        title,
        content
      );

      res.status(200).json({ data: createPostData });
    } catch (error) {
      console.log(error);
      res.json({ errorMessege: error });
    }
  };

  // 게시물 수정
  updatePost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { title, content } = req.body;

      const updatePostData = await this.postService.updatePost(
        postId,
        userId,
        title,
        content
      );

      res.status(200).json({ data: updatePostData });
    } catch (error) {
      console.log(error);
      res.json({ errorMessage: error });
    }
  };

  // 게시물 삭제
  deletePost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;

      const deletePostData = await this.postService.deletePost(postId, userId);

      res.status(200).json({ data: deletePostData });
    } catch (error) {
      console.log(error);
      res.json({ errorMessage: error });
    }
  };
}

module.exports = PostController;

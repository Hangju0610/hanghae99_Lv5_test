const PostService = require('../services/posts.service');
const postSchema = require('../validations/posts.validation');

class PostController {
  postService = new PostService();

  // 게시물 전체 조회
  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postService.findAllPost();

      res.status(200).json({ data: posts });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };

  // 게시물 조회
  getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.findPost(postId);

      res.status(200).json({ data: post });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };

  // 게시물 생성
  createPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { title, content } = req.body;

      // 데이터 형식이 올바르지 않은 경우
      const { error } = postSchema.validate({ title, content });
      if (error) {
        console.log(error);
        return res.status(412).json({ errorMessage: error.details[0].message });
      }

      const createPostData = await this.postService.createPost(
        userId,
        title,
        content
      );

      res.status(201).json({ createPostData });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };

  // 게시물 수정
  updatePost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { title, content } = req.body;

      // 데이터 형식이 올바르지 않은 경우
      const { error } = postSchema.validate({ title, content });
      if (error)
        return res.status(412).json({ errorMessage: error.details[0].message });

      const updatePostData = await this.postService.updatePost(
        postId,
        userId,
        title,
        content
      );

      res.status(200).json({ updatePostData });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };

  // 게시물 삭제
  deletePost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;

      const deletePostData = await this.postService.deletePost(postId, userId);

      res.status(200).json({ deletePostData });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };
}

module.exports = PostController;

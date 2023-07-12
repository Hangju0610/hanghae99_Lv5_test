const LikeService = require('../services/likes.service');

class LikeController {
  likeService = new LikeService();

  findPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const posts = await this.likeService.findPostOrderLike(userId);

      res.status(200).json({ data: posts });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      console.log(error);
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };
  createOrDelete = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;

      const Likes = await this.likeService.createOrDeleteLike(postId, userId);

      res.status(200).json({ message: Likes.message });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      console.log(error);
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };
}

module.exports = LikeController;

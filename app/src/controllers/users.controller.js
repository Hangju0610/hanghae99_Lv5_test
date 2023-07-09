const UserService = require('../services/users.service');

class UserController {
  userService = new UserService();

  // user 생성
  createUser = async (req, res, next) => {
    try {
      const { email, nickname, password, confirmPassword } = req.body;
      // user 서비스로 보내기
      const createUserData = await this.userService.createUser(
        email,
        nickname,
        password,
        confirmPassword
      );

      res.status(201).json({ data: createUserData });
    } catch (Error) {
      console.log(Error);
      res.json({ errorMessage: Error });
    }
  };
}

module.exports = UserController;

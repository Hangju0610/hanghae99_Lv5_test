const UserService = require('../services/users.service');
const { signupSchema } = require('../validations/signup.validation');
const { loginSchema } = require('../validations/login.validation');

class UserController {
  userService = new UserService();

  // user 생성
  createUser = async (req, res, next) => {
    try {
      const { email, nickname, password, confirmPassword } = req.body;
      // joi를 통한 데이터 유효성 검사
      const { error } = signupSchema.validate({
        email,
        nickname,
        password,
        confirmPassword,
      });
      if (error)
        return res.status(412).json({ errorMessage: error.details[0].message });

      // 이메일 아이디가 비밀번호에 포함되어 있는지 검사

      // user 서비스로 보내기
      const createUserData = await this.userService.createUser(
        email,
        nickname,
        password
      );

      res.status(201).json({ data: createUserData });
    } catch (Error) {
      console.log(Error);
      res.json({ errorMessage: Error });
    }
  };

  loginUser = async (req, res, next) => {
    try {
      // 이메일과 비밀번호를 받음
      const { email, password } = req.body;

      // 데이터 유효성 검사
      const { error } = loginSchema.validate({
        email,
        password,
      });
      if (error)
        return res.status(412).json({ errorMessage: error.details[0].message });

      // user 서비스로 보내기
      const loginUser = await this.userService.loginUser(email, password);

      // 토큰 받아온 후 Cookie로 날리기
      res.cookie('accessToken', loginUser.accessToken);
      res.cookie('refreshToken', loginUser.refreshToken);

      res.status(201).json({ loginUser });
    } catch (Error) {
      console.log(Error);
      res.json({ errorMessage: Error });
    }
  };
}

module.exports = UserController;

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
      const emailId = email.split('@');
      const passwordTest = new RegExp(`${emailId[0]}`);
      if (passwordTest.test(password))
        return res.status(412).json({
          errorMessage: '비밀번호에 이메일 아이디가 포함되어 있습니다.',
        });

      // user 서비스로 보내기
      const createUserData = await this.userService.createUser(
        email,
        nickname,
        password
      );

      res.status(201).json({ data: createUserData });
    } catch (error) {
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
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
    } catch (error) {
      console.log(error);
      // Error 객체의 Error.status와 메세지 출력
      if (error.status)
        // Error 객체의 Error.status와 메세지 출력
        return res.status(error.status).json({ errorMessage: error.message });
      res.json({ errorMessage: error.message }); // 해당되는 에러가 아닌 경우, json으로 error 확인
    }
  };
}

module.exports = UserController;

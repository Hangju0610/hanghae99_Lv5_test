const UserRepository = require('../repositories/users.repository');
const bcrypt = require('bcrypt');
const { signupSchema } = require('../validations/validation');
require('dotenv').config();

class UserService {
  userRepository = new UserRepository();

  //User 생성
  createUser = async (email, nickname, password, confirmPassword) => {
    // Email 및 nickname 검증
    const isExistEmail = await this.userRepository.findUserByEmail(email);
    if (isExistEmail) throw new Error('이미 있는 Email입니다.');
    const isExistNickname = await this.userRepository.findUserByNickname(
      nickname
    );
    if (isExistNickname) throw new Error('이미 있는 nickname입니다.');

    //joi를 통한 유효성 검사
    const { error } = signupSchema.validate({
      email,
      nickname,
      password,
      confirmPassword,
    });
    if (error) throw new Error(error.details[0].message);

    // 이메일 아이디가 비밀번호에 포함되어 있는지 검사

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    // User 생성
    const createUserData = await this.userRepository.createUser(
      email,
      nickname,
      hashedPassword
    );

    return createUserData;
  };
}

module.exports = UserService;

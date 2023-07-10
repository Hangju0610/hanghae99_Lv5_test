const UserRepository = require('../repositories/users.repository');
const TokenRepository = require('../repositories/tokens.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
  userRepository = new UserRepository();
  tokenRepository = new TokenRepository();

  //User 생성
  createUser = async (email, nickname, password) => {
    // Email 및 nickname 검증
    const isExistEmail = await this.userRepository.findUserByEmail(email);
    if (isExistEmail) throw new Error('이미 있는 Email입니다.');
    const isExistNickname = await this.userRepository.findUserByNickname(
      nickname
    );
    if (isExistNickname) throw new Error('이미 있는 nickname입니다.');

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

  //Login email과 password를 받음
  loginUser = async (email, password) => {
    // email에 있는 데이터 찾아오기
    const findUser = await this.userRepository.findUserByEmail(email);
    if (!findUser) throw new Error('없는 이메일입니다.');
    // 비밀번호 일치여부 확인
    const validPassword = await bcrypt.compare(password, findUser.password);
    if (!validPassword) throw new Error('비밀번호가 올바르지 않습니다.');

    // 토큰 발급
    const accessToken = jwt.sign(
      { userId: findUser.userId },
      process.env.JWT_ACCESS,
      {
        expiresIn: '10s',
      }
    );
    const refreshToken = jwt.sign({}, process.env.JWT_REFRESH, {
      expiresIn: '2h',
    });

    // refreshToken DB에 전달
    // 1. UserId별로 Token이 저장되어 있는지 확인
    const findToken = this.tokenRepository.findTokenByUserId(findUser.userId);
    // 2-1. RefreshToken에 DB가 있다면 update 진행
    if (findToken) {
      await this.tokenRepository.updateRefreshToken(
        refreshToken,
        findUser.userId
      );
    } else {
      // 2-2 RefreshToken DB에 없다면 Create 진행
      await this.tokenRepository.createRefreshToken(
        refreshToken,
        findUser.userId
      );
    }

    //Token을 Cookie에 전달
    return {
      accessToken,
      refreshToken,
    };
  };
}

module.exports = UserService;

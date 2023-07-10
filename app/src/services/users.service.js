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
    const findToken = await this.tokenRepository.findTokenByUserId(
      findUser.userId
    );
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

  // AccessToken 유효성 검사
  validateAccessToken = (accessToken) => {
    try {
      const validateAccessTokenData = jwt.verify(accessToken, JWT_ACCESS);
      // 인증될 경우 데이터 반환
      return validateAccessTokenData;
    } catch (error) {
      // 만료된 경우 false 반환
      return false;
    }
  };

  // RefreshToken 유효성 검사
  validateRefreshToken = (refreshToken) => {
    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH);
      // 인증된 경우 true 반환
      return true;
    } catch (error) {
      // 만료된 경우 false 반환
      return false;
    }
  };

  //Tokens 검증
  validateTokens = async (accessToken, refreshToken) => {
    // validate를 통해 만료되었는지 확인
    const accessTokenData = this.validateAccessToken(accessToken);
    const refreshTokenData = this.validateRefreshToken(refreshToken);

    // refreshToken이 만료된 경우 => false를 반환하기에 !붙인다.
    // Error처리로 토스한다.
    if (!refreshTokenData) throw new Error('refreshToken이 만료되었습니다.');

    // accessToken이 만료된 경우
    // Case를 나눠서 if와 Else로 조작
    // 1. AccessToken이 만료된 경우
    if (!accessTokenData) {
      //DB에서 refresh 토큰 검증하기
      const findUser = await this.tokenRepository.findUserByToken(refreshToken);
      //refresh 토큰이 정상적이지 않은 경우
      // 토큰 자체가 정상적이지만, 탈취를 당했거나 고의적으로 만료한 경우
      if (!findUser)
        throw new Error('Refresh Token의 정보가 서버에 존재하지 않습니다.');

      // AccessToken 새로 생성
      const newAccessToken = jwt.sign(
        { userId: findUser.userId },
        process.env.JWT_ACCESS,
        { expiresIn: '10s' }
      );
      // refresh Token 정보에서 userId를 통해 Users 정보 확보.
      const user = await this.userRepository.findUserByUserId(findUser.userId);
      console.log('AccessToken 재발급 완료');

      return {
        accessToken: newAccessToken,
        user,
      };
    } else {
      // 모든 토큰이 정상적인 경우
      console.log('정상적인 경우');
      // accessTokenData.userId를 통해 user 정보 확인
      const user = await this.userRepository.findUserByUserId(
        accessTokenData.userId
      );

      return { user };
    }
  };
}

module.exports = UserService;

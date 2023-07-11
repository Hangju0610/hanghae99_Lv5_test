const jwt = require('jsonwebtoken');
const UserService = require('../services/users.service');

const userService = new UserService();

const jwtValidation = async (req, res, next) => {
  try {
    // 1. 토큰 받아오기 및 검증
    const { accessToken, refreshToken } = req.cookies;
    if (!refreshToken)
      return res
        .status(403)
        .json({ errorMessage: '로그인이 필요한 기능입니다.' });
    if (!accessToken)
      return res
        .status(403)
        .json({ errorMessage: '로그인이 필요한 기능입니다.' });

    // 2. 토큰 유효성 검사 진행을 userService로 보내기
    const validateData = await userService.validateTokens(
      accessToken,
      refreshToken
    );
    // 모든 토큰이 정상적이여서 accessToken을 재발급 하지 않은 경우
    if (!validateData.accessToken) {
      res.locals.user = validateData.user;
      next();
    } else {
      // accessToken을 재발급 한 경우
      res.cookie('accessToken', validateData.accessToken);
      res.locals.user = validateData.user;
      next();
    }
  } catch (error) {
    // 토큰이 정상적이지 않을 수 있으니 Clear를 시켜준다.
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    if (error.status)
      return res
        .status(error.status)
        .json({ errorMessage: error.errorMessage });
    res.status(500).json({ errorMessage: error.errorMessage });
  }
};

module.exports = jwtValidation;

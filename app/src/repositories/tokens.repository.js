const { RefreshTokens } = require('../models');

class TokenRepository {
  // refreshToken 찾기
  findTokenByUserId = async (userId) => {
    const findRefreshToken = await RefreshTokens.findOne({ where: { userId } });

    return findRefreshToken;
  };

  // userId 찾기
  findUserByToken = async (refreshToken) => {
    const findUserId = await RefreshTokens.findOne({ where: { refreshToken } });

    return findUserId;
  };

  // refreshToken 생성
  createRefreshToken = async (refreshToken, userId) => {
    const createToken = await RefreshTokens.create({ refreshToken, userId });

    return createToken;
  };

  //
  updateRefreshToken = async (refreshToken, userId) => {
    const updateToken = await RefreshTokens.update(
      { refreshToken },
      {
        where: { userId },
      }
    );
    return updateToken;
  };
}

module.exports = TokenRepository;

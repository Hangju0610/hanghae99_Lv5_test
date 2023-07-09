const { Users } = require('../models');

class UserRepository {
  findUserByEmail = async (email) => {
    const user = await Users.findOne({ where: { email } });

    return user;
  };

  findUserByNickname = async (nickname) => {
    const user = await Users.findOne({ where: { nickname } });

    return user;
  };

  createUser = async (email, nickname, password) => {
    const createUserData = await Users.create({
      email,
      nickname,
      password,
    });

    return createUserData;
  };
}

module.exports = UserRepository;

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // RefreshToken과 1:1 설정
      this.hasOne(models.RefreshTokens, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });

      // Posts와 1:N 설정
      this.hasMany(models.Posts, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });

      // Comments와 1:N 설정
      this.hasMany(models.Comments, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });

      // Likes 관계 테이블을 통해 Posts와 N:M 관계 설정
      this.hasMany(models.Likes, {
        sourceKey: 'userId',
        foreignKey: 'userId',
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Users',
    }
  );
  return Users;
};

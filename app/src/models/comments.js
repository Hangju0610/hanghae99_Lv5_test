'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Users와 N:1 설정
      this.belongsTo(models.Users, {
        foreignKey: 'userId',
        targetKey: 'userId',
        onDelete: 'CASCAED',
        onUpdate: 'CASCAED',
      });

      // Posts와 N:1 설정
      this.belongsTo(models.Posts, {
        foreignKey: 'postId',
        targetKey: 'postId',
        onDelete: 'CASCAED',
        onUpdate: 'CASCAED',
      });
    }
  }
  Comments.init(
    {
      commentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      postId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      comment: {
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
      modelName: 'Comments',
    }
  );
  return Comments;
};

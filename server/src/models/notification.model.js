import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Notification extends Model {}

Notification.init(
  {
    notificationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    relatedEntityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relatedEntityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['user_id', 'is_read'] },
      { fields: ['created_at'] },
    ],
  }
);

export default Notification;

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Resume extends Model {}

Resume.init(
  {
    resumeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalFileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Resume',
    tableName: 'resumes',
    timestamps: false,
    underscored: true,
    freezeTableName: false,
  }
);

export default Resume;

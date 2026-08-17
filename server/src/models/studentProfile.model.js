import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class StudentProfile extends Model {}

StudentProfile.init(
  {
    studentProfileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batchYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    currentResumeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'StudentProfile',
    tableName: 'student_profiles',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  }
);

export default StudentProfile;

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Application extends Model {}

Application.init(
  {
    applicationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studentProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resumeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('applied', 'under_review', 'shortlisted', 'rejected', 'selected'),
      allowNull: false,
      defaultValue: 'applied',
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
    createdAt: 'applied_at',
    indexes: [
      {
        unique: true,
        fields: ['job_id', 'student_profile_id'],
      },
    ],
  }
);

export default Application;

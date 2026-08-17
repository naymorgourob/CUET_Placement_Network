import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Job extends Model {}

Job.init(
  {
    jobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jobType: {
      type: DataTypes.ENUM('full-time', 'internship', 'part-time'),
      allowNull: false,
      defaultValue: 'full-time',
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'removed'),
      allowNull: false,
      defaultValue: 'open',
    },
    deadline: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  }
);

export default Job;

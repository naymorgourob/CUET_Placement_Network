import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class SavedJob extends Model {}

SavedJob.init(
  {
    savedJobId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SavedJob',
    tableName: 'saved_jobs',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
    indexes: [
      {
        unique: true,
        fields: ['student_profile_id', 'job_id'],
      },
    ],
  }
);

export default SavedJob;

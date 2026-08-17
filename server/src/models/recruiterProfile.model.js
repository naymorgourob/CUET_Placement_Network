import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class RecruiterProfile extends Model {}

RecruiterProfile.init(
  {
    recruiterProfileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'RecruiterProfile',
    tableName: 'recruiter_profiles',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  }
);

export default RecruiterProfile;

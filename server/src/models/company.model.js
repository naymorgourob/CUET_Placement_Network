import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Company extends Model {}

Company.init(
  {
    companyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logoPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  }
);

export default Company;

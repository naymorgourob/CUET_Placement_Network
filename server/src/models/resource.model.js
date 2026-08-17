import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class Resource extends Model {}

Resource.init(
  {
    resourceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.ENUM(
        'career_guidance',
        'resume_cv',
        'interview_prep',
        'job_search',
        'skills_development',
        'industry_insights',
        'career_stories'
      ),
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    coverImagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'CUET Placement Network',
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    readingTimeMinutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft',
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Resource',
    tableName: 'resources',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  }
);

export default Resource;

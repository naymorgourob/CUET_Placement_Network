import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class ResumeAnalysis extends Model {}

ResumeAnalysis.init(
  {
    analysisId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    resumeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    extractedSkills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    overallScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    improvementSuggestions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    analyzedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    // Structured AI analysis fields (Feature 06 — AI Resume Analysis).
    // Additive extension of the frozen Freeze #04 schema: the three fields
    // above are kept as-is (still written to by nothing new, still read by
    // nothing), and this feature stores its richer, queryable output here
    // instead of overloading extractedSkills/improvementSuggestions with a
    // serialized blob. See docs/Feature06_AIResumeAnalysis.md §6.
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    education: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    experience: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    projects: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    strengths: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    weaknesses: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    missingInformation: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    aiModel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ResumeAnalysis',
    tableName: 'resume_analyses',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
  }
);

export default ResumeAnalysis;

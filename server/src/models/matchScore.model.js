import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

class MatchScore extends Model {}

MatchScore.init(
  {
    matchScoreId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    resumeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    missingSkills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    computedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    // Structured AI job-match fields (Feature 08 — AI Job Match Score).
    // Additive extension of the frozen Freeze #04 schema, following the
    // same pattern as ResumeAnalysis (Feature 06) and its reused
    // improvementSuggestions field (Feature 07): the four fields above are
    // kept as-is — score/missingSkills are now written by this feature
    // (score mirrors matchScore as a DECIMAL per the frozen type;
    // missingSkills stores the structured {skill, reason}[] array as a
    // JSON string, since it's a TEXT column, not a JSON column) — and the
    // richer, queryable fields below hold the rest of the structured
    // result. See docs/Feature08_AIJobMatchScore.md §7.
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    matchingSkills: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    matchingQualifications: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    gaps: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    strengthsForThisJob: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    recommendations: {
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
    modelName: 'MatchScore',
    tableName: 'match_scores',
    timestamps: true,
    underscored: true,
    freezeTableName: false,
    indexes: [
      {
        unique: true,
        fields: ['resume_id', 'job_id'],
      },
    ],
  }
);

export default MatchScore;

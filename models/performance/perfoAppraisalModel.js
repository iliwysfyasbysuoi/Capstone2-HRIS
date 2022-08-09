const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const perfoAppraisalSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "Required"],
  },
  cycleId: {
    type: Schema.Types.ObjectId,
    required: [true, "Required"],
  },
  listOfAddTasks: [
    {
      description: {
        type: String,
      },
      results: {
        type: String,
      },
    },
  ],

  helpfulThingsText: {
    type: String,
    required: [true, "Required"],
  },
  agreedKeyActsNextCycText: {
    type: String,
    required: [true, "Required"],
  },

  rolesRespoAreClear: {
    type: String,
    required: [true, "Required"],
    enum: ["Yes", "Partially", "No"],
  },
  enoughOpporToExploSkills: {
    type: String,
    required: [true, "Required"],
    enum: ["Yes", "No"],
  },

  recommToImporveText: {
    type: String,
    required: [true, "Required"],
  },
  mostSatisfEnjText: {
    type: String,
    required: [true, "Required"],
  },
  frustrationText: {
    type: String,
    required: [true, "Required"],
  },

  treatment: {
    type: String,
    required: [true, "Required"],
    enum: [
      "Extremely Fair",
      "Very Fairly",
      "Somewhat Fairly",
      "Not So Fairly",
      "Not At All Fairly",
    ],
  },
  recognition: {
    type: String,
    required: [true, "Required"],
    enum: ["Always", "Most Of The Time", "Once In A While", "Never"],
  },
  workLifeBalance: {
    type: String,
    required: [true, "Required"],
    enum: [
      "Extremely Easy",
      "Very Easy",
      "Somewhat Easy",
      "Not So Easy",
      "Not At All Easy",
    ],
  },
  superGaveEnouOppor: {
    type: String,
    required: [true, "Required"],
    enum: ["Yes", "No"],
  },

  relationWithSuperText: {
    type: String,
    required: [true, "Required"],
  },
  teamwork: {
    type: String,
    required: [true, "Required"],
    enum: [
      "Extremely Well",
      "Very Well",
      "Somewhat Well",
      "Not So Well",
      "Not At All Well",
    ],
  },
  relationWithTeamText: {
    type: String,
    required: [true, "Required"],
  },
  isReviewed: {
    type: Boolean,
    required: [true, "Required"],
  },
  submissionDate: {
    type: Date,
    required: [true, "Required"],
  },
  cycleDate: {
    type: Date
  }
});

module.exports = mongoose.model("perfoAppraisal", perfoAppraisalSchema);

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const trainingEvaluationSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  evaluationID: {
    type: Number,
    required: [true, "Required"],
  },
  employeeDetails: {
    id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    name: {
      type: String,
      required: [true, "Required"],
    },
    department: {
      type: String,
      required: [true, "Required"],
    },
    position: {
      type: String,
      required: [true, "Required"],
    },
  },
  trainingDetails: {
    id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    trainingID: {
      type: Number,
      required: [true, "Required"],
    },
    trainingTitle: {
      type: String,
      required: [true, "Required"],
    },
    trainingVenue: {
      type: String,
      required: [true, "Required"],
    },
    trainingSponsor: {
      type: String,
      required: [true, "Required"],
    },
    trainingDate: {
      type: String,
      required: [true, "Required"],
    },
  },
  programUsefulness: {
    type: Number,
    required: [true, "Required"],
  },
  programAdequacy: {
    type: Number,
    required: [true, "Required"],
  },
  programSkillsPractice: {
    type: Number,
    required: [true, "Required"],
  },
  programInstructorKnowledge: {
    type: Number,
    required: [true, "Required"],
  },
  programInstructorDelivery: {
    type: Number,
    required: [true, "Required"],
  },
  programFacility: {
    type: Number,
    required: [true, "Required"],
  },
  programAVSupport: {
    type: Number,
    required: [true, "Required"],
  },
  programLectureNotes: {
    type: Number,
    required: [true, "Required"],
  },
  programDuration: {
    type: Number,
    required: [true, "Required"],
  },
  comments: {
    type: String,
    default: "",
  },
  commitmentStatement: {
    type: String,
    default: "",
  },
  createdDate: {
    type: Date,
    required: [true, "Required"],
  },
  employeeTrackerID: {
    type: Schema.Types.ObjectId,
    default: null,
  }
});

module.exports = mongoose.model("trainingEvaluation", trainingEvaluationSchema);

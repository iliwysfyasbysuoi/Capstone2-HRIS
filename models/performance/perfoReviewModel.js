const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const perfoReviewSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  //foreign k
  userId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  appraisalId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  cycleDate: {
    type: Date
  },
  submissionDate: {
    type: Date,
    default:  [true, "Required"],
  },
  //attribs
  kpiRating: [
    {
      keyResAreas: {
        type: String,
        required: [true, "Required"],
      },
      description: {
        type: String,
      },
      perfoIndicator: {
        type: String,
        required: [true, "Required"],
      },
      rating:{
        type: Number,
        required: [true, "Required"]
      }
    },
  ],
  skillsCompetencies: [
    {
      skill: {
        type: String,
        required: [true, "Required"],
      },
      displayedWhere: {
        type: String,
        required: [true, "Required"],
      },
    },
  ],
  entrepSpirit: {
    type: String,
    required: [true, "Required"],
  },
  customerFocus: {
    type: String,
    required: [true, "Required"],
  },
  passionExcellence: {
    type: String,
    required: [true, "Required"],
  },
  peopleDevelopment: {
    type: String,
    required: [true, "Required"],
  },
  stakeholderCommitment: {
    type: String,
    required: [true, "Required"],
  },
  workRelatedItems: {
    type: String,
    required: [true, "Required"],
  },
  otherComments: {
    type: String,
    required: [true, "Required"],
  },
});

module.exports = mongoose.model("perfoReview", perfoReviewSchema);

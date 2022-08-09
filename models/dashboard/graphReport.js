const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const graphReportSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: [true, "Required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "Required"],
  },
  submittedBy: {
    type: String,
    required: [true, "Required"],
  },
  dateSubmitted: {
    type: Date,
    required: [true, "Required"],
  },
  type: {
    type: String,
    required: [true, "Required"],
  },
  data: {
    type: Object,
    required: [true, "Required"],
  },
});

module.exports = mongoose.model("graphReport", graphReportSchema);

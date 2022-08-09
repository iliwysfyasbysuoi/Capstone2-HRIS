const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalCycleListSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		default: null,
	},

	// for checking if this cycle will be shown to the user
	businessUnit: {
		type: String,
		required: [true, "Required"],
	},
	department: {
		type: String,
		required: [true, "Required"],
	},
	dates: [
		{
			type: Date,
			required: [true, "Required"],
		},
	],
	// input data
	position: {
		type: String,
		required: [true, "Required"],
	},
	listOfCycles: [
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
		},
	],
	reviewCycle: {
		type: String,
		required: [true, "Required"],
		enum: ["Annual", "Bi-Annual", "Quarterly"],
	},
	startDate: {
		type: Date,
		required: [true, "Required"],
	},
	//   sets the limit of cycles
	numberOfCycles: {
		type: Number,
		required: [true, "Required"],
	},

	// automated data
	// based on startDate initially
	notifyDate: {
		type: Date,
		required: [true, "Required"],
	},
	//  tells how many cycles are left - based on numberOfCycles initially
	cyclesLeft: {
		type: Number,
		required: [true, "Required"],
	},
	// trainings and performance ratings
	trainings: [
		[
			{
				type: Schema.Types.ObjectId,
				required: [true, "Required"],
			},
		],
	],
	performanceRatings: [
		{
			employees: [
				{
					userId: {
						type: Schema.Types.ObjectId,
						required: [true, "Required"],
					},
					ratings: [
						{
							keyResAreas: {
								type: String,
								required: [true, "Required"],
							},
							rating: {
								type: Number,
								required: [true, "Required"],
							},
						},
					],
				},
			],
		},
	],
});

module.exports = mongoose.model("goalCycleList", goalCycleListSchema);

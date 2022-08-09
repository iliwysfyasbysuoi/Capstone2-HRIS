const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const trainingNominationSchema = new Schema({
	_id: {
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
	sponsor: {
		type: String,
		required: [true, "Required"],
	},
	venue: {
		type: String,
		required: [true, "Required"],
	},
	reason: {
		type: String,
		required: [true, "Required"],
	},
	department: {
		type: String,
		required: [true, "Required"],
	},
	businessUnit: {
		type: String,
		required: [true, "Required"],
	},
	inclusiveDates: [
		{
			type: String,
			required: [true, "Required"],
		},
	],
	trainingFee: {
		type: Number,
		required: [true, "Required"],
	},
	registrationRequirements: [
		{
			type: String,
			required: [true, "Required"],
		},
	],
	skills: [
		{
			skillName: {
				type: String,
				required: [true, "Required"],
			},
			skillPosition: {
				type: String,
				required: [true, "Required"],
			},
			skillDepartment: {
				type: String,
				required: [true, "Required"],
			},
			skillBusinessUnit: {
				type: String,
				required: [true, "Required"],
			},
		},
	],
	employees: [
		{
			employeeID: {
				type: Schema.Types.ObjectId,
				required: [true, "Required"],
			},
			employeeName: {
				type: String,
				required: [true, "Required"],
			},
			employeePosition: {
				type: String,
				required: [true, "Required"],
			},
			employeeContractPeriod: {
				type: String,
				required: [true, "Required"],
			},
			attendance: {
				type: String,
				required: [true, "Required"],
			},
		},
	],
	requestDate: {
		type: Date,
		required: [true, "Required"],
	},
	updatedDate: {
		type: Date,
		required: [true, "Required"],
	},
	status: {
		type: String,
		required: [true, "Required"],
	},
	approvalDHead: {
		approver: {
			type: Object,
			required: [true, "Required"],
		},
		approval: {
			type: String,
			required: [true, "Required"],
			enum: ["Pending", "Disapproved", "Approved"],
		},
	},
	approvalBUHead: {
		approver: {
			type: Object,
			required: [true, "Required"],
		},
		approval: {
			type: String,
			required: [true, "Required"],
			enum: ["Pending", "Disapproved", "Approved"],
		},
	},
	approvalCHRODDirector: {
		approver: {
			type: Object,
			required: [true, "Required"],
		},
		approval: {
			type: String,
			required: [true, "Required"],
			enum: ["Pending", "Disapproved", "Approved"],
		},
	},
	disapproveReason: {
		type: String,
	},
	reference_skillSetupID: {
		type: Schema.Types.ObjectId,
	},
	kpi_list: [
		{
			type: String,
		},
	],
});

module.exports = mongoose.model("trainingNomination", trainingNominationSchema);

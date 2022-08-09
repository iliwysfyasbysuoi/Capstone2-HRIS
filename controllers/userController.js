const userModel = require("../models/userModel.js");
// const { ObjectId } = require("bson");

const userController = {
	getEmployees: function (req, res) {
		userModel.find({}, function (err, result) {
			res.send(result);
		});
	},
	get_employees: function (req, res) {
		const { id_list, needed_data } = req.query;
		// console.log(id_list);
		// console.log(needed_data);
		userModel.find(
			{ _id: { $in: id_list } },
			needed_data,
			function (err, data) {
				if (err) return console.log("Error", err);
				res.send(data);
			}
		);
	},
	getEmployeesSameDept: function (req, res) {
		// bu and dept of current user
		const businessUnit = req.session.businessUnit;
		const department = req.session.department;

		userModel.find({ businessUnit, department }, function (err, result) {
			// console.log("result", result);
			res.send(result);
		});
	},
	/** returns assessmentLength of employees with the same position givin*/
	getAssessmentLength: function (req, res) {
		// bu and dept of current user
		const position = req.params.position;
		userModel.find(
			{ position },
			"_id assessmentLength",
			function (err, result) {
				res.send(result);
			}
		);
	},
	getUserPublicInfo: function (req, res) {
		var _id = req.params._id;
		var variables =
			"_id email firstName lastName businessUnit department position";
		userModel.findOne({ _id: _id }, variables, function (err, result) {
			res.send(result);
		});
	},
};

module.exports = userController;

const cycle = require("../../models/performance/perfoGoalCycleModel");
const appraisal = require("../../models/performance/perfoAppraisalModel.js");
const userModel = require("../../models/userModel.js");
const { ObjectId } = require("bson");

const PerformanceAppraisalIndividualController = {
	PerformanceAppraisalIndividual: function (req, res) {
		const id = req.params.id;
		const date = req.params.date;

		appraisal.findOne({ _id: id }).then(result => {
			userModel.findOne({ _id: result.userId }).then(user => {
				cycle
					.findOne({
						_id: result.cycleId,
					})
					.then(cycleData => {
						res.render("pages/Performance/PerformanceReviewFormPage", {
							PerformanceAppraisalIndividualData: result,
							cycleData: cycleData,
							user: user,
							appraisalId: id,
						});
					})
					.catch(err => console.log(err));
			});
		});
	},
	PerformanceAppraisalIndividualPage: function (req, res) {
		const id = req.params.id;

		// console.log(id);
		appraisal.findOne({ _id: id }).then(result => {
			userModel.findOne({ _id: result.userId }).then(user => {
				res.render("pages/performance/PerformanceSatisfactionIndividualPage", {
					appraisalData: result,
					userData: user,
				});
			});
		});
	},
};

module.exports = PerformanceAppraisalIndividualController;

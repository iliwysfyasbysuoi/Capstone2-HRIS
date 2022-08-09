const userModel = require("../models/userModel.js");
const offboardingModel = require("../models/offboardingModel.js");
const exitSurveyModel = require("../models/exitSurveyModel");
const { ObjectId } = require("bson");

const OffboardingTrackerController = {
	ClearanceForm: function (req, res) {
		userModel.find({}).then(userData => {
			res.send(userData);
		});
	},
	OffboardingTracker: function (req, res) {
		// if PRF has a data
		var validPosition = [
			"HR Supervisor",
			"Department Head",
			"Business Unit Head",
			"Department Director",
		];
		const { name, position, department, businessUnit } = req.session;
		// console.log(name);
		if (validPosition.includes(position)) {
			offboardingModel.find({}, function (err, offboardingData) {
				switch (position) {
					case validPosition[0]:
						res.render("pages/OffboardingTrackerPage", {
							offboardingData: offboardingData,
						});
						break;
					case validPosition[1]:
						let filteredData = [];

						offboardingData.map((data, idx) => {
							let indiv = data.accountabilities.find(
								acc => acc.approver === name
							);
							// console.log(indiv);
							if (indiv) {
								filteredData.push(offboardingData[idx]);
							}
						});

						res.render("pages/OffboardingTrackerPage", {
							offboardingData: filteredData,
						});
						break;
					case validPosition[2]:
						res.render("pages/OffboardingTrackerPage", {
							offboardingData: offboardingData.filter(
								data => data.businessUnit === businessUnit
							),
						});
						break;
					case validPosition[3]:
						if (
							department ===
							"Corporate Human Resource & Organization Department"
						) {
							res.render("pages/OffboardingTrackerPage", {
								offboardingData: offboardingData,
							});
							break;
						}
					default:
						res.redirect("back");
				}
			});
		} else res.redirect("back");
	},
	OffboardingIndividual: function (req, res) {
		var offboardingID = req.params._id;
		var data = req.params.data;
		// console.log(data);
		// query mongodb
		// console.log("id", offboardingID);
		offboardingModel.findOne(
			{ _id: offboardingID },
			function (err, offboarding) {
				// offboarding.createdDateString = offboarding.createdDate.toLocaleDateString();
				// offboarding.targetStartDateString = offboarding.targetStartDate.toLocaleDateString();

				// if (offboarding.approvedDate != null)
				//     offboarding.approvedDateString = offboarding.approvedDate.toLocaleDateString();
				// else
				//     offboarding.approvedDateString = "N/A";

				// console.log(offboarding);
				// console.log("data");
				// console.log(offboarding);
				// console.log(data);
				res.render(`pages/OffboardingIndividualPage`, {
					// pass data
					offboarding,
					data,
				});
			}
		);
	},
	getOffboardingData: function (req, res) {
		const businessUnit = req.query.businessUnit,
			start = new Date(`${req.query.s_date}`),
			end = new Date(`${req.query.e_date}`).setDate(
				new Date(`${req.query.e_date}`).getDate() + 1
			), //date work around to include the exact date (added 1 day)
			needed_data = req.query.needed_data;

		offboardingModel.find(
			{
				updatedDate: { $gte: start, $lte: end },
				businessUnit,
			},
			`${needed_data}`,
			function (offboardingErr, offboardingData) {
				// console.log(false || true);
				if (req.query.exit_interview === "true")
					exitSurveyModel.find(
						{},
						"offboardingId reasonLeave companyPositive companyNegative returnFuture generalComments",
						function (exitSurveyErr, exitSurveyData) {
							res.send({ offboardingData, exitSurveyData });
						}
					);
				else res.send(offboardingData);
			}
		);
	},
};

module.exports = OffboardingTrackerController;

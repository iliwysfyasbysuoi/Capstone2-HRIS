const userModel = require("../../models/userModel.js");
const appraisal = require("../../models/performance/perfoAppraisalModel");
const perfoReviewModel = require("../../models/performance/perfoReviewModel");
const performanceGoalCycleModel = require("../../models/performance/perfoGoalCycleModel");
const notificationModel = require("../../models/notificationModel.js");
const { ObjectId } = require("bson");
const trainingNominationModel = require("../../models/trainingNominationModel.js");

const PerfoReviewCont = {
	submitReview: function (req, res) {
		const appraisalID = req.body.appraisalId;
		let skillsCompetencies = [];
		let kpiRatingList = [];

		// for goal cycle
		let ratings = [];

		// update the linked appraisal to state it was reviewed
		appraisal
			.updateOne(
				{
					_id: appraisalID,
				},
				{
					$set: {
						isReviewed: true,
					},
				}
			)
			.then()
			.catch(err => {
				throw err;
			});

		const {
			competencyName,
			competencyIncident,
			kpiRating,
			kpiDescription,
			kpikeyResAreas,
			kpiPerfoIndicator,
		} = req.body;

		// console.log(kpiDescription, kpikeyResAreas, kpiPerfoIndicator, kpiRating);
		// console.log(competencyName);

		if (kpiRating) {
			if (Array.isArray(kpiRating) && kpiRating.length > 1) {
				for (let i = 0; i < kpiRating.length; i++) {
					kpiRatingList.push({
						keyResAreas: kpikeyResAreas[i],
						description: kpiDescription[i],
						perfoIndicator: kpiPerfoIndicator[i],
						rating: kpiRating[i],
					});
					// for goal cycle
					ratings.push({
						keyResAreas: kpikeyResAreas[i],
						rating: kpiRating[i],
					});
				}
			} else {
				kpiRatingList.push({
					keyResAreas: kpikeyResAreas,
					description: kpiDescription,
					perfoIndicator: kpiPerfoIndicator,
					rating: kpiRating,
				});
				// for goal cycle
				ratings.push({
					keyResAreas: kpikeyResAreas,
					rating: kpiRating,
				});
			}
		}

		if (competencyName && competencyIncident) {
			if (Array.isArray(competencyName) && competencyName.length > 1) {
				for (let i = 0; i < competencyName.length; i++) {
					skillsCompetencies.push({
						skill: competencyName[i],
						displayedWhere: competencyIncident[i],
					});
				}
			} else {
				skillsCompetencies.push({
					skill: competencyName,
					displayedWhere: competencyIncident,
				});
			}
		}

		const data = req.body;
		const date_now = new Date(Date.now());
		// save perforamnce rev
		perfoReviewModel({
			...data,
			kpiRating: kpiRatingList,
			skillsCompetencies,
			_id: new ObjectId(),
			submissionDate: date_now,
		})
			.save()
			.then(reviewData => {
				// give ratings to the linked performance goal cycle
				appraisal
					.findOne(
						{
							_id: appraisalID,
						},
						"cycleId cycleDate"
					)
					.then(app => {
						performanceGoalCycleModel.findOne(
							{ _id: app.cycleId },
							"dates performanceRatings businessUnit department position",
							function (perfo_goal_err, cycle) {
								if (perfo_goal_err != null) throw perfo_goal_err;

								// stops at the right cycle
								const cycle_dates = cycle.dates;
								let date_slot = cycle_dates.length;
								cycle_dates.reverse();
								cycle_dates.every(date => {
									date_slot--;
									return !(date <= app.cycleDate);
								});
								const performanceRatings = cycle.performanceRatings;

								// var notifications = new notificationModel({
								// 	_id: new ObjectId(),
								// 	receiver: user,
								// 	isSeen: false,
								// 	description: `${req.session.name} submitted a review form`,
								// 	date: new Date(Date.now()),
								// 	referenceType: "Performance Review",
								// 	reference: reviewData,
								// });
								// notifications.save();

								if (performanceRatings[date_slot] == undefined)
									performanceRatings[date_slot] = [];
								// console.log("ratings", ratings);
								performanceRatings[date_slot].employees.push({
									userId: reviewData.userId,
									ratings,
								});

								// console.log("cycle.businessUnit", cycle.businessUnit);
								// console.log("cycle.department", cycle.department);
								// console.log("cycle.position", cycle.position);

								userModel.find(
									{
										position: cycle.position,
										department: cycle.department,
										businessUnit: cycle.businessUnit,
									},
									"_id",
									function (e_err, e) {
										if (e_err != null) throw e_err;
										// console.log("e_err", e_err);
										// console.log(
										// 	"performanceRatings[date_slot].employees.length",
										// 	performanceRatings[date_slot].employees.length
										// );
										// console.log("e.length", e.length);
										// console.log("fire the notification");
										// have to prove there is a training approved matching the
										//   position of the performance review

										if (
											performanceRatings[date_slot].employees.length ===
											e.length
										) {
											// console.log("fire the notification");
											// notif hr specialist
											userModel
												.findOne({
													position: "HR Specialist",
												})
												.then(user => {
													var notifications = new notificationModel({
														_id: new ObjectId(),
														receiver: user,
														isSeen: false,
														description: `Performance Reviews are complete for the ${cycle.position} position. You can create a training through this link using the Training Recommender.`,
														date: new Date(Date.now()),
														referenceType: "Create a Training",
														reference: {
															_id: "",
															position: cycle.position,
															department: cycle.department,
															businessUnit: cycle.businessUnit,
														},
													});
													notifications.save();
												});
										}

										// update performance ratings
										performanceGoalCycleModel
											.updateOne(
												{ _id: cycle._id },
												{ $set: { performanceRatings } }
											)
											.then(() => false)
											.catch(update_err => {
												throw update_err;
											});
									}
								);
							}
						);
					});

				// notif hr asst mgr
				userModel
					.findOne({
						position: "HR Assistant Manager",
					})
					.then(user => {
						var notifications = new notificationModel({
							_id: new ObjectId(),
							receiver: user,
							isSeen: false,
							description: `${req.session.name} submitted a review form`,
							date: new Date(Date.now()),
							referenceType: "Performance Review",
							reference: reviewData,
						});
						notifications.save();
					});
				// notif employee
				userModel
					.findOne({
						_id: reviewData.userId,
					})
					.then(user => {
						var notifications = new notificationModel({
							_id: new ObjectId(),
							receiver: user,
							isSeen: false,
							description: `${req.session.name} submitted a review form`,
							date: new Date(Date.now()),
							referenceType: "Performance Review",
							reference: reviewData,
						});
						notifications.save();
						res.redirect("/PerformanceAppraisalTracker");
					});
			})
			.catch(err => console.log(err));
	},

	PerformanceReview: function (req, res) {
		const id = req.params.id;
		perfoReviewModel
			.findOne({ _id: id })
			.then(result => {
				userModel.findOne({ _id: result.userId }).then(user => {
					appraisal.findOne({ _id: result.appraisalId }).then(appraisalData => {
						console.log(appraisalData);
						res.render(`pages/performance/PerformanceAppraisalIndividualPage`, {
							data: result,
							appraisalData: appraisalData,
							user,
						});
					});
				});
			})
			.catch(err => console.log(err));
	},
	PerformanceReviewTracker: function (req, res) {
		let users = [];
		// let reviewId = [];
		let userList = [];
		let positions = [];
		const { department, position } = req.session;
		var count = 0;
		let maxNum;

		// console.log(department);
		// console.log(position);
		if (position === "Department Head") {
			appraisal
				.find({
					isReviewed: false,
				})
				.then(data => {
					// console.log("data", data);
					if (data.length == 0) {
						res.render("pages/performance/PerformanceReviewTrackerPage", {
							userList,
							positions,
						});
					} else {
						maxNum = data.length;
						data.map(usr => {
							users.push({
								users: usr.userId,
								reviewId: usr._id,
							});
						});

						users.map(({ user, reviewId }) => {
							// console.log(users);

							userModel.findOne({ _id: user }).then(data => {
								if (!positions.includes(data.position)) {
									// console.log("data.position", data.position);
									positions.push(data.position);
								}
								if (data.department === department) {
									// console.log("dept", data.department);
									userList.push({
										users: data,
										reviewId: reviewId,
									});
								}
								count++;
								// console.log("count", count);
								if (count == maxNum) {
									// console.log(userList);
									// console.log(positions);
									res.render("pages/performance/PerformanceReviewTrackerPage", {
										userList,
										positions,
									});
								}
							});
						});
					}
				});
		} else {
			res.redirect("back");
		}
	},
	GetAllPerformanceDataByBUnitDepartmentPosition: function (req, res) {
		const {
			businessUnit,
			department,
			position,
			s_date,
			e_date,
			needed_data_rev,
			needed_data_app,
			needed_data_users,
		} = req.query;
		const start = new Date(s_date),
			end = new Date(e_date).setDate(new Date(e_date).getDate() + 1);

		userModel.find(
			{
				businessUnit,
				department,
				position,
			},
			needed_data_users,
			function (err, users) {
				if (err) throw err;
				let userIds = users.map(u => u._id);
				perfoReviewModel.find(
					{ userId: { $in: userIds } },
					needed_data_rev,
					function (errRev, reviews) {
						if (errRev) throw errRev;
						appraisal.find(
							{
								userId: { $in: userIds },
								submissionDate: { $gte: start, $lte: end },
							},
							needed_data_app,
							function (errApps, apps) {
								if (errApps) throw errApps;

								res.send({ reviews, apps, users });
							}
						);
					}
				);
			}
		);
	},
};

module.exports = PerfoReviewCont;

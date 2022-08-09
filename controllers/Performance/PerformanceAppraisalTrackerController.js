const cycle = require("../../models/performance/perfoGoalCycleModel");
const review = require("../../models/performance/perfoReviewModel");
const appraisal = require("../../models/performance/perfoAppraisalModel.js");
const { ObjectId } = require("bson");
const userModel = require("../../models/userModel.js");
let options = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
};

const PerformanceAppraisalTrackerController = {
	GetAllAppraisalData: function (req, res) {
		userIds = [];
		review.find({}).then(data => {
			data.map(usr => {
				userIds.push(usr.userId);
			});
			userModel
				.find({
					_id: { $in: userIds },
				})
				.then(userData => res.send(userData));
		});
	},
	PerformanceForm: function (req, res) {
		const id = req.params.id;
		const date = req.params.date;
		console.log(date);
		res.render("pages/performance/PerformanceAppraisalFormPage", {
			id: id,
			date: date,
		});
	},
	GetAppraisalData: function (req, res) {
		const { id } = req.params;
		console.log(id);
		review
			.findOne({
				appraisalId: id,
			})
			.then(data => res.send({ data: true, id: data._id }))
			.catch(err => res.send({ data: false }));
	},
	PerformanceAppraisal: function (req, res) {
		// console.log("try");
		const { businessUnit, department, position, email } = req.session;
		const userList = [];
		const userIds = [];
		const reviewIds = [];

		review.find({}).then(reviewData => {
			reviewData.map(revData => {
				userIds.push(revData.userId);
				reviewIds.push({ id: revData._id, date: revData.submissionDate });
			});

			userIds.map((uId, idx) => {
				userModel
					.findOne({
						_id: uId,
					})
					.then(userData => {
						switch (position) {
							case "HR Assistant Manager":
								userList.push({
									user: userData,
									reviewData: reviewIds[idx],
								});
								break;
							case "Department Head":
								if (
									userData &&
									userData.department === department &&
									userData.businessUnit === businessUnit
								) {
									userList.push({
										user: userData,
										reviewData: reviewIds[idx],
									});
								}
								break;
							default:
								if (userData && userData.email === email) {
									userList.push({
										user: userData,
										reviewData: reviewIds[idx],
									});
								}
						}
					});
			});

			res.render("pages/Performance/PerformanceAppraisalTrackerPage", {
				userList,
			});
		});

		// review.find(
		//   {},
		//   function (err, perfdata) {
		//     if (err) return console.error(err);
		//     if (perfdata.length > 0) {

		//       perfdata.map((apprData, i) => {
		//         console.log(apprData)
		//         userModel.findOne({ _id: apprData.userId }, function (e, user) {

		//           if (userIsHR) {
		//             const data = {
		//               i: i + 1,
		//               _id: apprData._id,
		//               name: `${user.firstName} ${user.lastName}`,
		//               position: user.position,
		//               department: user.department,
		//               businessUnit: user.businessUnit,
		//               dateSubmitted: perfdata.submissionDate,
		//             };
		//             PerformanceAppraisalData.push(data);
		//           }
		//           else if (posOfCurrentUser === "Department Head" && user) {
		//             if (user.department === req.session.department) {
		//               const data = {
		//                 i: i + 1,
		//                 _id: apprData._id,
		//                 name: `${user.firstName} ${user.lastName}`,
		//                 position: user.position,
		//                 department: user.department,
		//                 businessUnit: user.businessUnit,
		//                 dateSubmitted: perfdata.submissionDate,
		//               };
		//               PerformanceAppraisalData.push(data);
		//             }
		//           }

		//           else {
		//             if (user.email === req.session.email) {
		//               const data = {
		//                 i: i + 1,
		//                 _id: apprData._id,
		//                 name: `${user.firstName} ${user.lastName}`,
		//                 position: user.position,
		//                 department: user.department,
		//                 businessUnit: user.businessUnit,
		//                 dateSubmitted: perfdata.submissionDate,
		//               };
		//               // console.log(data);
		//               PerformanceAppraisalData.push(data);
		//             }
		//           }
		//         });
		//       });

		//       res.render("pages/Performance/PerformanceAppraisalTrackerPage", {
		//         PerformanceAppraisalDataToAnswer,
		//         PerformanceAppraisalData,
		//         userIsHR,
		//       });
		//     }

		//   }
		// );
	},
	PerformanceSatisfaction: function (req, res) {
		const posOfCurrentUser = req.session.position;
		const userIsHR = posOfCurrentUser !== "HR Assistant Manager";
		let positions = [];
		let names = [];
		let filteredData = [];
		// get all cycles
		let PerformanceAppraisalDataToAnswer = [];
		let data = [];
		var count = 0;
		let maxNum;

		appraisal.find({}).then(data => {
			maxNum = data.length;

			data.map((result, i) => {
				userModel
					.findOne({
						_id: result.userId,
					})
					.then(user => {
						if (!positions.includes(user.position)) {
							positions.push(user.position);
						}

						const satisfactionData = {
							i: i + 1,
							_id: result._id,
							name: `${user.firstName} ${user.lastName}`,
							position: user.position,
							department: user.department,
							businessUnit: user.businessUnit,
							dateSubmitted: result.submissionDate.toLocaleString(options),
						};
						// console.log(data);
						filteredData.push(satisfactionData);

						count++;
						if (count == maxNum) {
							res.render(
								"pages/Performance/PerformanceSatisfactionTrackerPage",
								{
									filteredData,
									positions,
									userIsHR,
								}
							);
						}
					});
			});
		});
	},
};

module.exports = PerformanceAppraisalTrackerController;

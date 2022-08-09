const userModel = require("../../models/userModel.js");
const goalCycleModel = require("../../models/performance/perfoGoalCycleModel.js");
const notificationModel = require("../../models/notificationModel.js");
const appraisal = require("../../models/performance/perfoAppraisalModel.js");
const { ObjectId } = require("bson");
// const customDate = require("../assets/js/utils/custom-date");

// var curDate = new Date(Date.now());
// curDate = new Date(YYYYMMDDtoDate(curDate));

const PerformanceSetGoalsCycleFormController = {
	GetCycleData: function (req, res) {
		const userId = req.session._id;
		const { id, date } = req.params;
		console.log(new Date(date));
		appraisal
			.findOne({
				cycleId: id,
				userId: userId,
				cycleDate: new Date(date),
			})
			.then(data => {
				res.send(data);
				console.log(data);
			})
			.catch(err => {
				res.send(err);
				console.log(err);
			});
	},
	InvidualView: function (req, res) {
		const id = req.params.id;
		goalCycleModel.findOne({ _id: id }).then(result => {
			res.render(`pages/performance/PerformanceIndividualGoalsCycle`, {
				data: result,
			});
		});
	},
	GetAllCycleData: function (req, res) {
		const { businessUnit, department } = req.session;
		// const { filter } = req.params;
		goalCycleModel
			.find({
				businessUnit: businessUnit,
				department: department,
			})
			.then(result => {
				// console.log(req.params.filter);
				let positions = [];
				const filterData = result;
				userModel
					.find(
						{
							businessUnit: businessUnit,
							department: department,
						},
						"position"
					)
					.then(users => {
						users.map(user => {
							// if (
							//   user.position !== "Department Head" &&
							//   user.position !== "Department Director"
							// ) {
							if (
								![
									"Department Head",
									"Department Director",
									"Direct Supervisor",
									"Business Unit Head",
								].includes(user.position)
							) {
								positions.push(user.position);
							}
						});
						// const positionsSet = new Set(positions);
						positions = [...new Set(positions)];
						res.render("pages/performance/PerformanceSetGoalsCycleFormPage", {
							GoalsCycleData: filterData,
							// position: positions,
							positions,
							// filter,
						});
					});
			});
	},
	// getCycleData: function (req, res) {
	//   PerformanceCycleData = [];
	//   goalCycleModel.find(
	//     {},
	//     null,
	//     { sort: { startDate: 1 } },
	//     function (err, goalCycleData) {
	//       if (err) return console.error(err);

	//       if (goalCycleData) res.send(goalCycleData);
	//     }
	//   );
	//   // res.render("pages/PerformanceSetGoalsCycleForm", {
	//   //   PerformanceCycleData: PerformanceCycleData,
	//   // });
	// },

	submitCycle: function (req, res) {
		// save data in db

		const {
			position,
			KPI,
			description,
			performanceIndicator,
			reviewCycle,
			startDate,
			numberCycle,
		} = req.body;

		let dates = [startDate];

		var j = 0;
		for (var i = 0; i < numberCycle; i++) {
			const nextDate =
				reviewCycle === "Annual"
					? new Date(dates[j]).setFullYear(new Date(dates[j]).getFullYear() + 1)
					: new Date(dates[j]).setMonth(
							new Date(dates[j]).getMonth() +
								(reviewCycle === "Bi-Annual"
									? 6
									: reviewCycle === "Quarterly"
									? 3
									: i) //!CHECK THIS
					  );

			dates.push(new Date(nextDate));
			j++;
		}

		const numberOfCycles = Number(numberCycle);
		const cyclesLeft = Number(numberCycle);
		// console.log(typeof startDate);
		const notifyDate =
			reviewCycle === "Annual"
				? new Date(startDate).setFullYear(new Date(startDate).getFullYear() + 1)
				: new Date(startDate).setMonth(
						new Date(startDate).getMonth() +
							(reviewCycle === "Bi-Annual"
								? 6
								: reviewCycle === "Quarterly"
								? 3
								: 0)
				  );

		const businessUnit = req.session.businessUnit;
		const department = req.session.department;
		// console.log(`numberOfCycles ${numberCycle}`);
		// console.log(`Number(nubmerCycle) ${Number(numberCycle)}`);
		// console.log(req.body.numberCycle);
		let listOfCycles = [];
		if (Array.isArray(KPI)) {
			KPI.map((kpi, i) =>
				listOfCycles.push({
					keyResAreas: kpi,
					description: description[i],
					perfoIndicator: performanceIndicator[i],
				})
			);
		} else
			listOfCycles.push({
				keyResAreas: KPI,
				description: description,
				perfoIndicator: performanceIndicator,
			});

		const data = {
			_id: ObjectId(),
			listOfCycles,
			position,
			reviewCycle,
			dates: dates.slice(1, dates.length),
			startDate,
			numberOfCycles,
			cyclesLeft,
			notifyDate,
			businessUnit,
			department,
		};
		// console.log("dates to", dates);
		// console.log(listOfCycles);

		const notifyExpireDate = new Date(dates[dates.length - 1]);
		// reviewCycle === "Annual"
		// 	? .setFullYear(
		// 			new Date(dates[dates.length - 1]).getFullYear() + 1
		// 	  )
		// 	: new Date(dates[dates.length - 1]).setMonth(
		// 			new Date(dates[dates.length - 1]).getMonth() +
		// 				(reviewCycle === "Bi-Annual"
		// 					? 6
		// 					: reviewCycle === "Quarterly"
		// 					? 3
		// 					: 0)
		// 	  );

		let receiver_dh = req.session;
		receiver_dh._id = ObjectId(receiver_dh._id);
		const notifToDHead_expiredCycle = new notificationModel({
			_id: ObjectId(),
			receiver: receiver_dh,
			date: new Date(notifyExpireDate),
			description: `Goal cycle ended. Set cycle and goals now.`,
			referenceType: "Set Cycle and Goals",
			reference: data,
			task: "Set Cycle and Goals",
		});
		notifToDHead_expiredCycle.save();

		const cycle = new goalCycleModel(data);
		cycle
			.save()
			.then(data => {
				userModel
					.find({
						position: position,
						businessUnit: businessUnit,
						department: department,
						status: "Employee",
					})
					.then(res => {
						dates.slice(1, dates.length).map(date => {
							res.map(emp => {
								const notifToAnswerAppraisal = new notificationModel({
									_id: ObjectId(),
									receiver: emp,
									date: new Date(date),
									description: `Please answer the Performance Appraisal. Click this notification to be redirected to the form.`,
									referenceType: "Performance Appraisal",
									reference: data,
									task: "Answer Performance Appraisal",
								});
								notifToAnswerAppraisal.save().then(
									() => console.log("")
									// console.log("sent to", emp.firstName, data)
								);
							});
						});
					})
					.catch(() => console.log(""));
			})
			.catch(err => console.error(""));

		// notif employees - at start date
		// not (Department Head,
		// Department Director,
		// Business Unit Head,
		// Direct Supervisor) and (w same (business unit and dept))

		res.redirect("/PerformanceSetGoalsCycleForm");
		// reload page?
		// res.render("/pages/PerformanceSetGoalsCycleFormPage", {});
	},

	/**
	 * checks and sends data if an existing active goal cycle is existing
	 * uses: position(req), startDate(req), and lastDate in the dates Array of each goalCycleData (db)
	 *
	 * if the startDate is BEFORE the latest date in the date Array, there is an existing active goal cycle
	 *
	 * i was gonna use the cycleLeft but realized there would be a problem if the user wants to schedule the next cycle ahead.
	 *
	 */
	getExistingActiveGoalsCycle: function (req, res) {
		var position = req.body.position;
		var startDate = new Date(req.body.startDateString);
		var isStartDateBeforeExpireDate = false;
		var index;

		goalCycleModel.find({ position: position }, function (err, goalCycleData) {
			if (err) throw err;

			for (i = 0; i < goalCycleData.length; i++) {
				var dateIndex = goalCycleData[i].dates.length - 1;
				var lastDate = goalCycleData[i].dates[dateIndex];
				if (startDate.getTime() < lastDate.getTime()) {
					index = i;
					isStartDateBeforeExpireDate = true;
				}
			}

			if (isStartDateBeforeExpireDate == true) {
				res.send({ showNotice: true, goalCycleData: goalCycleData[index] });
			} else res.send({ showNotice: false });
		});
	},
	GetAllCyclesUsingBUnitAndDept: function (req, res) {
		const { businessUnit, department, s_date, e_date, needed_data } = req.query;
		const start = new Date(s_date),
			end = new Date(e_date).setDate(new Date(e_date).getDate() + 1);
		goalCycleModel.find(
			{ businessUnit, department, startDate: { $gte: start, $lte: end } },
			needed_data,
			function (err, goalCycleData) {
				if (err) throw err;
				res.send(goalCycleData);
			}
		);
	},
	get_current_cycle: function (req, res) {
		const { businessUnit, department, needed_data } = req.query;
		const curr_date = new Date(Date.now());
		goalCycleModel.find(
			{ businessUnit, department },
			needed_data,
			function (err, goal_cycle_data) {
				if (err) throw err;
				let current_cycles = [];
				goal_cycle_data.forEach(cycle => {
					if (
						cycle.dates[cycle.dates.length - 1] >= curr_date &&
						cycle.startDate <= curr_date
					) {
						current_cycles.push(cycle.listOfCycles);
					}
				});
				res.send(current_cycles);
			}
		);
	},
};

module.exports = PerformanceSetGoalsCycleFormController;

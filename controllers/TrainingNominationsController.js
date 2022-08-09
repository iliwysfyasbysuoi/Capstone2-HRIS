const { ObjectId } = require("bson");
const trainingNominationModel = require("../models/trainingNominationModel.js");
const employeeTrackerModel = require("../models/employeeTrackerModel.js");
const trainingEvaluationModel = require("../models/trainingEvaluationModel.js");
const userModel = require("../models/userModel.js");
const notificationModel = require("../models/notificationModel.js");
const performanceGoalCycleModel = require("../models/performance/perfoGoalCycleModel");

// testing
// const appraisal = require("../models/performance/perfoAppraisalModel");

// converts date string yyyy-mm-dd to Date data
function YYYYMMDDtoDate(date) {
	var sendDate =
		date.getFullYear() +
		"-" +
		(date.getMonth() + 1) +
		"-" +
		("0" + date.getDate()).slice(-2) +
		"T" +
		("0" + date.getHours()).slice(-2) +
		":" +
		("0" + date.getMinutes()).slice(-2) +
		":" +
		("0" + date.getSeconds()).slice(-2) +
		".000+08:00";

	return sendDate;
}

function updateApproval(status, id, position, disappoveContent, res) {
	if (status == "Approving") {
		trainingNominationModel.findOneAndUpdate(
			{ trainingID: id },
			{ $set: position },
			function (err, result) {
				// find the PRF and check if all approves.
				trainingNominationModel.findOne(
					{ trainingID: id },
					function (err, updatedTNF) {
						if (
							updatedTNF.approvalBUHead.approval == "Approved" &&
							updatedTNF.approvalDHead.approval == "Approved" &&
							updatedTNF.approvalCHRODDirector.approval == "Approved"
						) {
							var curDate = new Date(Date.now());
							var approvedDate = new Date(YYYYMMDDtoDate(curDate));
							// sets PRF status to "Approved" and sets approvedDate to date today.

							// var HRSpecialist;

							// update trainings array in perfo goal cycle collection
							let employeePositions = [];
							updatedTNF.employees.forEach(employee => {
								employeePositions.push(employee.employeePosition);
							});
							performanceGoalCycleModel.find(
								{ position: { $in: employeePositions } },
								"startDate dates trainings",
								function (perfo_err, goal_cycles) {
									if (perfo_err != null) throw perfo_err;
									let date_slot = -1; //index where we'll put the training id
									goal_cycles.every(cycle => {
										const cycle_dates = cycle.dates;
										const end_date = cycle_dates[cycle_dates.length - 1];
										const start_date = cycle.startDate;
										// console.log("end_date", end_date);
										// console.log("start_date", start_date);
										// console.log("curDate", curDate);

										// goes in if the goal cycle is ongoing
										if (curDate <= end_date && curDate >= start_date) {
											// stops at the right cycle
											cycle_dates.every(date => {
												// console.log(date);
												date_slot++;
												return date <= curDate;
											});
											// console.log(date_slot);
											// console.log("cycle.trainings", cycle.trainings);
											// console.log("id", id);
											// console.log("new ObjectId(id)", updatedTNF._id);
											let trainings = cycle.trainings;
											if (trainings[date_slot] == null)
												trainings[date_slot] = [];
											trainings[date_slot].push(new ObjectId(updatedTNF._id));

											// console.log("cycle.trainings", cycle.trainings);
											// console.log("trainings", trainings);

											// update trainings array
											performanceGoalCycleModel
												.updateOne({ _id: cycle._id }, { $set: { trainings } })
												.then(() => false)
												.catch(update_err => {
													throw update_err;
												});
											return false;
										}
										return true;
									});
								}
							);

							trainingNominationModel.updateOne(
								{ trainingID: id },
								{ $set: { status: "Approved", approvedDate: approvedDate } },
								function () {
									var employees = result.employees;

									var trainingReferences = [];

									//! saving trainings per date in array
									for (i = 0; i < result.inclusiveDates.length; i++) {
										var training = new employeeTrackerModel({
											_id: new ObjectId(),
											trainingDetails: {
												id: result._id,
												trainingTitle: result.trainingTitle,
												trainingVenue: result.venue,
												trainingSponsor: result.sponsor,
												trainingDate: result.inclusiveDates[i],
											},
											employees,
											trainingID: result.trainingID,
											status: "Approved",
										});

										training.save();
										trainingReferences.push(training);
									}

									userModel.findOne(
										{
											position: "HR Specialist",
										},
										function (err, user) {
											//okay
											var description = `Training Nomination Form #${result.trainingID} has been approved.`;

											var notifications = new notificationModel({
												_id: new ObjectId(),
												receiver: user,
												isSeen: false,
												description: description,
												date: new Date(Date.now()),
												referenceType: "TNF",
												reference: result,
											});

											//!map through dates
											for (var i = 0; i < trainingReferences.length; i++) {
												var scheduleNotification = new notificationModel({
													_id: new ObjectId(),
													receiver: user,
													isSeen: false,
													description: `Confirm attendance for Training #${trainingReferences[i].trainingID}`,
													date: trainingReferences[i].trainingDetails
														.trainingDate,
													referenceType: "Training Schedule HRSpecialist",
													reference: trainingReferences[i],
													task: "Confirm Attendance",
												});
												scheduleNotification.save();
											}

											notifications.save();
										}
									);

									//!mapping through different emplyoees
									employees.map(employee => {
										userModel.findOne(
											{
												_id: employee.employeeID,
											},
											function (err, employeeResult) {
												var notifications = new notificationModel({
													_id: new ObjectId(),
													receiver: employeeResult,
													isSeen: false,
													description: `You have a new scheduled training.`,
													date: new Date(Date.now()),
													referenceType: "Training Schedule",
													reference: result,
												});
												notifications.save();
											}
										);
									});

									res.redirect("back");
								}
							);
						} else {
							res.redirect("back");
						}
					}
				);
			}
		);
	} else {
		trainingNominationModel.findOneAndUpdate(
			{ trainingID: id },
			{ $set: position },
			function (err, result) {
				var curDate = new Date(Date.now());
				var createdDate = new Date(YYYYMMDDtoDate(curDate));
				// console.log(result);
				userModel.findOne(
					{
						position: "HR Specialist",
					},
					function (err, employeeResult) {
						//!not showing up
						notifications = new notificationModel({
							_id: new ObjectId(),
							receiver: employeeResult,
							isSeen: false,
							description: `Training Nomination #${id} has been disapproved by ${disappoveContent.name} from ${disappoveContent.department} of ${disappoveContent.businessUnit}`,
							date: curDate,
							referenceType: "TNF",
							reference: result,
						});
						notifications.save();
					}
				);

				res.redirect("back");
			}
		);
	}
}

const TrainingNominationsController = {
	SubmitNominationForm: function (req, res) {
		if (req.session.position !== "HR Specialist")
			return res.redirect("/pages/errorPage");
		trainingNominationModel.find({}, function (_, result) {
			var trainingID = result.length + 1;
			const { department, businessUnit } = req.body;
			let employees = [],
				skills = [],
				dates = [],
				kpi_list = [];

			// console.log("req.body", req.body);

			if (typeof req.body.employeeName == "string") {
				employees[0] = {
					employeeID: req.body.employeeID,
					employeeName: req.body.employeeName,
					employeePosition: req.body.employeePosition,
					employeeContractPeriod: req.body.employeeContractPeriod,
					attendance: "Pending",
				};
			} else {
				for (var i = 0; i < Object.keys(req.body.employeeName).length; i++) {
					employees.push({
						employeeID: req.body.employeeID[i],
						employeeName: req.body.employeeName[i],
						employeePosition: req.body.employeePosition[i],
						employeeContractPeriod: req.body.employeeContractPeriod[i],
						attendance: "Pending",
					});
				}
			}

			if (typeof req.body.inclusiveDates == "string") {
				dates[0] = req.body.inclusiveDates;
			} else {
				dates = req.body.inclusiveDates;
			}

			if (typeof req.body.kpi == "string") kpi_list[0] = req.body.kpi;
			else kpi_list = req.body.kpi;

			if (typeof req.body.skillPosition == "string") {
				skills[0] = {
					skillPosition: req.body.skillPosition,
					skillName: req.body.skillName,
					skillDepartment: department,
					skillBusinessUnit: businessUnit,
				};
			} else {
				for (var i = 0; i < Object.keys(req.body.skillPosition).length; i++) {
					skills.push({
						skillPosition: req.body.skillPosition[i],
						skillName: req.body.skillName[i],
						skillDepartment: department,
						skillBusinessUnit: businessUnit,
					});
				}
			}

			var approverVariables =
				"_id email firstName lastName businessUnit department position";

			//notify users
			userModel.findOne(
				{
					businessUnit,
					department,
					position: "Department Head",
				},
				approverVariables,
				function (err, departmentHead) {
					if (err) throw err;
					var approvalDHead = {
						approver: departmentHead,
						approval: "Pending",
					};

					userModel.findOne(
						{
							//query
							businessUnit,
							position: "Business Unit Head",
						},
						approverVariables,
						function (err, BUHead) {
							var approvalBUHead = { approver: BUHead, approval: "Pending" };
							// if this is the current user, mark as Approved na

							userModel.findOne(
								{
									//query
									businessUnit: "Circle Corporation Inc.",
									department:
										"Corporate Human Resource & Organization Department",
									position: "Department Director",
								},
								//variables to get
								approverVariables,
								function (err, CHRODDirector) {
									var approvalCHRODDirector = {
										approver: CHRODDirector,
										approval: "Pending",
									};

									const nominationDetails = new trainingNominationModel({
										_id: ObjectId(),
										trainingID,
										trainingTitle: req.body.trainingTitle,
										sponsor: req.body.sponsor,
										venue: req.body.venue,
										reason: req.body.trainingReason,
										inclusiveDates: dates,
										trainingFee: req.body.trainingFee,
										registrationRequirements: req.body.registrationRequirements,
										department,
										businessUnit,
										skills,
										employees,
										approvalDHead,
										approvalBUHead,
										approvalCHRODDirector,
										status: "For Approval",
										requestDate: new Date(Date.now()),
										updatedDate: new Date(Date.now()),
										reference_skillSetupID:
											req.body.skillSetupID && req.body.skillSetupID != "null"
												? ObjectId(req.body.skillSetupID)
												: ObjectId(),
										kpi_list,
									});

									nominationDetails.save();

									var description = `Approval needed for a Training Nomination Form #${nominationDetails.trainingID} that ${req.session.name} from ${req.session.businessUnit} submitted.`;

									var receivers = [departmentHead, BUHead, CHRODDirector];

									for (var i = 0; i < receivers.length; i++) {
										var notifications = new notificationModel({
											_id: new ObjectId(),
											receiver: receivers[i],
											isSeen: false,
											description: description,
											date: new Date(Date.now()),
											referenceType: "TNF",
											reference: nominationDetails,
											task: "Training Nomination Approval",
										});
										notifications.save();
									}
									res.redirect("/TrainingNominationTracker");
								}
							);
						}
					);
				}
			);
		});
	},
	GetAllNominations: function (req, res) {
		let query = {};
		const { department, businessUnit, position } = req.session;

		const positions = [
			"HR Specialist",
			"Department Head",
			"Business Unit Head",
			"Department Director",
		];
		switch (position) {
			case "HR Specialist":
				query = {};
				break;
			case "Department Head":
				query = { department, businessUnit };
				break;
			case "Business Unit Head":
				query = { businessUnit };
				break;
			case "Department Director":
				query = {};
				break;
		}

		if (positions.includes(position)) {
			trainingNominationModel.find(query, function (err, trainingNominations) {
				// if PRF has a data

				if (trainingNominations.length > 0) {
					for (i = 0; i < trainingNominations.length; i++) {
						if (i == trainingNominations.length - 1)
							res.render("pages/TrainingNominationTrackerPage", {
								TrainingNominationTrackerData: trainingNominations,
							});
					}
				} else {
					res.render("pages/TrainingNominationTrackerPage");
				}
			});
		} else {
			res.render("pages/errorPage", {});
		}
	},
	GetNextTrainingID: function (req, res) {
		trainingNominationModel.find({}, function (err, result) {
			var trainingID = result.length + 1;

			res.send(trainingID.toString());
		});
	},
	GetSingleTrainingForApproval: function (req, res) {
		trainingNominationModel.findOne(
			{ _id: req.params._id },
			function (err, result) {
				// console.log(result);
				res.render("pages/TrainingNominationApprovalPage", {
					training: result,
				});
			}
		);
	},
	GetScheduledTraining: function (req, res) {
		trainingNominationModel.findOne(
			{ _id: req.params._id },
			function (err, result) {
				res.render("pages/TrainingNominationIndividualPage", {
					training: result,
				});
			}
		);
	},
	DoINeedToApproveTNF: function (req, res) {
		var email = req.session.email;
		var position = req.session.position;
		var trainingID = req.body.trainingID;

		trainingNominationModel.findOne(
			{ trainingID: trainingID },
			function (err, result) {
				// if the user's approval is pending, show .approvalButtons and .approvalTitle
				//returningnull
				if (
					(result.approvalDHead.approver.email == email &&
						result.approvalDHead.approval == "Pending") ||
					(result.approvalBUHead.approver.email == email &&
						result.approvalBUHead.approval == "Pending") ||
					(result.approvalCHRODDirector.approver.email == email &&
						result.approvalCHRODDirector.approval == "Pending")
				) {
					if (result.status == "For Approval") res.send("show");
				} else {
					res.send("hide");
				}
			}
		);
	},
	ApproveTNF: function (req, res) {
		var trainingID = req.params.trainingID;
		var department = req.session.department;
		var position = req.session.position;

		// approvalDHead
		if (position == "Department Head") {
			updateApproval(
				"Approving",
				trainingID,
				{
					"approvalDHead.approval": "Approved",
					updatedDate: new Date(Date.now()),
				},
				{},
				res
			);
		}
		//approvalBUHead
		else if (position == "Business Unit Head") {
			updateApproval(
				"Approving",
				trainingID,
				{
					"approvalBUHead.approval": "Approved",
					updatedDate: new Date(Date.now()),
				},
				{},
				res
			);
		}
		//approvalCHRODDirector
		else if (
			department == "Corporate Human Resource & Organization Department" &&
			position == "Department Director"
		) {
			updateApproval(
				"Approving",
				trainingID,
				{
					"approvalCHRODDirector.approval": "Approved",
					updatedDate: new Date(Date.now()),
				},
				{},
				res
			);
		}
	},
	DisapproveTNF: function (req, res) {
		var trainingID = req.body.trainingID;
		var department = req.session.department;
		var position = req.session.position;
		var name = req.session.name;
		var businessUnit = req.session.businessUnit;
		var disapproveReason = req.body.disapproveReason;

		// approvalDHead
		if (position == "Department Head") {
			updateApproval(
				"Disapproving",
				trainingID,
				{
					"approvalDHead.approval": "Disapproved",
					status: "Disapproved",
					updatedDate: new Date(Date.now()),
					disapproveReason: disapproveReason,
				},
				{ department, name, businessUnit },
				res
			);
		}
		//approvalBUHead
		else if (position == "Business Unit Head") {
			updateApproval(
				"Disapproving",
				trainingID,
				{
					"approvalBUHead.approval": "Disapproved",
					status: "Disapproved",
					updatedDate: new Date(Date.now()),
					disapproveReason: disapproveReason,
				},
				{ department, name, businessUnit },
				res
			);
		}
		//approvalCHRODDirector
		else if (
			department == "Corporate Human Resource & Organization Department" &&
			position == "Department Director"
		) {
			updateApproval(
				"Disapproving",
				trainingID,
				{
					"approvalCHRODDirector.approval": "Disapproved",
					status: "Disapproved",
					updatedDate: new Date(Date.now()),
					disapproveReason: disapproveReason,
				},
				{ department, name, businessUnit },
				res
			);
		}
	},
	GetApprovedNominations: function (req, res) {
		employeeTrackerModel.find(
			{ status: "Approved" },
			function (err, trainingNominations) {
				if (trainingNominations.length > 0) {
					res.render("pages/TrainingTrackerPage", {
						trainingNominations,
					});
				} else {
					res.render("pages/TrainingTrackerPage");
				}
			}
		);
	},
	GetConfirmAttendancePage: function (req, res) {
		employeeTrackerModel.findOne(
			{ _id: req.params._id },
			function (err, result) {
				// console.log("result", result);
				if (result && result.answered) {
					res.render("pages/ConfirmAttendanceIndividualPage", {
						tracker: result,
					});
				} else {
					res.render("pages/ConfirmAttendancePage", {
						tracker: result,
					});
				}
			}
		);
	},
	UpdateAttendance: function (req, res) {
		employeeTrackerModel.findOne(
			{ _id: req.params._id },
			function (err, result) {
				var list = req.body.employeeAttendance;

				var newEmployeeList = [];

				if (typeof req.body.employeeAttendance == "string") {
					newEmployeeList[0] = {
						employeeID: result.employees[0].employeeID,
						employeeName: result.employees[0].employeeName,
						attendance: req.body.employeeAttendance,
						employeeContractPeriod: result.employees[0].employeeContractPeriod,
						employeePosition: result.employees[0].employeePosition,
					};
				} else {
					for (var i = 0; i < result.employees.length; i++) {
						newEmployeeList.push({
							employeeID: result.employees[i].employeeID,
							employeeName: result.employees[i].employeeName,
							attendance: list[i],
							employeeContractPeriod:
								result.employees[i].employeeContractPeriod,
							employeePosition: result.employees[i].employeePosition,
						});
					}
				}

				employeeTrackerModel.updateOne(
					{ _id: req.params._id },
					{ $set: { employees: newEmployeeList, answered: true } },
					function () {
						//notify employees
						newEmployeeList.map(employee => {
							userModel.findOne(
								{
									_id: employee.employeeID,
								},
								function (err, employeeResult) {
									//if employee attendance prsent or late => notify
									//else do nothing
									if (
										employee.attendance != "Absent" &&
										employee.attendance != "Pending"
									) {
										var notifications = new notificationModel({
											_id: new ObjectId(),
											receiver: employeeResult,
											isSeen: false,
											description:
												"You may now answer the Training Evaluation Form",
											date: new Date(Date.now()),
											referenceType: "Answer Training Evaluation",
											reference: result,
											task: "Answer Training Evaluation",
										});

										notifications.save();
									}
									// else {
									// 	// console.log("no notif");
									// }
								}
							);
						});

						res.redirect("/GetApprovedNominations");
					}
				);
			}
		);
	},
	GetTrainingDetailsForEvaluationForm: function (req, res) {
		employeeTrackerModel.findOne(
			{ _id: req.params._id },
			function (err, trainingNomination) {
				trainingEvaluationModel.find({}, function (err, result) {
					var evaluationID = result.length + 1;

					result = {
						id: trainingNomination._id.toString(),
						trainingDetails: trainingNomination.trainingDetails,
						evaluationID: evaluationID.toString(),
					};

					res.render("pages/TrainingEvaluationFormPage", result);
				});
			}
		);
	},
	AnswerEvaluationForm: function (req, res) {
		const {
			programUsefulness,
			programAdequacy,
			programSkillsPractice,
			programInstructorKnowledge,
			programInstructorDelivery,
			programFacility,
			programAVSupport,
			programLectureNotes,
			programDuration,
			comments,
			commitmentStatement,
		} = req.body;

		trainingEvaluationModel.find({}, function (err, result) {
			var evaluationID = result.length + 1;
			employeeTrackerModel.findOne(
				{ _id: req.params._id },
				function (err, employeeTracker) {
					details = {
						_id: new ObjectId(),
						evaluationID,
						programUsefulness,
						programAdequacy,
						programSkillsPractice,
						programInstructorKnowledge,
						programInstructorDelivery,
						programFacility,
						programAVSupport,
						programLectureNotes,
						programDuration,
						comments,
						commitmentStatement,
						trainingDetails: {
							trainingID: employeeTracker.trainingID,
							trainingTitle: employeeTracker.trainingDetails.trainingTitle,
							trainingVenue: employeeTracker.trainingDetails.trainingVenue,
							trainingSponsor: employeeTracker.trainingDetails.trainingSponsor,
							trainingDate: employeeTracker.trainingDetails.trainingDate,
							id: employeeTracker.trainingDetails.id,
						},
						employeeDetails: {
							id: req.session._id,
							name: req.session.name,
							department: req.session.department,
							position: req.session.position,
						},
						createdDate: new Date(Date.now()),
						employeeTrackerID: req.params._id,
					};

					var evaluation = new trainingEvaluationModel(details);
					evaluation.save();

					userModel.findOne(
						{
							position: "HR Specialist",
						},
						function (err, HRSpecialist) {
							var description = `${req.session.name} from ${req.session.businessUnit} has answered the Training Evaluation Form #${evaluation.evaluationID} for Training Nomination #${evaluation.trainingDetails.trainingID}.`;

							var notifications = new notificationModel({
								_id: new ObjectId(),
								receiver: HRSpecialist,
								isSeen: false,
								description,
								date: new Date(Date.now()),
								referenceType: "Training Evaluation Form Answer",
								reference: evaluation,
							});
							notifications.save();

							res.redirect("/");
						}
					);
				}
			);
		});
	},
	GetNextEvaluationID: function (req, res) {
		trainingEvaluationModel.find({}, function (err, result) {
			var evaluationID = result.length + 1;

			res.send(evaluationID.toString());
		});
	},
	GetEvaluationForms: function (req, res) {
		trainingEvaluationModel.find({}, function (err, result) {
			res.render("pages/TrainingEvaluationTrackerPage", {
				result,
			});
		});
	},
	GetIndividualEvaluationForm: function (req, res) {
		trainingEvaluationModel.findOne(
			{ _id: req.params._id },
			function (err, result) {
				res.render("pages/TrainingEvaluationIndividualPage", {
					evaluation: result,
				});
			}
		);
	},
	TrainingTrackerEmployee: function (req, res) {
		employeeTrackerModel.find(
			{
				status: "Approved",
				"employees.employeeID": req.session._id,
			},
			function (err, trainingNominations) {
				if (trainingNominations.length > 0) {
					res.render("pages/TrainingTrackerPageEmployee", {
						trainingNominations,
					});
				} else {
					res.render("pages/TrainingTrackerPageEmployee");
				}
			}
		);
	},
	CheckEvaluationForm: function (req, res) {
		trainingEvaluationModel.findOne(
			{
				employeeTrackerID: req.params._id,
				"employeeDetails.id": req.session._id,
			},
			function (err, result) {
				if (result) {
					res.render("pages/TrainingEvaluationIndividualPage", {
						evaluation: result,
					});
				} else {
					res.redirect(
						`/GetTrainingDetailsForEvaluationForm/${req.params._id}`
					);
				}
			}
		);
	},
	TrainingNominationForm: function (req, res) {
		// console.log(req.query);
		// console.log(req.params.skill);
		// console.log(req.params._id);
		if (req.query.training_id) {
			trainingNominationModel.findOne(
				{ _id: req.query.training_id },
				function (training_res_error, training_res) {
					if (training_res_error) return console.log(training_res_error);
					// console.log(training_res);
					const query_obj = { ...training_res._doc, ...req.query };
					// console.log(query_obj);
					res.render("pages/Training/TrainingNominationFormPage", {
						skill: req.params.skill,
						id: req.params._id,
						query: query_obj,
					});
				}
			);
		} else {
			// console.log("wth");
			res.render("pages/Training/TrainingNominationFormPage", {
				skill: req.params.skill,
				id: req.params._id,
				query: req.query,
			});
		}
	},
	GetTrainingEvaluations: function (req, res) {
		const {
			businessUnit,
			s_date,
			e_date,
			needed_data_t_nom,
			needed_data_t_eval,
		} = req.query;
		var start = new Date(s_date),
			end = new Date(e_date).setDate(new Date(e_date).getDate() + 1); //date work around to include the exact date (added 1 day)

		trainingNominationModel.find(
			{ businessUnit, updatedDate: { $gte: start, $lte: end } },
			needed_data_t_nom,
			function (errTNomData, tNomData) {
				if (errTNomData) throw errTNomData;
				let tEvalDataFinal = [];
				if (tNomData.length !== 0) {
					let trainingNomIDs = tNomData.map(t => t._id);
					trainingEvaluationModel.find(
						{
							"trainingDetails.id": { $in: trainingNomIDs },
							createdDate: { $gte: start, $lte: end },
						},
						needed_data_t_eval,
						function (errTEvalData, tEvalData) {
							if (errTEvalData) throw errTEvalData;
							tEvalDataFinal = tEvalData;
							// console.log("inside");
							// console.log("tEvalData");
							// console.log(tNomData);
							// console.log("tNomDataFinal");
							// console.log(tEvalDataFinal);
							res.send({ tNomData, tEvalDataFinal });
						}
					);
				} else {
					// console.log("tEvalData");
					// console.log(tNomData);
					// console.log("tNomDataFinal");
					// console.log(tEvalDataFinal);
					res.send({ tNomData, tEvalDataFinal });
				}
			}
		);
	},

	get_training_prescription_page: function (_, res) {
		res.render("pages/Training/TrainingPrescription", {});
	},
	/**
	 * returns an array of goal cycles merged with training data
	 * -called when there is a business unit, department, and position selected in training prescription page
	 */
	get_training_recommendation: function (req, res) {
		const current_date = new Date(Date.now());
		const { bu, dept, pos } = req.query;
		// console.log(bu);
		// console.log(dept);
		// console.log(pos);
		const needed_data_goal_cycles = "trainings performanceRatings listOfCycles";
		let goal_cycle_data = [];

		// get all performance goal cycles
		performanceGoalCycleModel
			.find(
				{
					startDate: { $lt: current_date },
					businessUnit: bu,
					department: dept,
					position: pos,
				},
				needed_data_goal_cycles
			)
			.sort({ startDate: 1 })
			.then(goal_cycles => {
				// check if they have performanceRatings and trainings
				goal_cycles.forEach(cycle => {
					if (
						cycle.trainings.length > 0 &&
						cycle.performanceRatings.length > 0
					) {
						goal_cycle_data.push(cycle);
						// console.log(cycle);
					}
				});

				// put training ids in a list
				let list_of_training_ids = [];
				goal_cycle_data.forEach(cycle => {
					cycle.trainings.forEach((c_training, training_index) => {
						if (training_index !== 0 && c_training != null) {
							c_training.kpi_list = "";
							c_training.forEach(id => list_of_training_ids.push(id));
						}
					});
				});

				console.log("list_of_training_ids", list_of_training_ids);
				// get training kpi list of trainings present in the list_of_training_ids
				const needed_data_training_nom = "kpi_list";
				const needed_data_emp_tracker = "employees trainingDetails";
				trainingNominationModel.find(
					{ _id: { $in: list_of_training_ids } },
					needed_data_training_nom,
					function (trainings_res_err, trainings_res) {
						if (trainings_res_err) throw trainings_res_err;
						// get attendance of employees
						employeeTrackerModel.find(
							{
								"trainingDetails.id": { $in: list_of_training_ids },
							},
							needed_data_emp_tracker,
							function (emp_tracker_res_err, emp_tracker_res) {
								if (emp_tracker_res_err) throw emp_tracker_res_err;
								// loop through every goal cycle instance
								goal_cycle_data.forEach((c, c_index) => {
									console.log("c");
									console.log(c);
									const trainings_mod = [];
									// loop through every training array of the current goal cycle instance 'c'
									c.trainings.forEach((c_training, c_training_index) => {
										console.log("c_training_index", c_training_index);
										console.log("c_training", c_training);
										if (
											c_training_index === 0 ||
											c_training == null ||
											c_training_index === c.performanceRatings.length
										)
											trainings_mod.push(null);
										else {
											// loop through each training id
											c_training.forEach((tra_id, tra_id_index) => {
												// loop through each employee tracker instance
												emp_tracker_res.forEach(
													(track_item, track_item_index) => {
														// loop through every training nomination
														trainings_res.forEach(training_nom => {
															let training_element = { employees: [] };
															console.log(training_nom._id.toString());
															console.log(tra_id.toString());
															console.log(
																track_item.trainingDetails.id.toString()
															);
															if (
																training_nom._id.toString() ===
																	tra_id.toString() &&
																tra_id.toString() ===
																	track_item.trainingDetails.id.toString()
															) {
																// console.log(
																// 	c.performanceRatings[c_training_index]
																// );
																// console.log(c_training_index);
																// loop through employees of the same cycle as the training

																if(c.performanceRatings[
																	c_training_index
																] !== undefined){
																	c.performanceRatings[
																		c_training_index
																	].employees.forEach(per_emp => {
																		// loop through employees of the same emp tracker
																		track_item.employees.forEach(t_emp => {
																			if (
																				per_emp.userId.toString() ===
																					t_emp.employeeID.toString() &&
																				(t_emp.attendance == "Present" ||
																					t_emp.attendance == "Late")
																			) {
																				training_element.employees.push(
																					per_emp.userId.toString()
																				);
																			}
																		});
																	});

																}
																

																// remove duplicates
																training_element.employees = [
																	...new Set(training_element.employees),
																];
																training_element = {
																	...training_element,
																	_id: training_nom._id.toString(),
																	kpi_list: training_nom.kpi_list,
																};
																if (trainings_mod[c_training_index] == null) {
																	trainings_mod[c_training_index] = [];
																}
																// console.log("training_element");
																// console.log(training_element);
																trainings_mod[c_training_index].push(
																	training_element
																);
															}
														});
													}
												);
											});
										}
									});
									let new_cycle = {
										...goal_cycle_data[c_index]._doc,
										trainings_mod,
									};

									// console.log(new_cycle);
									goal_cycle_data[c_index] = new_cycle;
								});

								res.send(goal_cycle_data);
							}
						);
					}
				);
			})
			.catch(goal_cycles_error => res.send(goal_cycles_error));
	},
	// test
	// update_date: function (req, res) {
	// 	const { trainingID, updatedDate } = req.body;
	// 	console.log(trainingID);
	// 	console.log(updatedDate);
	// 	trainingNominationModel
	// 		.updateOne({ trainingID }, { $set: {} })
	// 		.then(resp => {
	// 			console.log("resp", resp);
	// 			res.send(resp);
	// 		});
	// },
	// end test
	/**
	 * returns list of kpi's of performance goal cycles matching filter and has already started
	 */
	get_kpi_list: function (req, res) {
		const current_date = new Date(Date.now());
		const { bu, dept, pos } = req.query;

		const needed_data_goal_cycles = "trainings performanceRatings listOfCycles";
		let goal_cycle_data = [];
		// var curDate = new Date(Date.now());
		// const training_id_test = "62a33ca2977cedb904ba119a";

		// get all performance goal cycles
		performanceGoalCycleModel
			.find(
				{
					startDate: { $lt: current_date },
					businessUnit: bu,
					department: dept,
					position: pos,
				},
				needed_data_goal_cycles
			)
			.sort({ startDate: 1 })
			.then(goal_cycles => {
				// check if they have performanceRatings and trainings
				goal_cycles.forEach(cycle => {
					if (
						cycle.trainings.length > 0 &&
						cycle.performanceRatings.length > 0
					) {
						goal_cycle_data.push(cycle.listOfCycles);
					}
				});
				// console.log(goal_cycle_data);
				res.send(goal_cycle_data);
			})
			.catch(goal_cycles_error => res.send(goal_cycles_error));
		// console.log(goal_cycle_data);
	},
	get_trainings: function (req, res) {
		const { id_list, needed_data } = req.query;
		// console.log(id_list);
		// console.log(needed_data);
		trainingNominationModel.find(
			{ _id: { $in: id_list } },
			needed_data,
			function (err, data) {
				if (err) return console.log("Error: ", err);
				res.send(data);
			}
		);
	},
};

module.exports = TrainingNominationsController;

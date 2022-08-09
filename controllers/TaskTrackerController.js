const notificationModel = require("../models/notificationModel");
const { ObjectId } = require("bson");
const PRFModel = require("../models/PRFModel");
const applicationsModel = require("../models/applicationsModel");
const employeeActionFormModel = require("../models/employeeActionFormModel");
const offboardingModel = require("../models/offboardingModel");
const exitSurveyModel = require("../models/exitSurveyModel");
const perfoGoalCycleModel = require("../models/performance/perfoGoalCycleModel");
const perfoAppraisalModel = require("../models/performance/perfoAppraisalModel");
const perfoReviewModel = require("../models/performance/perfoReviewModel");
const skillSetupModel = require("../models/skillSetupModel");
const skillAssessmentModel = require("../models/skillAssessmentModel");
const trainingNominationModel = require("../models/trainingNominationModel");
const employeeTrackerModel = require("../models/employeeTrackerModel");
const trainingEvaluationModel = require("../models/trainingEvaluationModel");
const userModel = require("../models/userModel");

// const longDateFormat = {
// 	weekday: "long",
// 	year: "numeric",
// 	month: "long",
// 	day: "numeric",
// };

/**
 * Returns a promise of all notifications of the user
 * @returns {Promise}
 */
async function getUserNotifications(user_id) {
	var user_id = user_id;

	return new Promise((resolve, reject) => {
		notificationModel.find(
			{ "receiver._id": ObjectId(user_id) },
			null,
			{ sort: { date: 1 } },
			function (err, notificationsResult) {
				// resolve(notificationsResult.reverse());

				var notifDateFilteredResult = [];

				for (i = 0; i <= notificationsResult.length; i++) {
					if (i == notificationsResult.length) {
						// console.log
						resolve(notifDateFilteredResult);
					} else {
						if (new Date(Date.now()) >= new Date(notificationsResult[i].date)) {
							notifDateFilteredResult.push(notificationsResult[i]);
						}
					}
				}
			}
		);
	});
}

/**
 *     Groups notifications by referenceType
 *     @params  {unfilteredNotifs} all notifs in 1 array
 *
 *     @returns {notifs} object containing objects with arrays of notifs.
 *                  eg.
 *                  NotifsByType.application = notifs with "application" as the referenceType
 *                  NotifsByType.PRF = notifs with "PRF" as the referenceType
 */
async function filterNotifsByType(unfilteredNotifs) {
	return new Promise((resolve, reject) => {
		/**
		 * Initialize objects to return/resolve
		 *  add for all that needs to be filtered.
		 */
		var notifs = new Object();
		notifs.application = [];
		notifs.prf = [];
		notifs.offboarding = [];
		notifs.performance_management = [];
		notifs.training = [];
		notifs.not_tasks = [];

		for (let i = 0; i <= unfilteredNotifs.length; i++) {
			// console.log(i);
			if (i == unfilteredNotifs.length) {
				resolve(notifs);
			} else {
				let referenceType = unfilteredNotifs[i].referenceType;
				switch (referenceType) {
					case "Application":
						notifs.application.push(unfilteredNotifs[i]);
						break;
					case "PRF":
						notifs.prf.push(unfilteredNotifs[i]);
						break;

					case "Offboarding":
						notifs.offboarding.push(unfilteredNotifs[i]);
						break;
					case "OffboardingApproval":
						// offboarding pa rin
						notifs.offboarding.push(unfilteredNotifs[i]);
						break;
					case "ExitSurveyForm":
						// offboarding pa rin
						notifs.offboarding.push(unfilteredNotifs[i]);
						break;

					case "Performance Appraisal":
						notifs.performance_management.push(unfilteredNotifs[i]);
						break;
					case "Performance Appraisal Answered":
						// Performance Management pa rin
						notifs.performance_management.push(unfilteredNotifs[i]);
						break;
					case "Set Cycle and Goals":
						// Performance Management pa rin
						notifs.performance_management.push(unfilteredNotifs[i]);
						break;

					case "Answer Assessment Form Employee":
						notifs.training.push(unfilteredNotifs[i]);
						break;
					case "Set Skill Setup":
						// training pa rin
						notifs.training.push(unfilteredNotifs[i]);
						break;
					case "All Assessments Answered":
						// training pa rin
						notifs.training.push(unfilteredNotifs[i]);
						break;
					case "TNF":
						// training pa rin
						notifs.training.push(unfilteredNotifs[i]);
						break;
					case "Training Schedule HRSpecialist":
						// training pa rin  used in confirm attendance notif to hr specialist
						notifs.training.push(unfilteredNotifs[i]);
						break;
					case "Training Schedule":
						// training pa rin  used in confirm attendance notif to hr specialist
						notifs.training.push(unfilteredNotifs[i]);
						break;
					case "Answer Training Evaluation":
						// training pa rin  used in answer training eval by employee
						notifs.training.push(unfilteredNotifs[i]);
						break;
					case "Create a Training":
						// training pa rin
						notifs.training.push(unfilteredNotifs[i]);
						break;

					default:
						// console.log(unfilteredNotifs[i]);
						notifs.not_tasks.push(unfilteredNotifs[i]);
				}
			}
		}
	});
}

/**
 * returns priority level
 * time difference
 *  !! TODO: Establish time difference per priority level
 *
 * @param {*} deadline this is the deadline
 * @returns
 */
function prioritizer(dl) {
	var deadline = dl;
	var curDate = new Date();

	var timeDif = deadline.getTime() - curDate.getTime();
	var daysDif = timeDif / 1000 / 60 / 60 / 24;
	var priortyLevel;

	if (daysDif < 0) {
		priortyLevel = "Overdue";
	} else if (daysDif <= 7) {
		priortyLevel = "High";
	} else if (daysDif <= 14) {
		priortyLevel = "Medium";
	} else if (daysDif <= 30) {
		priortyLevel = "Normal";
	} else if (daysDif > 30) {
		priortyLevel = "Low";
	}

	return priortyLevel;
}

/**
 * returns a date that is reference date - number of days
 *
 * @param {*} reference_date
 * @param {*} days
 * @returns
 */
function generateDeadline_DaysBefore(reference_date, days) {
	var date = reference_date.getTime();
	var deadline = date - days * 1000 * 60 * 60 * 24;
	return new Date(deadline);
}

/**
 * returns a date that is reference date + number of days
 *
 * @param {*} reference_date
 * @param {*} days
 * @returns date
 */
function generateDeadline_DaysAfter(reference_date, days) {
	var date = reference_date.getTime();
	var deadline = date + days * 1000 * 60 * 60 * 24;
	return new Date(deadline);
}

async function process_PRF(arrNotif, notifs_request) {
	return new Promise(async (resolve, reject) => {
		// code here

		var tasks_PRF = [];
		var userID, position, requisitionID, task;

		// console.log(arrNotif);

		// const arrRequisitionID = arrNotif.map(function (notif) {
		// 	return notif.reference.requisitionID;
		// });

		const getTaskRowData = async (userID, position, requisitionID, task) =>
			new Promise((resolve, reject) => {
				// setTimeout(()=> {resolve(`${userID} - ${position} - ${requisitionID} - ${task}`) ;}, 2000);

				let taskData = {
					type: "PRF",
					task,
				};

				PRFModel.findOne({ requisitionID: requisitionID }).then(PRF_data => {
					if (PRF_data == null) {
						resolve(false);
					} else {
						let a_DHead = PRF_data.approvalDHead;
						let a_HRPartner = PRF_data.approvalHRPartner;
						let a_BUHead = PRF_data.approvalBUHead;
						let a_CHRODDirector = PRF_data.approvalCHRODDirector;
						let a_CHRODHead = PRF_data.approvalCHRODHead;
						let PRF_status = PRF_data.status;
						let HR_Partner_pos = [
							"HR Assistant Manager",
							"HR Officer",
							"HR Supervisor",
							"HR Specialist",
						];

						taskData.deadline = PRF_data.targetStartDate.toLocaleTimeString(
							"en-US",
							{ month: "short", year: "numeric", day: "numeric", hour12: true }
						);
						taskData.deadlineISO = PRF_data.targetStartDate;
						taskData.priority = prioritizer(PRF_data.targetStartDate);
						taskData.link = `/PRFTracker/${requisitionID}`;

						switch (task) {
							case "Approval":
								taskData.description = `Approval needed for PRF #${requisitionID}`;

								if (PRF_status == "For Approval") {
									if (position == "Department Head") {
										if (a_DHead.approver._id.toString() == userID.toString()) {
											if (a_DHead.approval != "Pending") {
												taskData.isCompleted = "Completed";
											} else {
												taskData.isCompleted = "Not Started";
											}
										} else if (
											a_CHRODHead.approver._id.toString() == userID.toString()
										) {
											if (a_CHRODHead.approval != "Pending") {
												taskData.isCompleted = "Completed";
											} else {
												taskData.isCompleted = "Not Started";
											}
										}
									}
									// if HR Partner position is logged in && their approval is not "Approved"
									else if (HR_Partner_pos.indexOf(position) != -1) {
										if (a_HRPartner.approval != "Pending")
											taskData.isCompleted = "Completed";
										else taskData.isCompleted = "Not Started";
									}
									// if HR Partner position is logged in && their approval is not "Approved"
									else if (position == "Business Unit Head") {
										if (a_BUHead.approval != "Pending")
											taskData.isCompleted = "Completed";
										else taskData.isCompleted = "Not Started";
									} else if (position == "Department Director") {
										if (a_CHRODDirector.approval != "Pending")
											taskData.isCompleted = "Completed";
										else taskData.isCompleted = "Not Started";
									} else {
										taskData.isCompleted = "not yet coded";
									}
								} else {
									// Completed == true if status is not "For Approval" regardless of their approval
									// this is when someone disapproves already but another havent responded yet.
									taskData.isCompleted = "Completed";
								}

								resolve(taskData);
								break;

							case "List Job Vacancy":
								taskData.description = `List job vacancy for PRF #${requisitionID}`;
								if (PRF_status == "Approved")
									taskData.isCompleted = "Not Started";
								else taskData.isCompleted = "Completed";

								resolve(taskData);
								break;

							default:
								taskData.description =
									"Notif Data not updated! must include {task} when creating a notification.";

								// resolve(taskData);
								resolve(false);
								break;
						}
					}
				});
			});
		// console.log(arrRequisitionID);
		// console.log("arrNotif.length : " + arrNotif.length);

		var processed_indiv_PRF;
		for (let i = 0; i <= arrNotif.length; i++) {
			if (i == arrNotif.length) {
				resolve(tasks_PRF);
			} else if (i < arrNotif.length) {
				userID = arrNotif[i].receiver._id;
				position = arrNotif[i].receiver.position;
				requisitionID = arrNotif[i].reference.requisitionID;
				task = arrNotif[i].task;

				// console.log(i)
				// console.log(`${userID} - ${position} - ${requisitionID} - ${task} -`)
				processed_indiv_PRF = await getTaskRowData(
					userID,
					position,
					requisitionID,
					task
				);
				// console.log(processed_indiv_PRF);

				// if not false, as false means that the notification should not appear in task list.
				if (processed_indiv_PRF != false) {
					const obj_to_be_pushed = notifs_request
						? {
								deadlineISO: processed_indiv_PRF.deadlineISO,
								isCompleted: processed_indiv_PRF.isCompleted,
								...arrNotif[i],
						  }
						: processed_indiv_PRF;

					tasks_PRF.push(obj_to_be_pushed);
				}
			}
		}
	});
}

async function process_application(arrNotif, notifs_request) {
	return new Promise(async (resolve, reject) => {
		// code here
		// setTimeout(()=>{resolve("process_offboarding resolve");}, 2000)
		var tasks_application = [];
		var userID, position, applicationID, task;

		// const arrApplicationID = arrNotif.map(function (notif) {
		// 	return notif.reference._id;
		// });

		const getTaskRowData = async (userID, position, applicationID, task) =>
			new Promise((resolve, reject) => {
				let taskData = {
					type: "Recruitment",
					task,
				};

				const getPRF = async requisitionID => {
					return new Promise((resolve, reject) => {
						PRFModel.findOne(
							{ requisitionID: requisitionID },
							function (err, result) {
								resolve(result);
							}
						);
					});
				};

				const getEAF = async applicationID => {
					return new Promise((resolve, reject) => {
						employeeActionFormModel.findOne(
							{ applicationID_reference: applicationID },
							function (err, result) {
								resolve(result);
							}
						);
					});
				};

				applicationsModel
					.findOne({ _id: applicationID })
					.then(async application_data => {
						var requisition_id = application_data.requisition_id;
						var applicantName = `${application_data.user.firstName} ${application_data.user.lastName}`;
						var PRF_Data = await getPRF(requisition_id);
						// console.log("PRF_Data");
						// console.log(PRF_Data);
						var applicationDate = application_data.applicationDate;
						var PRF_targetStartDate = PRF_Data.targetStartDate;
						var PRF_status = PRF_Data.status;

						taskData.link = `/ApplicantApproval/${applicationID}`;

						switch (task) {
							case "Schedule Initial Interview":
								let sched_initial_deadline = generateDeadline_DaysBefore(
									PRF_targetStartDate,
									10
								);

								taskData.description = `Schedule Initial Interview for applicant ${applicantName}.`;
								taskData.deadline = sched_initial_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = sched_initial_deadline;
								taskData.priority = prioritizer(sched_initial_deadline);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approval1stInterview == null &&
										  application_data.finalApproval == null &&
										  application_data.approval2ndInterview == null &&
										  application_data.approval3rdInterview == null
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;

							case "Evaluate Initial Interview":
								let initalInterview_date =
									application_data.initialInterviewSchedule.date;
								taskData.description = `Conduct & evaluate Initial Interview for applicant ${applicantName} scheduled on ${initalInterview_date.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								)}.`;
								taskData.deadline = initalInterview_date.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = initalInterview_date;
								taskData.priority = prioritizer(initalInterview_date);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approval1stInterview ==
										  "Interview Scheduled"
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;

							case "Schedule Functional Interview":
								let sched_functional_deadline = generateDeadline_DaysBefore(
									PRF_targetStartDate,
									7
								);
								taskData.description = `Schedule Functional Interview for applicant ${applicantName}.`;
								taskData.deadline =
									sched_functional_deadline.toLocaleTimeString("en-US", {
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									});
								taskData.deadlineISO = sched_functional_deadline;
								taskData.priority = prioritizer(sched_functional_deadline);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approval2ndInterview == null &&
										  application_data.approval3rdInterview == null &&
										  application_data.finalApproval == null
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;

							case "Evaluate Functional Interview":
								let functionalInterview_date =
									application_data.functionalInterviewSchedule.date;
								taskData.description = `Conduct & evaluate Functional Interview for applicant ${applicantName} scheduled on ${functionalInterview_date.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								)}.`;
								taskData.deadline = functionalInterview_date.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = functionalInterview_date;
								taskData.priority = prioritizer(functionalInterview_date);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approval2ndInterview ==
												"Interview Scheduled" &&
										  application_data.finalApproval == null
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;

							case "Schedule Final Interview":
								let sched_final_interview = generateDeadline_DaysBefore(
									PRF_targetStartDate,
									7
								);

								taskData.description = `Schedule Final Interview for applicant ${applicantName}.`;
								taskData.deadline = sched_final_interview.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = sched_final_interview;
								taskData.priority = prioritizer(sched_final_interview);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approval3rdInterview == null &&
										  application_data.finalApproval == null
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;

							case "Evaluate Final Interview":
								let finalInterview_date =
									application_data.finalInterviewSchedule.date;
								taskData.description = `Conduct & evaluate Final Interview for applicant ${applicantName} scheduled on ${finalInterview_date.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								)}.`;
								taskData.deadline = finalInterview_date.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = finalInterview_date;
								taskData.priority = prioritizer(finalInterview_date);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approval3rdInterview ==
												"Interview Scheduled" &&
										  application_data.finalApproval == null
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;

							case "Submit For Final Approval":
								let deadline_submitForFinalApproval =
									generateDeadline_DaysBefore(PRF_targetStartDate, 7);
								taskData.description = `Submit summary of application of applicant ${applicantName} to the department head for final approval.`;
								taskData.deadline =
									deadline_submitForFinalApproval.toLocaleTimeString("en-US", {
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									});
								taskData.deadlineISO = deadline_submitForFinalApproval;
								taskData.priority = prioritizer(
									deadline_submitForFinalApproval
								);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approvalFinal == null
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;
							case "Final Approval":
								let deadline_FinalApproval = generateDeadline_DaysBefore(
									PRF_targetStartDate,
									5
								);
								taskData.description = `Submit final approval for applicant ${applicantName}`;
								taskData.deadline = deadline_FinalApproval.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = deadline_FinalApproval;
								taskData.priority = prioritizer(deadline_FinalApproval);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Pending"
										? application_data.approvalFinal == "Pending"
											? "Not Started"
											: "Completed"
										: "Completed";

								resolve(taskData);
								break;
							case "Prepare Employee Action Form":
								let deadline_EAF = generateDeadline_DaysBefore(
									PRF_targetStartDate,
									3
								);
								taskData.description = `Prepare Employee Action Form (EAF) for applicant ${applicantName}`;
								taskData.deadline = deadline_EAF.toLocaleTimeString("en-US", {
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								});
								taskData.deadlineISO = deadline_EAF;
								taskData.priority = prioritizer(deadline_EAF);
								taskData.isCompleted =
									PRF_status == "Open" && application_data.status == "Approved"
										? "Not Started"
										: "Completed";

								resolve(taskData);
								break;

							case "Confirm Application":
								let get_EAF_data_confirm = await getEAF(applicationID);
								let deadline_confirmApp = get_EAF_data_confirm.effectiveDate;
								taskData.description = `Update pre-employee requirements and complete application of applicant ${applicantName}`;
								taskData.deadline = deadline_confirmApp.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = deadline_confirmApp;
								taskData.priority = prioritizer(deadline_confirmApp);
								taskData.isCompleted =
									PRF_status == "Open" &&
									(application_data.status ==
										"Pre-Employment Requirements Pending" ||
										application_data.status ==
											"Pre-Employment Requirements Received")
										? "Not Started"
										: "Completed";

								resolve(taskData);
								break;

							case "Submit Pre-employment Requirements":
								let get_EAF_data_submit_pre = await getEAF(applicationID);
								let deadline_submit_pre = get_EAF_data_submit_pre.effectiveDate;
								taskData.description = `Submit pre-employee requirements for your application.`;
								taskData.deadline = deadline_submit_pre.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = deadline_submit_pre;
								taskData.priority = prioritizer(deadline_submit_pre);
								taskData.isCompleted =
									PRF_status == "Open" &&
									application_data.status ==
										"Pre-Employment Requirements Pending"
										? "Not Started"
										: "Completed";

								resolve(taskData);
								break;

							default:
								taskData.description =
									"Notif Data not updated! must include {task} when creating a notification.";

								// resolve(taskData);
								resolve(false);
								break;
						}
					});
			});

		// console.log("arrNotif.length : " + arrNotif.length);

		var processed_indiv_application;
		for (let i = 0; i <= arrNotif.length; i++) {
			if (i == arrNotif.length) {
				// console.log("tasks_application");
				// console.log(tasks_application);
				resolve(tasks_application);
			} else if (i < arrNotif.length) {
				userID = arrNotif[i].receiver._id;
				position = arrNotif[i].receiver.position;
				applicationID = arrNotif[i].reference._id;
				task = arrNotif[i].task;

				// console.log(i);
				// console.log(`${userID} - ${applicationID} - ${task} -`);
				processed_indiv_application = await getTaskRowData(
					userID,
					position,
					applicationID,
					task
				);
				// console.log(processed_indiv_application);

				// if not false, as false means that the notification should not appear in task list.
				if (processed_indiv_application != false) {
					const obj_to_be_pushed = notifs_request
						? {
								deadlineISO: processed_indiv_application.deadlineISO,
								isCompleted: processed_indiv_application.isCompleted,
								...arrNotif[i],
						  }
						: processed_indiv_application;

					tasks_application.push(obj_to_be_pushed);
				}
			}
		}
	});
}

async function process_offboarding(arrNotif, notifs_request) {
	return new Promise(async (resolve, reject) => {
		// code here
		var tasks_offboarding = [];
		var userID, position, offboardingID, task;

		const getTaskRowData = async (
			userID,
			position,
			user_name,
			offboardingID,
			task
		) =>
			new Promise((resolve, reject) => {
				let taskData = {};
				taskData.type = "Offboarding";
				taskData.task = task;
				taskData.link = `/OffboardingTracker/${offboardingID}`;

				const isCompleted_addClearanceAccountabilities = async (
					offboarding_data,
					user_name
				) => {
					return new Promise((resolve, reject) => {
						let isCompleted = "Not Started"; //by default

						for (
							let i = 0;
							i <= offboarding_data.accountabilities.length;
							i++
						) {
							if (i == offboarding_data.accountabilities.length) {
								resolve(isCompleted);
							} else {
								if (
									offboarding_data.accountabilities[i].approver == user_name &&
									offboarding_data.accountabilities[i].submitted == "Submitted"
								) {
									isCompleted = "Completed";
								}
							}
						}
					});
				};

				const isCompleted_approveOffboarding = async (
					offboarding_data,
					userID
				) => {
					return new Promise((resolve, reject) => {
						let isCompleted = "Not Started"; //by default

						// checks if they already approved/disapproved.
						if (
							(offboarding_data.approvalHR.approver._id.toString() ==
								userID.toString() &&
								offboarding_data.approvalHR.approval != "Pending") ||
							offboarding_data.status == "Closed"
						) {
							isCompleted = "Completed";
						} else if (
							(offboarding_data.approvalBUHead.approver._id.toString() ==
								userID.toString() &&
								offboarding_data.approvalBUHead.approval != "Pending") ||
							offboarding_data.status == "Closed"
						) {
							isCompleted = "Completed";
						} else if (
							(offboarding_data.approvalCHRODDirector.approver._id.toString() ==
								userID.toString() &&
								offboarding_data.approvalCHRODDirector.approval != "Pending") ||
							offboarding_data.status == "Closed"
						) {
							isCompleted = "Completed";
						}
						resolve(isCompleted);
					});
				};

				const isCompleted_answerExitSurveyForm = async _id => {
					return new Promise((resolve, reject) => {
						let isCompleted = "Not Started"; //by default

						exitSurveyModel.findOne(
							{ offboardingId: _id.toString() },
							function (err, result) {
								if (result != null) {
									isCompleted = "Completed";
								}
								resolve(isCompleted);
							}
						);
					});
				};

				const isCompleted_submitEAF = async _id => {
					return new Promise((resolve, reject) => {
						let isCompleted = "Not Started"; //by default

						// applicationID_reference ginamit pero offboarding talaga ito.
						// bec dyaan nilagay sa backend ahu
						employeeActionFormModel.findOne(
							{ applicationID_reference: _id.toString() },
							function (err, result) {
								if (result != null) {
									isCompleted = "Completed";
								}
								resolve(isCompleted);
							}
						);
					});
				};

				const isCompleted_clearAccountabilities = async _id => {
					return new Promise((resolve, reject) => {
						let isCompleted = "Not Started"; //by default
						offboardingModel.findOne({ _id: _id }, function (err, result) {
							/**
							 * checks if all 5 submitted na since "Submitted" indicates that
							 * the accountabilities are all cleared na for that department
							 */
							var countSubmitted = 0;
							for (let i = 0; i <= result.accountabilities.length; i++) {
								if (i == result.accountabilities.length) {
									if (
										countSubmitted == 4 &&
										result.accountabilities.length == 4
									) {
										isCompleted = "Completed";
									} else if (
										result.accountabilities.length == 5 &&
										countSubmitted == 5
									) {
										isCompleted = "Completed";
									}

									resolve(isCompleted);
								} else {
									if (result.accountabilities[i].submitted == "Submitted") {
										countSubmitted++;
									}
								}
							}
						});
					});
				};

				offboardingModel
					.findOne({ _id: offboardingID })
					.then(async offboarding_data => {
						// console.log(offboarding_data);
						let requestDate = offboarding_data.requestDate;
						let effectiveDate = offboarding_data.effectiveDate;
						let clearanceApproval = offboarding_data.clearanceApproval;
						let status = offboarding_data.status;
						let offboarding_name = offboarding_data.name;
						let offboarding_businessUnit = offboarding_data.businessUnit;
						let offboarding_id = offboarding_data._id;

						var computed_deadline;
						switch (task) {
							case "Approve Clearance Form":
								// deadline is 7 days after request date
								computed_deadline = generateDeadline_DaysAfter(requestDate, 7);
								taskData.description = `Approve clearance form of ${offboarding_name} from ${offboarding_businessUnit}.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted =
									clearanceApproval == false &&
									status != "Closed" &&
									status != "Disapproved"
										? "Not Started"
										: "Completed";

								resolve(taskData);
								break;
							case "Add Clearance Accountabilities":
								computed_deadline = generateDeadline_DaysAfter(requestDate, 14);
								taskData.description = `Add clearance accountabilities for ${offboarding_name} from ${offboarding_businessUnit}.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted =
									await isCompleted_addClearanceAccountabilities(
										offboarding_data,
										user_name
									);
								taskData.link = `/ClearanceAccountabilityForm/${offboardingID}`;

								resolve(taskData);
								break;
							case "Approve Offboarding":
								computed_deadline = generateDeadline_DaysAfter(requestDate, 14);
								taskData.description = `Approve Offboarding for ${offboarding_name} from ${offboarding_businessUnit}.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted = await isCompleted_approveOffboarding(
									offboarding_data,
									userID
								);

								resolve(taskData);
								break;
							case "Schedule Interview":
								computed_deadline = generateDeadline_DaysBefore(
									effectiveDate,
									7
								);
								taskData.description = `Schedule exit interview for ${offboarding_name} from ${offboarding_businessUnit}.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted =
									offboarding_data.interview.status === undefined
										? "Not Started"
										: "Completed";

								resolve(taskData);
								break;
							case "Conduct Exit Interview":
								computed_deadline = offboarding_data.interview.date;
								taskData.description = `Conduct exit interview for ${offboarding_name} from ${offboarding_businessUnit}  scheduled on ${computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								)}.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted =
									offboarding_data.interview.status == "Pending"
										? "Not Started"
										: "Completed";

								resolve(taskData);
								break;
							case "Join Exit Interview":
								computed_deadline = offboarding_data.interview.date;
								taskData.description = `Attend exit interview  scheduled on ${computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								)}.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted =
									offboarding_data.interview.status == "Pending"
										? "Not Started"
										: "Completed";

								resolve(taskData);
								break;
							case "Answer Exit Survey Form":
								computed_deadline = effectiveDate;
								taskData.description = `Please answer the exit survey form.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.link = `/EmployeeExitSurveyForm/${offboarding_id}`;
								taskData.isCompleted = await isCompleted_answerExitSurveyForm(
									offboarding_data._id
								);

								resolve(taskData);
								break;
							case "Submit Employee Action Form":
								computed_deadline = effectiveDate;
								taskData.description = `Submit employee action form for ${offboarding_name} from ${offboarding_businessUnit}.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted = await isCompleted_submitEAF(
									offboarding_data._id
								);

								resolve(taskData);
								break;
							case "Clear Accountabilities":
								// computed_deadline = effectiveDate;
								computed_deadline = generateDeadline_DaysAfter(requestDate, 14);
								taskData.description = `Please clear your accountabilities for offboarding.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted = await isCompleted_clearAccountabilities(
									offboarding_data._id
								);

								resolve(taskData);
								break;
							default:
								taskData.description =
									"Notif Data not updated! must include {task} when creating a notification.";

								// resolve(taskData);
								resolve(false);
								break;
						}
					});
			});

		var processed_indiv_offboarding;
		for (let i = 0; i <= arrNotif.length; i++) {
			if (i == arrNotif.length) {
				// console.log("tasks_offboarding");
				// console.log(tasks_offboarding);
				resolve(tasks_offboarding);
			} else if (i < arrNotif.length) {
				userID = arrNotif[i].receiver._id;
				user_name = `${arrNotif[i].receiver.firstName} ${arrNotif[i].receiver.lastName}`;
				position = arrNotif[i].receiver.position;
				offboardingID = arrNotif[i].reference._id;
				task = arrNotif[i].task;

				// console.log(i);
				// console.log(`${userID} - ${offboardingID} - ${task} -`)
				processed_indiv_offboarding = await getTaskRowData(
					userID,
					position,
					user_name,
					offboardingID,
					task
				);
				// console.log(processed_indiv_offboarding);

				// if not false, as false means that the notification should not appear in task list.
				if (processed_indiv_offboarding != false) {
					const obj_to_be_pushed = notifs_request
						? {
								deadlineISO: processed_indiv_offboarding.deadlineISO,
								isCompleted: processed_indiv_offboarding.isCompleted,
								...arrNotif[i],
						  }
						: processed_indiv_offboarding;

					tasks_offboarding.push(obj_to_be_pushed);
				}
			}
		}
	});
}

async function process_performance_management(arrNotif, notifs_request) {
	return new Promise(async (resolve, reject) => {
		// code here
		var tasks_performance_management = [];
		var userID, position, perfoCycle_id, task, notifDate;

		const getTaskRowData = async (
			userID,
			perfoCycle_id,
			task,
			notifDate,
			notif
		) =>
			new Promise((resolve, reject) => {
				let taskData = {
					type: "Performance Management",
					task,
				};

				let curCycle_startDate = new Date(notifDate);

				const isCompleted_answerPerformanceAppraisal = async (
					userID,
					perfoCycle_id,
					curCycle_startDate
				) => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";
						perfoAppraisalModel.findOne(
							{
								userId: userID,
								cycleId: perfoCycle_id,
								cycleDate: curCycle_startDate,
							},
							function (err, data) {
								if (data != null) {
									isCompleted = "Completed";
								}
								resolve(isCompleted);
							}
						);
					});
				};

				const getPerformanceAppraisal = async (
					userID,
					perfoCycle_id,
					curCycle_startDate
				) => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";
						perfoAppraisalModel.findOne(
							{
								userId: userID,
								cycleId: perfoCycle_id,
								cycleDate: curCycle_startDate,
							},
							function (err, data) {
								if (data != null) {
									isCompleted = "Completed";
								}
								resolve(isCompleted);
							}
						);
					});
				};

				const isCompleted_answerPerformanceReview = async appraisalId => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";
						perfoReviewModel.findOne(
							{ appraisalId: appraisalId },
							function (err, data) {
								if (data != null) {
									isCompleted = "Completed";
								}
								resolve(isCompleted);
							}
						);
					});
				};

				const isCompleted_setCycleAndGoals = async reference_goalcycle => {
					// checks if theres a set goal cycle after the last cycle of the reference goal cycle.
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";
						var position = reference_goalcycle.position;
						var isStartDateBeforeExpireDate = false;

						perfoGoalCycleModel.find(
							{ position: position },
							function (err, goalCycleData) {
								if (err) throw err;

								var startDate;

								for (i = 0; i < goalCycleData.length; i++) {
									var dateIndex = goalCycleData[i].dates.length - 1;
									var lastDate = goalCycleData[i].dates[dateIndex];
									startDate = new Date(
										goalCycleData[i].dates[dateIndex].getTime() + 1
									);
									if (startDate.getTime() < lastDate.getTime()) {
										index = i;
										isStartDateBeforeExpireDate = true;
									}
								}

								if (isStartDateBeforeExpireDate == true) {
									isCompleted = "Completed";
								}
								resolve(isCompleted);
							}
						);
					});
				};
				perfoGoalCycleModel
					.findOne({ _id: perfoCycle_id })
					.then(async goalCycleList_data => {
						var perfoAppraisal_id;

						var computed_deadline;
						switch (task) {
							case "Answer Performance Appraisal":
								// 30 days after start of cycle / notifDate
								computed_deadline = generateDeadline_DaysAfter(
									curCycle_startDate,
									30
								);
								taskData.description = `Please answer performance appraisal form.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted =
									await isCompleted_answerPerformanceAppraisal(
										userID,
										perfoCycle_id,
										curCycle_startDate
									);
								taskData.link = `/PerformanceAppraisalForm/${perfoCycle_id}/${notifDate}`;

								resolve(taskData);
								break;
							case "Submit Performance Review":
								// 30 days after start of cycle / notifDate
								computed_deadline = generateDeadline_DaysAfter(
									new Date(notif.reference.submissionDate),
									14
								);
								taskData.description = `${notif.description}`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted =
									await isCompleted_answerPerformanceReview(
										notif.reference._id
									);
								taskData.link = `/PerformanceAppraisalIndividual/${perfoCycle_id}/${notif.reference._id}`;

								resolve(taskData);
								break;
							case "Set Cycle and Goals":
								// 1 days after start of cycle / notifDate
								computed_deadline = generateDeadline_DaysAfter(
									new Date(notif.date),
									1
								);
								taskData.description = `Current goals and cycle for the ${
									notif.reference.position
								} position will end on ${notif.date.toLocaleDateString(
									"en-US",
									{ month: "short", year: "numeric", day: "numeric" }
								)}. Set new goals and cycle by then.`;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted = await isCompleted_setCycleAndGoals(
									notif.reference
								);
								taskData.link = `/PerformanceSetGoalsCycleForm/`;

								resolve(taskData);
								break;
							default:
								taskData.description =
									"Notif Data not updated! must include {task} when creating a notification.";

								// resolve(taskData);
								resolve(false);
								break;
						}
					});
			});

		var processed_indiv_performance;
		for (let i = 0; i <= arrNotif.length; i++) {
			if (i == arrNotif.length) {
				// console.log("tasks_performance_management");
				// console.log(tasks_performance_management);
				resolve(tasks_performance_management);
			} else if (i < arrNotif.length) {
				userID = arrNotif[i].receiver._id;
				user_name = `${arrNotif[i].receiver.firstName} ${arrNotif[i].receiver.lastName}`;
				position = arrNotif[i].receiver.position;
				perfoCycle_id = arrNotif[i].reference._id;
				task = arrNotif[i].task;
				notifDate = arrNotif[i].date.toISOString();

				// console.log(i);
				// console.log(`${userID} - ${offboardingID} - ${task} -`)
				processed_indiv_performance = await getTaskRowData(
					userID,
					perfoCycle_id,
					task,
					notifDate,
					arrNotif[i]
				);
				// console.log(processed_indiv_performance);

				// if not false, as false means that the notification should not appear in task list.
				if (processed_indiv_performance != false) {
					const obj_to_be_pushed = notifs_request
						? {
								deadlineISO: processed_indiv_performance.deadlineISO,
								isCompleted: processed_indiv_performance.isCompleted,
								...arrNotif[i],
						  }
						: processed_indiv_performance;

					tasks_performance_management.push(obj_to_be_pushed);
				}
			}
		}
	});
}

async function process_training(arrNotif, notifs_request) {
	return new Promise(async (resolve, reject) => {
		// code here
		var tasks_training = [];
		var userID, position, perfoCycle_id, task, notifDate;

		const getTaskRowData = async (userID, task, notif) =>
			new Promise((resolve, reject) => {
				let taskData = { type: "Training", task };

				let perfoCycle_id = notif.reference._id;

				const isCompleted_answerSkillsAssessment = async (userID, notif) => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";

						userModel.findOne(
							{ _id: ObjectId(userID) },
							function (err, userData) {
								var userPosition = userData.position;
								if (notif.reference.skillPositionTitle != userPosition) {
									resolve(false);
								} else {
									skillAssessmentModel.findOne(
										{
											"employeeDetails.id": userID,
											skillCycleDate: notif.date,
										},
										function (err, data) {
											if (data != null) {
												isCompleted = "Completed";
											}
											resolve(isCompleted);
										}
									);
								}
							}
						);
					});
				};

				const isCompleted_setSkillSetup = async (userID, notif) => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";

						var position = notif.reference.skillPositionTitle;
						var currDate = new Date();
						var startDate = notif.date;
						// console.log(` ${position} `);
						// console.log(` ${currDate} `);

						skillSetupModel.find(
							{ skillPositionTitle: position },
							function (err, results) {
								var isStartDateBeforeExpireDate = false;
								var index;
								for (i = 0; i < results.length; i++) {
									var expireDate = new Date(results[i].expireDate);
									// console.log(results.length);
									// console.log(
									// 	` ${position} ${currDate.getTime()} ${results[
									// 		i
									// 	].expireDate.getTime()} \n ${currDate.toLocaleDateString()} ${results[
									// 		i
									// 	].expireDate.toLocaleDateString()}  `
									// );
									if (startDate.getTime() < results[i].expireDate.getTime()) {
										// is startDate is before the latest expireDate for the position, send the skillSetup data
										isStartDateBeforeExpireDate = true;
										index = i;
									}
								}

								if (isStartDateBeforeExpireDate == true) {
									// console.log(results[index]);
									isCompleted = "Completed";
								}

								resolve(isCompleted);
							}
						);
					});
				};

				const isCompleted_submitTrainingNomination = async skillsSetup_id => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";
						trainingNominationModel.findOne(
							{ reference_skillSetupID: skillsSetup_id },
							function (err, data) {
								if (data != null) {
									isCompleted = "Completed";
								}
								resolve(isCompleted);
							}
						);
					});
				};

				const isCompleted_trainingNominationApproval = async (userID, _id) => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";
						// console.log("_id", _id);
						trainingNominationModel.findOne({ _id: _id }, function (err, data) {
							if (
								data.approvalDHead.approver &&
								data.approvalBUHead.approver &&
								data.approvalCHRODDirector.approver
							)
								if (
									(data.approvalDHead.approver._id.toString() ==
										userID.toString() &&
										data.approvalDHead.approval != "Pending") ||
									data.status == "Disapproved"
								) {
									// isCompleted = `${data.approvalDHead.approver._id} ${userID} ${data.approvalDHead.approval}`;
									isCompleted = "Completed";
								} else if (
									(data.approvalBUHead.approver._id.toString() ==
										userID.toString() &&
										data.approvalBUHead.approval != "Pending") ||
									data.status == "Disapproved"
								) {
									isCompleted = "Completed";
								} else if (
									(data.approvalCHRODDirector.approver._id.toString() ==
										userID.toString() &&
										data.approvalCHRODDirector.approval != "Pending") ||
									data.status == "Disapproved"
								) {
									isCompleted = "Completed";
								}

							resolve(isCompleted);
						});
					});
				};
				const isCompleted_confirmAttendance = async _id => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";
						employeeTrackerModel.findOne(
							{ "trainingDetails.id": _id },
							function (err, data) {
								// isCompleted = `${data.approvalDHead.approver._id} ${userID} ${data.approvalDHead.approval}`;
								if (data != null && data.answered == true) {
									isCompleted = "Completed";
								}

								resolve(isCompleted);
							}
						);
					});
				};
				const isCompleted_answerTrainingEvaluation =
					async employeeTracker_id => {
						return new Promise((resolve, reject) => {
							var isCompleted = "Not Started";
							trainingEvaluationModel.findOne(
								{ employeeTrackerID: employeeTracker_id },
								function (err, data) {
									if (data != null) {
										isCompleted = "Completed";
									}
									resolve(isCompleted);
								}
							);
						});
					};
				const isCompleted_attendTraining = async (userID, notif) => {
					return new Promise((resolve, reject) => {
						var isCompleted = "Not Started";

						employeeTrackerModel.findOne(
							{ "trainingdetails.id": notif.reference._id },
							function (err, data) {
								// if (data != null) {
								// 	isCompleted = "Completed";
								// }
								// resolve(isCompleted);

								for (let i = 0; i <= data.employees.length; i++) {
									if (i == data.employees.length) {
										resolve(isCompleted);
									} else {
										// console.log(` ${data.employees[i].employeeID}  ${userID}`);
										if (
											data.employees[i].employeeID.toString() ==
											userID.toString()
										) {
											if (data.employees[i].attendance == "Pending") {
												isCompleted = "Not Started";
											} else if (data.employees[i].attendance == "Present") {
												isCompleted = "Completed";
											} else if (data.employees[i].attendance == "Absent") {
												isCompleted = "Absent";
											}
										}
									}
								}
							}
						);
					});
				};
				const isCompleted_create_a_training = async notif => {
					return new Promise((resolve, _) => {
						let isCompleted = "Not Started";

						trainingNominationModel.findOne(
							{
								businessUnit: notif.reference.businessUnit,
								department: notif.reference.department,
							},
							"employees requestDate",
							{ sort: { requestDate: -1 } },
							function (err, data) {
								if (err != null) throw err;
								let isCompleted_bool = false;
								// console.log("data", data);
								if (data) {
									data.employees.every(emp => {
										isCompleted_bool =
											emp.employeePosition === notif.reference.position;
										return !isCompleted_bool;
									});
									const req_date = data.requestDate;
									const notif_date = notif.date;
									// console.log("req_date", req_date);
									// console.log("notif_date", notif_date);
									// console.log("isCompleted_bool", isCompleted_bool);

									// console.log(isCompleted && req_date > notif_date);
									if (isCompleted_bool && req_date > notif_date)
										isCompleted = "Completed";
									// console.log("isCompleted", isCompleted);
									// console.log("req_date > notif_date", req_date > notif_date);
								}

								resolve(isCompleted);
							}
						);
					});
				};

				skillSetupModel.findOne({}).then(async skillSetupData => {
					var computed_deadline;
					var trainingDate;
					switch (task) {
						case "Answer Skills Assessment":
							// 30 days after start of cycle / notifDate
							computed_deadline = generateDeadline_DaysAfter(notif.date, 30);
							taskData.description = `Please answer the ${
								notif.reference.reviewCycle
							} skills assessment form for  ${notif.date.toLocaleDateString(
								"en-US",
								{ month: "short", year: "numeric" }
							)} for ${notif.reference.skillPositionTitle}.`;
							taskData.deadline = computed_deadline.toLocaleTimeString(
								"en-US",
								{
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								}
							);
							taskData.deadlineISO = computed_deadline;
							taskData.priority = prioritizer(computed_deadline);
							taskData.isCompleted = await isCompleted_answerSkillsAssessment(
								userID,
								notif
							);
							taskData.link = `/SkillAssessmentForm/${
								notif.reference._id
							}/${notif.date.toISOString()}`;

							if (taskData.isCompleted == false) resolve(false);
							else resolve(taskData);

							break;

						case "Set Skill Setup":
							// 90 days after expireDate
							computed_deadline = generateDeadline_DaysAfter(
								notif.reference.expireDate,
								90
							);
							taskData.description = `Skills setup cycle for ${
								notif.reference.skillPositionTitle
							} position in ${notif.reference.skillDepartment} ${
								notif.reference.skillBusinessUnit
							} will end on ${notif.reference.expireDate.toLocaleDateString(
								"en-US",
								{ month: "short", year: "numeric", day: "numeric" }
							)}. Submit skill setup form.`;
							taskData.deadline = computed_deadline.toLocaleTimeString(
								"en-US",
								{
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								}
							);
							taskData.deadlineISO = computed_deadline;
							taskData.priority = prioritizer(computed_deadline);
							taskData.isCompleted = await isCompleted_setSkillSetup(
								userID,
								notif
							);
							taskData.link = `/form/SkillsSetupForm`;

							resolve(taskData);
							break;
						case "Submit Training Nomination":
							// 7 days after all employees submitted the skills assessment
							computed_deadline = generateDeadline_DaysAfter(notif.date, 7);
							taskData.description = `All ${notif.reference.skillPositionTitle} employees have submitted the skill assessment form. Submit training nomination.`;
							taskData.deadline = computed_deadline.toLocaleTimeString(
								"en-US",
								{
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								}
							);
							taskData.deadlineISO = computed_deadline;
							taskData.priority = prioritizer(computed_deadline);
							taskData.isCompleted = await isCompleted_submitTrainingNomination(
								notif.reference._id
							);
							taskData.link = `/SkillAssessmentTrackerSorted/${notif.reference._id}`;

							resolve(taskData);
							break;
						case "Training Nomination Approval":
							// 7 days before the training date
							trainingDate = new Date(notif.reference.inclusiveDates[0]);
							computed_deadline = generateDeadline_DaysBefore(trainingDate, 7);
							taskData.description = `Approval needed for training nomination #${
								notif.reference.trainingID
							}. The ${notif.reference.trainingTitle}  will be held on ${
								notif.reference.venue
							} at ${trainingDate.toLocaleTimeString("en-US", {
								month: "short",
								year: "numeric",
								day: "numeric",
								hour12: true,
							})}`;
							taskData.deadline = computed_deadline.toLocaleTimeString(
								"en-US",
								{
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								}
							);
							taskData.deadlineISO = computed_deadline;
							taskData.priority = prioritizer(computed_deadline);
							taskData.isCompleted =
								await isCompleted_trainingNominationApproval(
									userID,
									notif.reference._id
								);
							taskData.link = `/TrainingNominationTracker/${notif.reference._id}`;

							resolve(taskData);
							break;
						case "Confirm Attendance":
							trainingDate = new Date(
								notif.reference.trainingDetails.trainingDate
							);
							computed_deadline = generateDeadline_DaysBefore(trainingDate, 0);
							taskData.description = `Confirm employee attendance for ${
								notif.reference.trainingDetails.trainingTitle
							}  held on ${
								notif.reference.trainingDetails.trainingVenue
							} at ${trainingDate.toLocaleTimeString("en-US", {
								month: "short",
								year: "numeric",
								day: "numeric",
								hour12: true,
							})}`;
							taskData.deadline = computed_deadline.toLocaleTimeString(
								"en-US",
								{
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								}
							);
							taskData.deadlineISO = computed_deadline;
							taskData.priority = prioritizer(computed_deadline);
							taskData.isCompleted = await isCompleted_confirmAttendance(
								notif.reference.trainingDetails.id
							);
							taskData.link = `/GetConfirmAttendancePage/${notif.reference._id}`;

							resolve(taskData);
							break;
						case "Answer Training Evaluation":
							trainingDate = new Date(
								notif.reference.trainingDetails.trainingDate
							);
							computed_deadline = generateDeadline_DaysAfter(trainingDate, 3);
							taskData.description = `Answer training evaluation for the ${
								notif.reference.trainingDetails.trainingTitle
							} you had on ${trainingDate.toLocaleDateString("en-US", {
								month: "short",
								year: "numeric",
								day: "numeric",
							})}`;
							taskData.deadline = computed_deadline.toLocaleTimeString(
								"en-US",
								{
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								}
							);
							taskData.deadlineISO = computed_deadline;
							taskData.priority = prioritizer(computed_deadline);
							taskData.isCompleted = await isCompleted_answerTrainingEvaluation(
								notif.reference._id
							);
							taskData.link = `/EvaluationForm/${notif.reference._id}`;

							resolve(taskData);
							break;

						default: //notifs without a task. but with exception
							if (notif.referenceType == "Training Schedule") {
								taskData.task = "Attend Training";
								computed_deadline = generateDeadline_DaysAfter(
									new Date(notif.reference.inclusiveDates[0]),
									0
								);
								taskData.description = `Please attend the ${
									notif.reference.trainingTitle
								} scheduled on ${new Date(
									notif.reference.inclusiveDates[0]
								).toLocaleTimeString("en-US", {
									month: "short",
									year: "numeric",
									day: "numeric",
									hour12: true,
								})} `;
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted = await isCompleted_attendTraining(
									userID,
									notif
								);
								taskData.link = `/TrainingIndividualTracker/${notif.reference._id}`;
								resolve(taskData);
							} else if ("Create a Training" === notif.referenceType) {
								// for training recommender
								// console.log("Training Recommender Task Added");
								taskData.task = "Create a Training";
								taskData.description = notif.description;
								computed_deadline = generateDeadline_DaysAfter(
									new Date(notif.date),
									1
								);
								taskData.deadline = computed_deadline.toLocaleTimeString(
									"en-US",
									{
										month: "short",
										year: "numeric",
										day: "numeric",
										hour12: true,
									}
								);
								taskData.deadlineISO = computed_deadline;
								taskData.priority = prioritizer(computed_deadline);
								taskData.isCompleted = await isCompleted_create_a_training(
									notif
								);
								taskData.link = `/get_training_prescription_page`;
								// console.log("else");
								resolve(taskData);
							} else resolve(false);

							break;
					}
				});
			});

		var processed_indiv_training;
		for (let i = 0; i <= arrNotif.length; i++) {
			if (i == arrNotif.length) {
				// console.log("tasks_training");
				// console.log(tasks_training);
				resolve(tasks_training);
			} else if (i < arrNotif.length) {
				userID = arrNotif[i].receiver._id;
				user_name = `${arrNotif[i].receiver.firstName} ${arrNotif[i].receiver.lastName}`;
				position = arrNotif[i].receiver.position;
				// perfoCycle_id = arrNotif[i].reference._id;
				task = arrNotif[i].task;
				notifDate = arrNotif[i].date.toISOString();

				// console.log(i);
				// console.log(`${userID} - ${offboardingID} - ${task} -`)
				processed_indiv_training = await getTaskRowData(
					userID,
					task,
					arrNotif[i]
				);
				// console.log(processed_indiv_training);

				// if not false, as false means that the notification should not appear in task list.
				if (processed_indiv_training != false) {
					const obj_to_be_pushed = notifs_request
						? {
								deadlineISO: processed_indiv_training.deadlineISO,
								isCompleted: processed_indiv_training.isCompleted,
								...arrNotif[i],
						  }
						: processed_indiv_training;

					tasks_training.push(obj_to_be_pushed);
				}
			}
		}
	});
}

/**
 * returns all task info based on the categorized notifs array
 *
 * @param {*} NotifsByType
 * @returns {prf, offboarding, exitsurvey} processed tasks data
 */
async function ProcessNotifsByTypeToTask(NotifsByType, notifs_request) {
	// define per type then assign with the fucntion that processes that type
	const get_prf = process_PRF(NotifsByType.prf, notifs_request);
	const get_application = process_application(
		NotifsByType.application,
		notifs_request
	);
	const get_offboarding = process_offboarding(
		NotifsByType.offboarding,
		notifs_request
	);
	const get_performance_management = process_performance_management(
		NotifsByType.performance_management,
		notifs_request
	);
	const get_training = process_training(NotifsByType.training, notifs_request);

	// const get_exitsurvey = process_offboarding(NotifsByType.exitsurvey);

	// returns after all promises are fulfilled
	return {
		prf: await get_prf,
		application: await get_application,
		offboarding: await get_offboarding,
		performance_management: await get_performance_management,
		training: await get_training,
	};
}

async function getTasksByStatus(arrAllTasks) {
	var arrTasks = {
		Completed: [],
		NotStarted: [],
	};

	return new Promise((resolve, reject) => {
		for (let i = 0; i <= arrAllTasks.length; i++) {
			if (i == arrAllTasks.length) {
				// console.log("arrTasks", arrTasks);
				resolve(arrTasks);
			} else {
				// console.log(`arrAllTasks[${i}]`, arrAllTasks[i]);
				if (arrAllTasks[i].isCompleted == "Completed")
					arrTasks.Completed.push(arrAllTasks[i]);
				else if (arrAllTasks[i].isCompleted == "Not Started")
					arrTasks.NotStarted.push(arrAllTasks[i]);
				else if (arrAllTasks[i].isSeen) {
					arrTasks.Completed.push(arrAllTasks[i]);
				} else arrTasks.NotStarted.push(arrAllTasks[i]);
			}
		}
	});
}

const TaskTrackerController = {
	TaskTracker: async function (req, res) {
		var user_id = req.session._id;
		// console.log(user_id);

		let unfilteredUserNotifications = await getUserNotifications(user_id);
		// console.log("unfilteredUserNotifications");
		// console.log(unfilteredUserNotifications);

		// waits to get the filtered notifications by referenceType
		let NotifsByType = await filterNotifsByType(unfilteredUserNotifications);
		// console.log("NotifsByType");
		// console.log(NotifsByType);

		let Processed_NotifsByTypeToTask = await ProcessNotifsByTypeToTask(
			NotifsByType,
			false
		);
		// console.log("Processed_NotifsByTypeToTask");
		// console.log(Processed_NotifsByTypeToTask);

		let arrAllTasks = [].concat(
			Processed_NotifsByTypeToTask.prf,
			Processed_NotifsByTypeToTask.application,
			Processed_NotifsByTypeToTask.offboarding,
			Processed_NotifsByTypeToTask.performance_management,
			Processed_NotifsByTypeToTask.training
		);
		// console.log("arrAllTasks");
		// console.log(arrAllTasks);

		arrAllTasks.sort((a, b) => a.deadlineISO - b.deadlineISO); // sort from high to low diff in deadline to todays date

		let arrTasksByStatus = await getTasksByStatus(arrAllTasks);
		// console.log("arrTasksByStatus");
		// console.log(arrTasksByStatus);

		res.render("pages/TaskTrackerPage", {
			AllTasks: arrAllTasks,
			CompletedTasks: arrTasksByStatus.Completed,
			NotStartedTasks: arrTasksByStatus.NotStarted,
		});
	},
	get_tasks: async function (req, res) {
		// test
		// trainingNominationModel.findOne(
		// 	{
		// 		businessUnit: "LNL Archipelago Minerals",
		// 		department: "Functional Materials",
		// 	},
		// 	"employees requestDate",
		// 	function (err, data) {
		// 		if (err != null) throw err;
		// 		let isCompleted = false;
		// 		data.employees.every(emp => {
		// 			isCompleted = emp.employeePosition === "Plant Technician";
		// 			return emp.employeePosition !== "Plant Technician";
		// 		});
		// 		const req_date = data.requestDate;
		// 		const notif_date = "2022-06-10T07:36:19.290+00:00";
		// 		console.log("req_date", req_date);
		// 		console.log("notif_date", notif_date);
		// 		console.log("isCompleted", isCompleted);
		// 		console.log(isCompleted && req_date > notif_date);
		// 	}
		// );

		var user_id = req.session._id;
		// console.log(user_id);

		let unfilteredUserNotifications = await getUserNotifications(user_id);
		// console.log("unfilteredUserNotifications");
		// console.log(unfilteredUserNotifications);

		// waits to get the filtered notifications by referenceType
		let NotifsByType = await filterNotifsByType(unfilteredUserNotifications);
		// console.log("NotifsByType");
		// console.log(NotifsByType);

		let Processed_NotifsByTypeToTask = await ProcessNotifsByTypeToTask(
			NotifsByType,
			true
		);
		// console.log("Processed_NotifsByTypeToTask");
		// console.log(Processed_NotifsByTypeToTask);

		let arrAllTasks = [].concat(
			Processed_NotifsByTypeToTask.prf,
			Processed_NotifsByTypeToTask.application,
			Processed_NotifsByTypeToTask.offboarding,
			Processed_NotifsByTypeToTask.performance_management,
			Processed_NotifsByTypeToTask.training,
			NotifsByType.not_tasks
		);
		// console.log("arrAllTasks");
		// console.log(arrAllTasks);

		let arrTasksByStatus = await getTasksByStatus(arrAllTasks);
		// console.log("arrTasksByStatus");
		// console.log(arrTasksByStatus);

		arrTasksByStatus.Completed.sort((a, b) => {
			const first_date = a.isCompleted ? a._doc.date : a.date;
			const second_date = b.isCompleted ? b._doc.date : b.date;
			// console.log("first_date", first_date);
			// console.log("second_date", second_date);
			return first_date - second_date;
		}); // sort from high to low diff in deadline to todays date

		arrTasksByStatus.NotStarted.sort((a, b) => {
			const first_date = a.isCompleted ? a._doc.date : a.date;
			const second_date = b.isCompleted ? b._doc.date : b.date;
			// console.log("first_date", first_date);
			// console.log("second_date", second_date);
			return first_date - second_date;
		}); // sort from high to low diff in deadline to todays date

		res.send({
			// AllTasks: arrAllTasks,
			CompletedTasks: arrTasksByStatus.Completed,
			NotStartedTasks: arrTasksByStatus.NotStarted,
		});
	},
};

module.exports = TaskTrackerController;

const { ObjectId } = require("mongodb");
const applicationsModel = require("../models/applicationsModel.js");
const userModel = require("../models/userModel.js");
const interviewScheduleModel = require("../models/interviewScheduleModel.js");
const notificationModel = require("../models/notificationModel.js");
const employeeActionFormModel = require("../models/employeeActionFormModel.js");
const offboardingModel = require("../models/offboardingModel.js");
const personalInformationsModel = require("../models/personalInformationsModel.js");
const PRFModel = require("../models/PRFModel.js");
const skillSetupModel = require("../models/skillSetupModel.js");
const goalCycleModel = require("../models/performance/perfoGoalCycleModel.js");
const Scheduler = require("../jobs/scheduler.js")

function getHRpartnerPosition(businessUnit) {
	var HRPartner;
	switch (businessUnit) {
		case "Petrolift":
			HRPartner = "HR Officer";
			break;
		case "Circle Corporation Inc.":
			HRPartner = "HR Officer";
			break;
		case "LNL Archipelago Minerals":
			HRPartner = "HR Specialist";
			break;
		case "Leonio Land":
			HRPartner = "HR Supervisor";
			break;
	}

	return HRPartner;
}

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

	console.log(sendDate);

	return sendDate;
}

const ApplicantApprovalController = {
	ApplicantIndividual: function (req, res) {
		var applicationID = req.params.applicationID;
		const approverVariables =
			"_id email firstName lastName businessUnit department position";

		applicationsModel.findOne(
			{ _id: applicationID },
			function (err, applicationData) {
				var HRPartner_id = applicationData.HRPartner_id;
				var requisition_id = applicationData.requisition_id;
				var DHead_id = applicationData.DHead_id;

				var application = {
					_id: applicationData._id,
					fName: applicationData.user.firstName,
					middleName: applicationData.user.middleName,
					lastName: applicationData.user.lastName,

					nickName: applicationData.user.nickName,
					personalEmail: applicationData.user.personalEmail || applicationData.user.email,

					status: applicationData.status,

					approvalHRPartner: applicationData.approvalHRPartner,
					approvalAsstHRManager: applicationData.approvalAsstHRManager,
					approvalDHead: applicationData.approvalDHead,
					approvalBUHead: applicationData.approvalBUHead,

					approval1stInterview: applicationData.approval1stInterview,
					approval2ndInterview: applicationData.approval2ndInterview,
					approval3rdInterview: applicationData.approval3rdInterview,
					approvalFinal: applicationData.approvalFinal,

					initialInterviewSchedule: applicationData.initialInterviewSchedule,
					functionalInterviewSchedule:
						applicationData.functionalInterviewSchedule,
					finalInterviewSchedule: applicationData.finalInterviewSchedule,

					initialInterviewFeedback: applicationData.initialInterviewFeedback,
					functionalInterviewFeedback:
						applicationData.functionalInterviewFeedback,
					finalInterviewFeedback: applicationData.finalInterviewFeedback,
					pre_employment_reqs: applicationData.pre_employment_reqs,
				};

				// computes for the total rating of each interviews if meron
				var first_IF_total = 0,
					second_IF_total = 0,
					third_IF_total = 0;
				if (applicationData.initialInterviewFeedback != null) {
					first_IF_total =
						applicationData.initialInterviewFeedback.pbac +
						applicationData.initialInterviewFeedback.ic_skills +
						applicationData.initialInterviewFeedback.work_history +
						applicationData.initialInterviewFeedback.functional_skills +
						applicationData.initialInterviewFeedback.personality +
						applicationData.initialInterviewFeedback.impression;
					applicationData.initialInterviewFeedback.total = first_IF_total;
				}
				if (applicationData.functionalInterviewFeedback != null) {
					second_IF_total =
						applicationData.functionalInterviewFeedback.practical_experience +
						applicationData.functionalInterviewFeedback.functional_expertise +
						applicationData.functionalInterviewFeedback.management_skills +
						applicationData.functionalInterviewFeedback.response_resource +
						applicationData.functionalInterviewFeedback.self_management +
						applicationData.functionalInterviewFeedback.impression;
					applicationData.functionalInterviewFeedback.total = second_IF_total;
				}
				if (applicationData.finalInterviewFeedback != null) {
					third_IF_total =
						applicationData.finalInterviewFeedback.org_fit +
						applicationData.finalInterviewFeedback.core_values +
						applicationData.finalInterviewFeedback.leadership +
						applicationData.finalInterviewFeedback.innovation +
						applicationData.finalInterviewFeedback.accountability +
						applicationData.finalInterviewFeedback.personal_effectiveness +
						applicationData.finalInterviewFeedback.potential_growth +
						applicationData.finalInterviewFeedback.overall_impression;
					applicationData.finalInterviewFeedback.total = third_IF_total;
				}

				/**
				 * finds HR Partner info
				 */
				userModel
					.findOne({ _id: ObjectId(HRPartner_id) }, approverVariables)
					.then(HRPartnerInformation => {
						//stores HR Partner info that will process the application
						application.HRPartnerInformation = HRPartnerInformation;

						/**
						 * finds DHead_id info
						 */
						userModel
							.findOne({ _id: ObjectId(DHead_id) }, approverVariables)
							.then(DHeadInformation => {
								application.DHeadInformation = DHeadInformation;

								personalInformationsModel
									.findOne({ "user._id": ObjectId(applicationData.user._id) })
									.then(personalInformation => {
										application.personalInformation = personalInformation;

										// retrieves PRF record
										PRFModel.findOne({ requisitionID: requisition_id }).then(
											requisition => {
												application.requisition = requisition;

												if (
													req.session.position == "HR Director" ||
													req.session.position == "HR Assistant Manager" ||
													req.session.position == "HR Officer" ||
													req.session.position == "HR Specialist" ||
													req.session.position == "Department Head" ||
													req.session.position == "Business Unit Head" ||
													req.session.position == "Department Director"
												) {
													// if applicant do not show approvers
													res.render("pages/ApplicantApprovalPage", {
														applicationData: application,
														canSee: true,
													});
												} else {
													res.render("pages/ApplicantApprovalPage", {
														applicationData: application,
														canSee: false,
													});
												}
											}
										);
									});
							});
					});
			}
		);
	},

	getApplicationData: function (req, res) {
		// this gets the applciation data and pass the data into client
		var applicationID = req.params.applicationID;



		applicationsModel.findOne(
			{ _id: applicationID },
			function (err, applicationData) {
				// console.log(" applicationData " +applicationData);
				res.send(applicationData);
			}
		);
	},

	ScheduleInterviewFromApplication: function (req, res) {
		/**
		 * NEW TODO - Updated Schedule Interview
		 *
		 * @params interview_stage string
		 * @params interviewer_input ObjectID of user
		 * @params interview_datetime date
		 *
		 * [x] find interviewer using interviewer_input
		 * [x] find applicant using application_id -> user in applicationsModel
		 * [x] create new InterviewSchedule Record
		 * [x] create new Notifications Record for the Interviewee
		 * [x] create new Notifications Record for the Interviewer
		 * [x] update Application data
		 *      approver's status to "Interview Scheduled" depends on which stage
		 *      [x]approval1stInterview
		 *      [x]approval2ndInterview
		 *      [x]approval3rdInterview
		 *      [x]Interview schedules (the 3 interviews din)
		 *
		 * [] create cron notif for interviewer
		 */

		var interviewDatetime = req.body.interview_datetime;
		var interviewStage = req.body.interview_stage;
		var application_id = req.body.application_id;

		var interviewer_id = req.body.interviewer_input;
		var interviewee, interviewer; // stores them as user object, used in notifs and interview schedule
		var requisitionID; // stores the requisitionID of the application
		var updatedInfo; //used in updating the Application record

		var interviewSchedule = {}; //initializes interviewSchedule object.
		var date = new Date(interviewDatetime);

		var curDate = new Date(Date.now());
		// curDate = new Date(YYYYMMDDtoDate(curDate));

		var userQueryVar =
			"_id email firstName lastName businessUnit department position";

		userModel.findOne(
			{ _id: interviewer_id },
			userQueryVar,
			function (err, interviewer) {
				interviewer = interviewer;

				applicationsModel
					.findOne({ _id: application_id })
					.then(applicationResult => {
						interviewee = applicationResult.user;
						requisition_id = applicationResult.requisition_id;

						// console.log("applicationResult " + applicationResult);

						// saves an interview schedule
						interviewSchedule = new interviewScheduleModel({
							_id: ObjectId(),
							date: date,
							stage: interviewStage,
							interviewee: interviewee,
							interviewer: interviewer,
							type: "Application",
							reference: { _id: application_id },
						});
						interviewSchedule.save();

						/**
						 * sets data for updatedInfo for updating the application based in interviewStage
						 */
						switch (interviewStage) {
							case "Initial Interview":
								updatedInfo = {
									approval1stInterview: "Interview Scheduled",
									initialInterviewSchedule: interviewSchedule,
								};
								break;
							case "Functional Interview":
								updatedInfo = {
									approval2ndInterview: "Interview Scheduled",
									functionalInterviewSchedule: interviewSchedule,
								};
								break;
							case "Final Interview":
								updatedInfo = {
									approval3rdInterview: "Interview Scheduled",
									finalInterviewSchedule: interviewSchedule,
								};
								break;
						}

						/**
						 * Get PRF data for sending notifications to the interviewee.
						 *      Vars needed is just the position tbh
						 */
						PRFModel.findOne({ requisitionID: requisition_id }).then(
							PRFData => {
								let position = PRFData.positionTitle;

								// sends notification to the -> interviewEE
								var notificationForInterviewee = new notificationModel({
									_id: ObjectId(),
									receiver: interviewee,
									date: curDate,
									description: `The ${interviewStage} for your application for the ${position} position is scheduled on ${date.toLocaleString()}`,

									referenceType: "Application",
									reference: applicationResult,
									task: `Join ${interviewStage}`,
								});
								notificationForInterviewee.save();

								// sends notification to the -> interviewER
								var notificationForInterviewer = new notificationModel({
									_id: ObjectId(),
									receiver: interviewer,
									date: curDate,
									description: `${interviewStage} for Applicant ${interviewee.firstName
										} ${interviewee.lastName
										} is scheduled on ${date.toLocaleString()}`,
									referenceType: "Application",
									reference: applicationResult,
									task: `Evaluate ${interviewStage}`,
								});

								notificationForInterviewer.save();
							}
						);

						/**
						 * updates the application record using the updatedInfo defined earlier
						 */
						applicationsModel.updateOne(
							{ _id: ObjectId(application_id) },
							{ $set: updatedInfo },
							function () {
								console.log(
									"updatedInfo " + JSON.stringify(updatedInfo, null, " ")
								);

								//refreshes page after upating application record
								res.redirect("back");
							}
						);
					});
			}
		);
	},

	SubmitActionForm: function (req, res) {
		let id = req.params.id;
		offboardingModel
			.findOne({
				_id: id,
			})
			.then(data => {
				res.render("pages/EmployeeActionFormPage", { data: data });
			});
	},

	/**
	 *  This function submits initial interview form from the HR Partner and sends appropriate notifications to the right users.
	 *
	 *  TODO:
	 *  [x] get the Business Unit of Requisition from the Application Object.
	 *  [x] get the HR Partner for the Business Unit first so we can send them the notif later.
	 *
	 *  IF $verdict is "Approved"
	 *  [x] Update Application Record and add the initialInterviewFeedback data
	 *         & the approvalHRPartner with "Approved".
	 *  [x] Send notification to HR Partner, noting that the initial interview is done
	 *         &/? that they shuold schedule for the functional interview now.
	 *
	 *  IF $verdict is "Disapproved"
	 *  [x] Update Application Record and add the initialInterviewFeedback data
	 *          & the approvalHRPartner with "Disapproved"
	 *          & the status with "Disapproved"
	 *  [x] Send notification to HR Partner, noting that application is Disapproved na.
	 *
	 */
	submitInitialInterviewForm: function (req, res) {
		var applicationID = req.body.application_id;
		var verdict;
		var curDate = new Date(Date.now());
		// curDate = new Date(YYYYMMDDtoDate(curDate));

		var initialInterviewFeedback = {
			pbac: Number(req.body.pbac),
			pbac_comments: req.body.pbac_comments,

			ic_skills: Number(req.body.ic_skills),
			ic_skills_comments: req.body.ic_skills_comments,

			work_history: Number(req.body.work_history),
			work_history_comments: req.body.work_history_comments,

			functional_skills: Number(req.body.functional_skills),
			functional_skills_comments: req.body.functional_skills_comments,

			personality: Number(req.body.personality),
			personality_comments: req.body.personality_comments,

			impression: Number(req.body.impression),
			impression_comments: req.body.impression_comments,

			other_comments: req.body.other_comments,
		};

		// retrieves the ApplicationData
		applicationsModel.findOne(
			{ _id: ObjectId(applicationID) },
			function (err, ApplicationData) {
				PRFModel.findOne({
					requisitionID: ApplicationData.requisition_id,
				}).then(requisition => {
					var businessUnit = requisition.businessUnit;
					var approverVariables =
						"_id email firstName lastName businessUnit department position";
					verdict = req.body.verdict;

					// console.log("businessUnit : " + businessUnit);
					/**  finding the HR Partner Approver so that we can send them the notification later**/
					userModel.findOne(
						{
							//query
							businessUnit: "Circle Corporation Inc.",
							department: "Corporate Human Resource & Organization Department",
							position: getHRpartnerPosition(businessUnit),
						},
						//variables to get
						approverVariables,
						//callback function
						function (err, HRPartner) {
							if (err) throw err;

							var HRPartner;
							HRPartner = HRPartner;

							/**
							 * sets Application's initialInterviewFeedback with the initialInterviewFeedback.
							 *      conditions:
							 *              if verdict == "Disapproved", set the whole Application status as "Disapproved", notify HR Partner
							 *              if verdict == "Approved", continue
							 */
							if (verdict == "Approved") {
								applicationsModel.updateOne(
									{ _id: ObjectId(applicationID) },
									{
										$set: {
											initialInterviewFeedback: initialInterviewFeedback,
											approval1stInterview: verdict,
										},
									},
									function () {
										// sends notification to HR Partner, noting that it has been approved
										var notificationToHRPartnerApproved = new notificationModel(
											{
												_id: ObjectId(),
												receiver: HRPartner,
												date: curDate,
												description: `Initial Interview for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been approved. You may now schedule for Functional Interview.`,
												referenceType: "Application",
												reference: ApplicationData,
												task: "Schedule Functional Interview",
											}
										);
										notificationToHRPartnerApproved.save();

										// refreshes page after scheduling & sending notification
										res.redirect("back");
									}
								);
							} else if (verdict == "Disapproved") {
								//updates the application record with the initialInterview Feedback, approval1stInterview, and the status
								applicationsModel.updateOne(
									{ _id: ObjectId(applicationID) },
									{
										$set: {
											initialInterviewFeedback: initialInterviewFeedback,
											approval1stInterview: verdict,
											status: "Disapproved",
										},
									},
									function () {
										// sends notification to HR Partner, noting that it has been approved
										var notificationToHRPartnerDisapproved =
											new notificationModel({
												_id: ObjectId(),
												receiver: HRPartner,
												date: curDate,
												description: `Initial Interview for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The application status is now marked as disapproved.`,
												referenceType: "Application",
												reference: ApplicationData,
											});
										notificationToHRPartnerDisapproved.save();

										// refreshes page after scheduling
										res.redirect("back");
									}
								);
							}
						}
					);
				});
			}
		);
	},
	submitFunctionalInterviewForm: function (req, res) {
		var applicationID = req.body.application_id;
		var verdict;
		var curDate = new Date(Date.now());
		// curDate = new Date(YYYYMMDDtoDate(curDate));

		var functionalInterviewFeedback = {
			practical_experience: Number(req.body.practical_experience),
			practical_experience_comments: req.body.practical_experience_comments,

			functional_expertise: Number(req.body.functional_expertise),
			functional_expertise_comments: req.body.functional_expertise_comments,

			management_skills: Number(req.body.management_skills),
			management_skills_comments: req.body.management_skills_comments,

			response_resource: Number(req.body.response_resource),
			response_resource_comments: req.body.response_resource_comments,

			self_management: Number(req.body.self_management),
			self_management_comments: req.body.self_management_comments,

			impression: Number(req.body.impression),
			impression_comments: req.body.impression_comments,

			other_comments: req.body.other_comments,
		};

		// retrieves the ApplicationData
		applicationsModel.findOne(
			{ _id: ObjectId(applicationID) },
			function (err, ApplicationData) {
				PRFModel.findOne({
					requisitionID: ApplicationData.requisition_id,
				}).then(requisition => {
					var businessUnit = requisition.businessUnit;
					var approverVariables =
						"_id email firstName lastName businessUnit department position";
					verdict = req.body.verdict;

					/**  finding the HR Partner Approver so that we can send them the notification later**/
					userModel.findOne(
						{
							//query
							businessUnit: "Circle Corporation Inc.",
							department: "Corporate Human Resource & Organization Department",
							position: getHRpartnerPosition(businessUnit),
						},
						//variables to get
						approverVariables,
						//callback function
						function (err, HRPartner) {
							if (err) throw err;

							var HRPartner;
							HRPartner = HRPartner;

							/**
							 * sets Application's functionalInterviewFeedback with the functionalInterviewFeedback.
							 *      conditions:
							 *              if verdict == "Disapproved", set the whole Application status as "Disapproved"
							 *              if verdict == "Approved", continue
							 */
							if (verdict == "Approved") {
								applicationsModel.updateOne(
									{ _id: ObjectId(applicationID) },
									{
										$set: {
											functionalInterviewFeedback: functionalInterviewFeedback,
											approval2ndInterview: verdict,
										},
									},
									function () {
										// sends notification to HR Partner, noting that it has been approved
										var notificationToHRPartnerApproved = new notificationModel(
											{
												_id: ObjectId(),
												receiver: HRPartner,
												date: curDate,
												description: `Functional Interview for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been approved. You may now schedule for Final Interview.`,
												referenceType: "Application",
												reference: ApplicationData,
												task: "Schedule Final Interview",
											}
										);
										notificationToHRPartnerApproved.save();

										// refreshes page after scheduling
										res.redirect("back");
									}
								);
							} else if (verdict == "Disapproved") {
								applicationsModel.updateOne(
									{ _id: ObjectId(applicationID) },
									{
										$set: {
											functionalInterviewFeedback: functionalInterviewFeedback,
											approval2ndInterview: verdict,
											status: "Disapproved",
										},
									},
									function () {
										// sends notification to HR Partner, noting that it has been approved
										var notificationToHRPartnerDisapproved =
											new notificationModel({
												_id: ObjectId(),
												receiver: HRPartner,
												date: curDate,
												description: `Functional Interview for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The application status is now marked as disapproved.`,
												referenceType: "Application",
												reference: ApplicationData,
											});
										notificationToHRPartnerDisapproved.save();

										// refreshes page after scheduling
										res.redirect("back");
									}
								);
							}
						}
					);
				});
			}
		);
	},

	submitFinalInterviewForm: function (req, res) {
		var applicationID = req.body.application_id;
		var verdict = req.body.verdict;
		var curDate = new Date(Date.now());
		// curDate = new Date(YYYYMMDDtoDate(curDate));

		var finalInterviewFeedback = {
			org_fit: Number(req.body.org_fit),
			org_fit_comments: req.body.org_fit_comments,

			core_values: Number(req.body.core_values),
			core_values_comments: req.body.core_values_comments,

			leadership: Number(req.body.leadership),
			leadership_comments: req.body.leadership_comments,

			innovation: Number(req.body.innovation),
			innovation_comments: req.body.innovation_comments,

			accountability: Number(req.body.accountability),
			accountability_comments: req.body.accountability_comments,

			personal_effectiveness: Number(req.body.personal_effectiveness),
			personal_effectiveness_comments: req.body.personal_effectiveness_comments,

			potential_growth: Number(req.body.potential_growth),
			potential_growth_comments: req.body.potential_growth_comments,

			overall_impression: Number(req.body.overall_impression),
			overall_impression_comments: req.body.overall_impression_comments,

			other_comments: req.body.other_comments,
		};

		// retrieves the ApplicationData
		applicationsModel.findOne(
			{ _id: ObjectId(applicationID) },
			function (err, ApplicationData) {
				PRFModel.findOne({
					requisitionID: ApplicationData.requisition_id,
				}).then(requisition => {
					var businessUnit = requisition.businessUnit;
					var approverVariables =
						"_id email firstName lastName businessUnit department position";
					/**  finding the HR Partner Approver so that we can send them the notification later**/
					userModel.findOne(
						{
							//query
							businessUnit: "Circle Corporation Inc.",
							department: "Corporate Human Resource & Organization Department",
							position: getHRpartnerPosition(businessUnit),
						},
						//variables to get
						approverVariables,
						//callback function
						function (err, HRPartner) {
							if (err) throw err;

							var HRPartner;
							HRPartner = HRPartner;

							/**
							 * sets Application's finalInterviewFeedback with the finalInterviewFeedback.
							 *      conditions:
							 *              if verdict == "Disapproved", set the whole Application status as "Disapproved"
							 *              if verdict == "Approved",   notify and sent the Summary of Application to the Business Unit Head
							 */
							if (verdict == "Approved") {
								applicationsModel.updateOne(
									{ _id: ObjectId(applicationID) },
									{
										$set: {
											finalInterviewFeedback: finalInterviewFeedback,
											approval3rdInterview: verdict,
										},
									},
									function () {
										/**
										 * TODO
										 * [x] get business unit head
										 * [x] send buh notification about the summary of application.
										 */

										applicationsModel.findOne(
											{ _id: ObjectId(applicationID) },
											function (err, ApplicationResult) {
												userModel.findOne(
													{
														businessUnit: businessUnit,
														position: "Business Unit Head",
													},
													function (err, BUHead) {
														// ** REMOVED BEC REVISIONS requested by company
														// sends notification to Business Unit Head
														// var notificationToBUHeadForSummary = new notificationModel({
														//     _id: ObjectId(),
														//     receiver: BUHead,
														//     date: curDate,
														//     description: `Final Approval is needed for an application for the ${requisition.positionTitle} position.`,
														//     referenceType: "Application",
														//     reference: ApplicationResult
														// })
														// notificationToBUHeadForSummary.save();

														// sends notification to HR Partner, noting that it has been approved
														var notificationToHRPartnerApproved =
															new notificationModel({
																_id: ObjectId(),
																receiver: HRPartner,
																date: curDate,
																description: `Final Interview for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been approved. You may now send to department head for final approval.`,
																referenceType: "Application",
																reference: ApplicationData,
																task: "Submit For Final Approval",
															});
														notificationToHRPartnerApproved.save();

														// refreshes page after scheduling
														res.redirect("back");
													}
												);
											}
										);
									}
								);
							} else if (verdict == "Disapproved") {
								applicationsModel.updateOne(
									{ _id: ObjectId(applicationID) },
									{
										$set: {
											finalInterviewFeedback: finalInterviewFeedback,
											approval3rdInterview: verdict,
											status: "Disapproved",
										},
									},
									function () {
										// sends notification to HR Partner, noting that it has been approved
										var notificationToHRPartnerDisapproved =
											new notificationModel({
												_id: ObjectId(),
												receiver: HRPartner,
												date: curDate,
												description: `Final Interview for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The application status is now marked as disapproved.`,
												referenceType: "Application",
												reference: ApplicationData,
											});
										notificationToHRPartnerDisapproved.save();

										// refreshes page after scheduling
										res.redirect("back");
									}
								);
							}
						}
					);
				});
			}
		);
	},

	/**
	 * this sets the approvalFinal of the application record to "Pending" from null
	 *  & notify the department head for final approval
	 *
	 * @param {} req
	 * @param {*} res
	 */
	submitForFinalApproval: function (req, res) {
		var applicationID = req.body.applicationID;

		applicationsModel
			.findOneAndUpdate(
				{ _id: ObjectId(applicationID) },
				{ $set: { approvalFinal: "Pending" } }
			)
			.then(applicationData => {
				var userQueryVariables =
					"_id email firstName lastName businessUnit department position";
				var DHead_id = applicationData.DHead_id;
				var requisitionID = applicationData.requisition_id;

				PRFModel.findOne({ requisitionID: requisitionID }).then(PRFData => {
					var position = PRFData.positionTitle;
					var businessUnit = PRFData.businessUnit;

					userModel
						.findOne({ _id: DHead_id }, userQueryVariables)
						.then(DHeadInfo => {
							var DHead = DHeadInfo;
							var curDate = new Date(Date.now());

							// sends notification to Business Unit Head
							var notificationToDHead = new notificationModel({
								_id: ObjectId(),
								receiver: DHead,
								date: curDate,
								description: `Final Approval is needed for an application for the ${position} position in ${businessUnit}.`,
								referenceType: "Application",
								reference: applicationData,
								task: "Final Approval",
							});
							notificationToDHead.save();

							res.redirect("back");
						});
				});
			});
	},

	/**
	 *  DEPRECIATED
	 *
	 *  This updates approvalBUHead to "Approved", application status to "Approved"
	 *      HR Partner will be notified,
	 *      then HR Partner will create an employee action form (separate fucntion)
	 */
	BUH_approve_summary_of_application: function (req, res) {
		var applicationID = req.body.applicationID;
		var curDate = new Date(Date.now());
		// curDate = new Date(YYYYMMDDtoDate(curDate));

		applicationsModel.updateOne(
			{ _id: ObjectId(applicationID) },
			{ $set: { approvalBUHead: "Approved", status: "Approved" } },
			function () {
				applicationsModel.findOne(
					{ _id: ObjectId(applicationID) },
					function (err, ApplicationData) {
						PRFModel.findOne({
							requisitionID: ApplicationData.requisition_id,
						}).then(requisition => {
							var HRPartner = requisition.approvalHRPartner.approver;

							var notificationToHRPartner = new notificationModel({
								_id: ObjectId(),
								receiver: HRPartner,
								date: curDate,
								description: `Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been approved by the Business Unit Head. Prepare the Employment Action Form now.`,
								referenceType: "Application",
								reference: ApplicationData,
							});
							notificationToHRPartner.save();

							res.redirect("back");
						});
					}
				);
			}
		);
	},

	/**
	 * DEPRECIATED
	 *  This updates approvalBUHead to "Disapproved", application status to "Disapproved"
	 *      HR Partner will be notified
	 */
	BUH_disapprove_summary_of_application: function (req, res) {
		var applicationID = req.body.applicationID;

		var applicationID = req.body.applicationID;
		var curDate = new Date(Date.now());
		curDate = new Date(YYYYMMDDtoDate(curDate));

		applicationsModel.updateOne(
			{ _id: ObjectId(applicationID) },
			{ $set: { approvalBUHead: "Disapproved", status: "Disapproved" } },
			function () {
				applicationsModel.findOne(
					{ _id: ObjectId(applicationID) },
					function (err, ApplicationData) {
						PRFModel.findOne({
							requisitionID: ApplicationData.requisition_id,
						}).then(requisition => {
							var HRPartner = requisition.approvalHRPartner.approver;

							var notificationToHRPartner = new notificationModel({
								_id: ObjectId(),
								receiver: HRPartner,
								date: curDate,
								description: `Final approval for applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The Application is now disapproved.`,
								referenceType: "Application",
								reference: ApplicationData,
							});
							notificationToHRPartner.save();

							res.redirect("back");
						});
					}
				);
			}
		);
	},

	/**
	 * submit final approval of application. (dephead)
	 *
	 * Takes in @param {string} verdict which is either Approved/Disapproved
	 *      [x] update application record
	 *      [x] notify hr partner
	 *
	 * @param {*} req
	 * @param {*} res
	 */
	submitApplicationFinalApproval: function (req, res) {
		var verdict = req.body.verdict;
		var applicationID = req.body.applicationID;
		var curDate = new Date(Date.now());
		var updatedInfo;

		// sets the updated info for the application record
		switch (verdict) {
			case "Approved":
				updatedInfo = {
					approvalFinal: verdict,
					status: verdict,
				};

				break;
			case "Disapproved":
				updatedInfo = {
					approvalFinal: verdict,
					status: verdict,
				};
				break;
		}

		// updates application model using the ${updatedInfo}
		// finds application record for use in notification
		applicationsModel
			.findOneAndUpdate({ _id: ObjectId(applicationID) }, { $set: updatedInfo })
			.then(ApplicationData => {
				var HRPartner_id = ApplicationData.HRPartner_id;
				var notifDescription;

				//sets the notification description
				if (verdict == "Disapproved")
					notifDescription = `Final approval for applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The Application is now disapproved.`;
				else if (verdict == "Approved")
					notifDescription = `Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been approved by the Business Unit Head. Prepare the Employment Action Form now.`;

				console.log(notifDescription);
				//notifies the hr partner for that application
				// whether approved/disapproved
				var notificationToHRPartner = new notificationModel({
					_id: ObjectId(),
					receiver: { _id: HRPartner_id },
					date: curDate,
					description: notifDescription,
					referenceType: "Application",
					reference: ApplicationData,
					task: verdict == "Approved" ? "Prepare Employee Action Form" : "None",
				});
				notificationToHRPartner.save();

				console.log(verdict);

				//reloads page
				res.redirect("back");
			});
	},

	/**
	 * Once EAF is submitted for Confirm
	 *  for Confirm Regular Employment (AKA external recruitment)
	 *      [x] save new EAF record
	 *      [x] get ApplicationData
	 *          disc [x] update userModel for the Applicant -> userType ,email, position, department, businessUnit, assessmentLength
	 *          disc [x] notify applicant that theyve been accepted
	 *          disc [x] update Application record status from "approved" to "Employed"
	 *      [x] find HR Supervisor approver from userModel
	 *      [x] find DepHead approver from applicationModel.requisition
	 *      [x] find BUHead approver from applicationModel.requisition
	 *      [x] find CHRODDirector approver from applicationModel.requisition
	 *      [] send notification to the 4 approvers.
	 *      [x] set Application status to "Employee Action For Approval"
	 *
	 */

	submitEmployeeActionForm: function (req, res) {
		var offboardingId = req.body.offboardingId;
		var action = req.body.recommendAction;
		var effectiveDate = new Date(req.body.effective_date);
		var justification = req.body.justification;
		var applicationID = req.body.applicationID;
		var employeeName = req.body.employeeName;
		var employeePosition = req.body.employeePosition;
		var employeeBusinessUnit = req.body.employeeBusinessUnit;
		var employeeDepartment = req.body.employeeDepartment;
		var curDate = new Date(Date.now());

		// curDate = new Date(YYYYMMDDtoDate(curDate));

		// console.log(` ${justification} ${applicationID} ${employeeName} ${employeePosition} ${employeeBusinessUnit} ${employeeDepartment}`);

		// former "Confirm Regular Employment"
		if (action == "Confirm Hiring") {
			employeeActionFormModel.find({}, function (err, EAF) {
				var formID = EAF.length + 1;
				// retrieves the Application Data
				applicationsModel.findOne(
					{ _id: ObjectId(applicationID) },
					function (err, ApplicationData) {
						// console.log("ApplicationData: "+ ApplicationData);
						var Applicant_object = ApplicationData.user;
						var HRPartner_id = ApplicationData.HRPartner_id;

						approverVariables =
							"_id email firstName lastName businessUnit department position";

						var ActionForm = new employeeActionFormModel({
							_id: ObjectId(),
							formID: formID,
							requestDate: curDate,
							name: employeeName,
							positionTitle: employeePosition,
							department: employeeDepartment,
							businessUnit: employeeBusinessUnit,
							action: action,
							status: "Completed", //completed na kaagad
							updatedDate: curDate,
							effectiveDate: effectiveDate,
							justification: justification,
							applicationID_reference: ObjectId(applicationID),
							userID_reference: ObjectId(ApplicationData.user._id),
						});
						ActionForm.save();

						PRFModel.findOne({
							requisitionID: ApplicationData.requisition_id,
						}).then(requisition => {
							let position = requisition.positionTitle;
							let department = requisition.department;
							let businessUnit = requisition.businessUnit;

							// sends notification to the applicant, saying they are accepted.
							var notificationToApplicant_SubmitReqs = new notificationModel({
								_id: ObjectId(),
								receiver: Applicant_object,
								date: curDate,
								description: `Your application for ${position} at ${businessUnit} is approved! Please submit the pre-employment requirements in the office. Click here to go to the application page.`,
								referenceType: "Application",
								reference: ApplicationData,
								task: "Submit Pre-employment Requirements",
							});
							notificationToApplicant_SubmitReqs.save();

							// sends notification to the HR Partner, saying they are accepted.
							var notificationToHRPartner_UpdateReqs = new notificationModel({
								_id: ObjectId(),
								receiver: { _id: HRPartner_id },
								date: curDate,
								description: `Application for ${position} at ${businessUnit} is approved! Applicant is notified of the pre-employment requirements. Click here to go to the application page.`,
								referenceType: "Application",
								reference: ApplicationData,
								task: "Confirm Application",
							});
							notificationToHRPartner_UpdateReqs.save();

							applicationsModel.updateOne(
								{ _id: ObjectId(applicationID) },
								{ $set: { status: "Pre-Employment Requirements Pending" } },
								function () {
									// res.redirect('back');
								}
							);
						});

						// set Application status to "
						// applicationsModel.updateOne({ _id: ObjectId(applicationID) }, { $set: { status: "Employee Action For Approval" } }, function () {
						//     // res.redirect("back");
						// })

						// !!! set Application status to "Employed" !!!!!!!!!!!!!!!!!!!!

						// applicationsModel.updateOne({ _id: ObjectId(applicationID) },
						// { $set: { status: "Employed" } },
						//     function () {

						//         //retrieves data from application to update record of the userModel of the applicant
						//         applicationsModel.findOne({ _id: ObjectId(applicationID) }, function (err, ApplicationData) {

						//             PRFModel.findOne({requisitionID: ApplicationData.requisition_id}).then(requisition=>{

						//                 var user_ID = ApplicationData.user._id;
						//                 var Applicant_object = ApplicationData.user;
						//                 var newCompanyEmail = `${ApplicationData.user.firstName}.${ApplicationData.user.lastName}@leoniogroup.com`;
						//                 var position = requisition.positionTitle;
						//                 var department = requisition.department;
						//                 var businessUnit = requisition.businessUnit;
						//                 var employmentType = requisition.employmentType;
						//                 var assessmentLength = {
						//                     year: requisition.assessmentLength.years,
						//                     month: requisition.assessmentLength.months
						//                 };

						//                 var HRPartnerAssigned = requisition.approvalHRPartner.approver;
						//                 var successCount = requisition.successCount;
						//                 var headcount = requisition.headcount;
						//                 var requisitionID = requisition.requisitionID;
						//                 var PRF_createdBy =  requisition.createdBy;

						//                 console.log(`updated data ${newCompanyEmail} ${position} ${department} ${businessUnit} ${employmentType} ${assessmentLength} `);

						//                 // updates user record with the position and stuff
						//                 userModel.updateOne({ _id: ObjectId(user_ID) },
						//                     {
						//                         $set:
						//                         {
						//                             userType: "Employee",
						//                             email: newCompanyEmail,
						//                             position: position,
						//                             department: department,
						//                             businessUnit: businessUnit,
						//                             assessmentLength: assessmentLength

						//                         }
						//                     },
						//                     function () {

						//                         console.log("abot pa here earlu");

						//                         employeeActionFormModel.findOne({ applicationID_reference: applicationID }, function (err, EAFData) {
						//                             var curDate = new Date(Date.now());
						//                             // curDate = new Date(YYYYMMDDtoDate(curDate));
						//                             var effectiveDate = EAFData.effectiveDate;

						//                             //sends notification to the applicant, saying they are accepted.
						//                             var notificationToApplicant_NowEmployee = new notificationModel({
						//                                 _id: ObjectId(),
						//                                 receiver: Applicant_object,
						//                                 date: curDate,
						//                                 description: `Congrats! You are now accepted as a ${position} employee at ${businessUnit}! Your new company email is ${newCompanyEmail}. This is effective on ${effectiveDate.toLocaleDateString()}`,
						//                                 referenceType: "None"
						//                             })
						//                             notificationToApplicant_NowEmployee.save();

						//                             console.log(`"abot pa here" sc ${successCount} hc ${headcount}`);

						//                             /**
						//                              * if successCount+1 reached the headcount, it means all slots are filled na, so close the job listing.
						//                              * else, just increment the successCount by 1.
						//                              */
						//                              if(successCount+1 >= headcount){
						//                                 console.log("headcount reached na after this");

						//                                 PRFModel.updateOne({requisitionID: requisitionID},
						//                                 {
						//                                     $set:
						//                                     {
						//                                         successCount: successCount+1,
						//                                         status: "Closed",
						//                                         closeDate: new Date()
						//                                     }
						//                                 }, function(){

						//                                     //sends notification to the requester of the PRF : job listing is filled and now closed
						//                                     var notificationTo_PRF_requester = new notificationModel({
						//                                         _id: ObjectId(),
						//                                         receiver: PRF_createdBy,
						//                                         date: curDate,
						//                                         description: `Your Personnel Request #${requisitionID} for ${headcount} ${position} has been completely filled. The job listing is now closed.`,
						//                                         referenceType: "PRF",
						//                                         reference: requisition
						//                                     })
						//                                     notificationTo_PRF_requester.save();

						//                                     //sends notification to the HR Partner : job listing is filled and now closed
						//                                     var notificationToHRPartner = new notificationModel({
						//                                         _id: ObjectId(),
						//                                         receiver: HRPartnerAssigned,
						//                                         date: curDate,
						//                                         description: `Personnel Request Form #${requisitionID} for ${headcount} ${position} has been completely filled. The job listing is now closed.`,
						//                                         referenceType: "PRF",
						//                                         reference: requisition

						//                                     })
						//                                     notificationToHRPartner.save();

						//                                     console.log("successCount incremented & PRF is closed. successCount: " + Number(successCount+1) + " | headcount: " +headcount);
						//                                 })
						//                             }else{
						//                                 console.log("headcount not reached yet");
						//                                 PRFModel.updateOne({requisitionID: requisitionID},
						//                                 {
						//                                     $set:
						//                                     {
						//                                         successCount: successCount+1,
						//                                     }
						//                                 }, function(){
						//                                     console.log("successCount incremented. successCount: " + Number(successCount+1) + " | headcount: " +headcount);

						//                                 })
						//                             }
						//                         })
						//                     }
						//                 )
						//             });
						//         })
						//     }
						// )
					}
				);
			});
		} else if (action == "Transfer") {
			employeeActionFormModel.find({}, function (err, EAF) {
				var formID = EAF.length + 1;
				// retrieves the Application Data
				applicationsModel.findOne(
					{ _id: ObjectId(applicationID) },
					function (err, ApplicationData) {
						// console.log("ApplicationData: "+ ApplicationData);

						// retrieves the HR Supervisor
						approverVariables =
							"_id email firstName lastName businessUnit department position";
						userModel.findOne(
							{
								// query
								businessUnit: "Circle Corporation Inc.",
								department:
									"Corporate Human Resource & Organization Department",
								position: "HR Supervisor",
							},
							approverVariables,
							function (err, HRSupervisorData) {
								// HRSupervisorData not used? waht is the query for then
								var ActionForm = new employeeActionFormModel({
									_id: ObjectId(),
									formID: formID,
									requestDate: curDate,
									name: employeeName,
									positionTitle: employeePosition,
									department: employeeDepartment,
									businessUnit: employeeBusinessUnit,
									action: action,
									status: "Completed", // revised from "Pending" bec no approvals na
									updatedDate: curDate,
									effectiveDate: effectiveDate,
									justification: justification,
									applicationID_reference: ObjectId(applicationID),
									userID_reference: ObjectId(ApplicationData.user._id),

									departmentFrom: req.body.transfer_old_department,
									departmentTo: req.body.transfer_new_department,
									positionFrom: req.body.transfer_old_position,
									positionTo: req.body.transfer_new_position,

									// approvalHRPartner: {
									//     approver: HRSupervisorData,
									//     approval: "Pending"
									// },
									// approvalDHead: {
									//     approver: ApplicationData.requisition.approvalDHead.approver,
									//     approval: "Pending"
									// },
									// approvalBUHead: {
									//     approver: ApplicationData.requisition.approvalBUHead.approver,
									//     approval: "Pending"
									// },
									// approvalCHRODDirector: {
									//     approver: ApplicationData.requisition.approvalCHRODDirector.approver,
									//     approval: "Pending"
									// }
								});
								ActionForm.save();

								/**
								 *  REMOVED NOTIFS FOR APPROVERS BC NO APPROVALS NA
								 * send notifs to the 4 approvers
								 * */
								// var notificationToHRPartner = new notificationModel({
								//     _id: ObjectId(),
								//     receiver: HRSupervisorData,
								//     date: curDate,
								//     description: `Employee Action Form for ${employeeName} needs your approval before confirming employment.`,
								//     referenceType: "EAF",
								//     reference: ActionForm

								// })
								// notificationToHRPartner.save();

								// var notificationToDHead = new notificationModel({
								//     _id: ObjectId(),
								//     receiver: ApplicationData.requisition.approvalDHead.approver,
								//     date: curDate,
								//     description: `Employee Action Form for ${employeeName} needs your approval before confirming employment.`,
								//     referenceType: "EAF",
								//     reference: ActionForm

								// })
								// notificationToDHead.save();

								// var notificationToBUHead = new notificationModel({
								//     _id: ObjectId(),
								//     receiver: ApplicationData.requisition.approvalBUHead.approver,
								//     date: curDate,
								//     description: `Employee Action Form for ${employeeName} needs your approval before confirming employment.`,
								//     referenceType: "EAF",
								//     reference: ActionForm

								// })
								// notificationToBUHead.save();

								// var notificationToCHRODDirector = new notificationModel({
								//     _id: ObjectId(),
								//     receiver: ApplicationData.requisition.approvalCHRODDirector.approver,
								//     date: curDate,
								//     description: `Employee Action Form for ${employeeName} needs your approval before confirming employment.`,
								//     referenceType: "EAF",
								//     reference: ActionForm

								// })
								// notificationToCHRODDirector.save();

								// set Application status to "Employee Action For Approval"
								// applicationsModel.updateOne({ _id: ObjectId(applicationID) }, { $set: { status: "Employee Action For Approval" } }, function () {
								//     // res.redirect("back");
								// })

								// set Application status to "Transferred"
								applicationsModel.updateOne(
									{ _id: ObjectId(applicationID) },
									{ $set: { status: "Transferred" } },
									function () {
										//retrieves data from application to update record of the userModel of the applicant
										applicationsModel.findOne(
											{ _id: ObjectId(applicationID) },
											function (err, ApplicationData) {
												PRFModel.findOne({
													requisitionID: ApplicationData.requisition_id,
												}).then(requisition => {
													var requisitionID = requisition.requisitionID;
													var PRF_createdBy = requisition.createdBy;
													var user_ID = ApplicationData.user._id;
													var Applicant_object = ApplicationData.user;
													var newCompanyEmail = `${ApplicationData.user.firstName.toLowerCase()}.${ApplicationData.user.lastName.toLowerCase()}@leoniogroup.com`;
													var position = requisition.positionTitle;
													var department = requisition.department;
													var businessUnit = requisition.businessUnit;
													var employmentType = requisition.employmentType;
													var assessmentLength = {
														year: requisition.assessmentLength.years,
														month: requisition.assessmentLength.months,
													};

													var headcount = requisition.headcount;
													var successCount = requisition.successCount;

													var HRPartnerAssigned =
														requisition.approvalHRPartner.approver;

													console.log(
														`updated data ${newCompanyEmail} ${position} ${department} ${businessUnit} ${employmentType} ${assessmentLength} `
													);
													// update the details of the newly transferred employee
													userModel.updateOne(
														{ _id: ObjectId(user_ID) },
														{
															$set: {
																userType: "Employee",
																email: newCompanyEmail,
																position: position,
																department: department,
																businessUnit: businessUnit,
																assessmentLength: assessmentLength,
															},
														},
														function () {
															// sends notification to the applicant, saying they are transferred.
															var notificationToApplicant_NowTransferred =
																new notificationModel({
																	_id: ObjectId(),
																	receiver: Applicant_object,
																	date: curDate,
																	description: `Congrats! You are now transferred to ${businessUnit} as a ${position} employee! Your new company email is ${newCompanyEmail}. This is effective on ${effectiveDate.toLocaleDateString()}`,
																	referenceType: "Application",
																	reference: ApplicationData,
																});
															notificationToApplicant_NowTransferred.save();

															// check all current skill setups
															// for each skill setup, check if the newly transferred employee matches the BU Dept and Position
															skillSetupModel.find(
																{
																	skillPositionTitle: position,
																	skillDepartment: department,
																	skillBusinessUnit: businessUnit,
																},
																function (skillSetupErr, skillSetupData) {
																	if (skillSetupErr)
																		return console.error(skillSetupErr);
																	console.log(skillSetupData);
																	skillSetupData.forEach(skill => {
																		const dateNow = new Date();
																		const expirationDate = new Date(
																			skill.expireDate
																		);
																		// console.log("skillSetupData");
																		// console.log(skillSetupData);
																		// console.log("dateNow");
																		// console.log(dateNow);
																		// console.log("expirationDate");
																		// console.log(expirationDate);
																		// if the skill setup is not yet expired
																		if (dateNow < expirationDate) {
																			dateNow.setDate(dateNow.getDate() - 1);
																			// send notification to user
																			skill.dates.map(date => {
																				if (dateNow < date) {
																					var notifications =
																						new notificationModel({
																							_id: new ObjectId(),
																							receiver: Applicant_object,
																							isSeen: false,
																							description: `You need to answer the skills assessment form`,
																							date,
																							referenceType:
																								"Answer Assessment Form Employee",
																							reference: skill,
																							task: "Answer Skills Assessment",
																						});
																					notifications
																						.save()
																						.then(() =>
																							console.log(
																								"sent to",
																								Applicant_object.firstName,
																								skill
																							)
																						);
																				}
																			});
																		}
																	});
																}
															);

															// check all current cycle goals
															// for each cycle goal, check if the newly transferred employee matches the BU Dept and Position
															goalCycleModel.find(
																{ position, department, businessUnit },
																function (cycleGoalsErr, cycleGoalsData) {
																	if (cycleGoalsErr)
																		return console.error(cycleGoalsErr);
																	const dateNow = new Date();
																	dateNow.setDate(dateNow.getDate() - 1);
																	cycleGoalsData.forEach(cycle => {
																		cycle.dates.map(date => {
																			if (dateNow < date) {
																				const notifToAnswerAppraisal =
																					new notificationModel({
																						_id: ObjectId(),
																						receiver: Applicant_object,
																						date: new Date(date),
																						description: `Please answer the Performance Appraisal. Click this notification to be redirected to the form.`,
																						referenceType:
																							"Performance Appraisal",
																						reference: cycle,
																						task: "Answer Performance Appraisal",
																					});
																				notifToAnswerAppraisal
																					.save()
																					.then(() =>
																						console.log(
																							"sent to",
																							Applicant_object.firstName,
																							cycle
																						)
																					);
																			}
																		});
																	});
																}
															);

															employeeActionFormModel.findOne(
																{ applicationID_reference: applicationID },
																function (err, EAFData) {
																	var curDate = new Date(Date.now());
																	// curDate = new Date(YYYYMMDDtoDate(curDate));
																	var effectiveDate = EAFData.effectiveDate;

																	// res.redirect("back");

																	/**
																	 * if successCount+1 reached the headcount, it means all slots are filled na, so close the job listing.
																	 * else, just increment the successCount by 1.
																	 */
																	if (successCount + 1 >= headcount) {
																		PRFModel.updateOne(
																			{ requisitionID: requisitionID },
																			{
																				$set: {
																					successCount: successCount + 1,
																					status: "Closed",
																					closeDate: new Date(),
																				},
																			},
																			function () {

																				/**
																				 * note: this is when job closes after accepting a "transfer"
																				 * schedules a job that deletes unaccepted applicants after a certain period of closing. 
																				 * does not affect users that has applied to another job later that their application to the closed job
																				 * 
																				 * pass the requisitionID
																				 */
																				Scheduler.scheduler.data_deletion_for_inactive_applicants(requisitionID);

																				//sends notification to the requester of the PRF : job listing is filled and now closed
																				var notificationTo_PRF_requester =
																					new notificationModel({
																						_id: ObjectId(),
																						receiver: PRF_createdBy,
																						date: curDate,
																						description: `Your Personnel Request #${requisitionID} for ${headcount} ${position} has been completely filled. The job listing is now closed.`,
																						referenceType: "PRF",
																						reference: requisition,
																					});
																				notificationTo_PRF_requester.save();

																				//sends notification to the HR Partner : job listing is filled and now closed
																				var notificationToHRPartner =
																					new notificationModel({
																						_id: ObjectId(),
																						receiver: HRPartnerAssigned,
																						date: curDate,
																						description: `Personnel Request Form #${requisitionID} for ${headcount} ${position} has been completely filled. The job listing is now closed.`,
																						referenceType: "PRF",
																						reference: requisition,
																					});
																				notificationToHRPartner.save();

																				console.log(
																					"successCount incremented & PRF is closed. successCount: " +
																					Number(successCount + 1) +
																					" | headcount: " +
																					headcount
																				);
																			}
																		);
																	} else {
																		PRFModel.updateOne(
																			{ requisitionID: requisitionID },
																			{
																				$set: {
																					successCount: successCount + 1,
																				},
																			},
																			function () {
																				console.log(
																					"successCount incremented. successCount: " +
																					Number(successCount + 1) +
																					" | headcount: " +
																					headcount
																				);
																			}
																		);
																	} // end of if else
																}
															); // employeeActionFormModel query
														}
													); // userModel query
												}); // PRFModel query
											}
										); // applicationsModel query
									}
								); // applicationsModel query again
							}
						); // userModel query
					}
				); // applicationsModel query
			}); // employeeActionFormModel query
		}
		if (action === "Termination") {
			employeeActionFormModel.find({}, function (err, EAF) {
				var formID = EAF.length + 1;

				offboardingModel
					.findOne({
						_id: offboardingId,
					})
					.then(offboardingData => {
						userModel
							.findOne({
								position: "Department Head",
								department: offboardingData.department,
								businessUnit: offboardingData.businessUnit,
							})
							.then(userData => {
								var receivers = [
									userData,
									offboardingData.approvalBUHead.approver,
									offboardingData.approvalCHRODDirector.approver,
								];

								userModel
									.findOne({
										_id: offboardingData.off_user_id,
										// name: offboardingData.name,
										// position: offboardingData.position,
										// department: offboardingData.department
									})
									.then(userResult => {
										console.log("userResult  !!!!!!!!!  " + userResult);

										var ActionForm = new employeeActionFormModel({
											_id: ObjectId(),
											formID: formID,
											requestDate: curDate,
											name: employeeName,
											positionTitle: employeePosition,
											department: employeeDepartment,
											businessUnit: employeeBusinessUnit,
											action: action,
											terminationReason: req.body.terminationReason,
											status: "Completed", //complete na agad
											updatedDate: curDate,
											effectiveDate: effectiveDate,
											justification: justification,
											applicationID_reference: offboardingId,
											userID_reference: userResult._id,
											// approvalHRPartner: {
											//     approver: offboardingData.approvalHR.approver,
											//     approval: "Pending"
											// },
											// approvalDHead: {
											//     approver: userData,
											//     approval: "Pending"
											// },
											// approvalBUHead: {
											//     approver: offboardingData.approvalBUHead.approver,
											//     approval: "Pending"
											// },
											// approvalCHRODDirector: {
											//     approver: offboardingData.approvalCHRODDirector.approver,
											//     approval: "Pending"
											// }
										});
										ActionForm.save().then(actionFormData => {
											// REMOVE NOTIFS
											// receivers.map(rec => {
											//     if (rec) {
											//         var notificationToApplicant_NowEmployee = new notificationModel({
											//             _id: ObjectId(),
											//             receiver: rec,
											//             date: curDate,
											//             description: `Employee Action Form for ${offboardingData.name} needs your approval before confirming termination.`,
											//             referenceType: "EAF",
											//             reference: actionFormData
											//         })
											//         notificationToApplicant_NowEmployee.save();
											//     }
											// })

											//inactive
											userModel
												.updateOne(
													{ _id: actionFormData.userID_reference },
													{
														$set: {
															userType: "Non-Employee",
															position: "None",
															department: "None",
															businessUnit: "None",
														},
													}
												)
												.then(() => console.log("working"))
												.catch(err => console.log(err));

											/**
											 * note: this is when jthe user is terminated (aka termination EAF submitted already )
											 * schedules a job that deletes data of the offboarding user
											 * 
											 * pass the user's _id
											 */
											// console.log("!!!!!!!!!!!! actionFormData.userID_reference")
											// console.log(actionFormData.userID_reference)
											Scheduler.scheduler.data_deletion_for_offboarding_employee({user_id: actionFormData.userID_reference});

											//notify yung may ari ng eaf
											userModel
												.findOne({
													_id: actionFormData.userID_reference,
												})
												.then(user => {
													var notificationForHRPartnerForTheApplication =
														new notificationModel({
															_id: ObjectId(),
															receiver: user,
															date: curDate,
															description: `Your account is no longer active.`,
															referenceType: "Termination Approved",
															reference: ActionForm,
														});
													notificationForHRPartnerForTheApplication
														.save()
														.then(result => console.log(result));
												});

											offboardingModel.updateOne(
												{ _id: offboardingId },
												{
													$set: {
														status: "Recorded",
														updatedDate: new Date(Date.now()),
													},
												},
												function () {
													res.redirect(
														`/EmployeeActionApproval/${actionFormData._id}`
													);
												}
											);
										});
									});
							});
					});
			});
		} else {
			res.redirect("back");
		}
	},

	updatePreEmploymentReqs: function (req, res) {
		try {
			var param = req.body.param;
			var value = req.body.value;
			var applicationID = req.body.applicationID;

			console.log(
				`Updated variable ${param} with Value ${value} for Application ID: ${applicationID}`
			);

			var varToChange = `pre_employment_reqs.${param}`;

			var updatedInfo = {};
			updatedInfo[varToChange] = value;

			applicationsModel
				.updateOne({ _id: ObjectId(applicationID) }, { $set: updatedInfo })
				.then(x => {
					applicationsModel
						.findOne({ _id: ObjectId(applicationID) })
						.then(applicationData => {
							var per = applicationData.pre_employment_reqs;

							// update status to "Pre-Employment Requirements Received" if all 4 PER are submitted
							if (
								per.job_offer_accepted == true &&
								per.pre_employment_forms == true &&
								per.pre_employment_medical == true &&
								per.background_investigation == true
							) {
								applicationsModel
									.updateOne(
										{ _id: ObjectId(applicationID) },
										{ $set: { status: "Pre-Employment Requirements Received" } }
									)
									.then(updatedApp => {
										res.send({ isAllTrue: true });
									});
							} else {
								applicationsModel
									.updateOne(
										{ _id: ObjectId(applicationID) },
										{ $set: { status: "Pre-Employment Requirements Pending" } }
									)
									.then(updatedApp => {
										res.send({ isAllTrue: false });
									});
							}
						});
				});
		} catch (e) {
			console.log(e);
		}
	},

	/**
	 *
	 * this action is executable after all pre-employment requirements are received by the HR.
	 * aka if application status is "Pre-Employment Requirements Received".
	 *
	 * There are 2 cases: (1) Confirm Hiring & (2) transfer
	 *      one more pala na not sure pa (3) Secondment
	 *
	 * If Confirm Hiring,
	 *  [x] update application status to "Employed"
	 *  [x] update applicant record: userType, email, position, department, businessUnit, assessmentLength
	 *  [x] notify applicant
	 *  [x] update PRF based on the (successCount:headcount)
	 *      [x] if complete/full na yung job listing, notify HR Partner & PRF Requester
	 *      [x] else just increase the successCount by 1
	 *
	 */
	CompleteApplication: async function (req, res) {
		var applicationID = req.body.applicationID;

		employeeActionFormModel
			.findOne({ applicationID_reference: applicationID })
			.then(EAFData => {
				console.log(EAFData);
				var action = EAFData.action;
				var applicationStatusUpdate = {};
				switch (action) {
					case "Confirm Hiring":
						applicationStatusUpdate = { status: "Employed" };
						break;

					case "Transfer":
						applicationStatusUpdate = { status: "Transferred" };
						break;

					case "Secondment":
						break;
				}

				applicationsModel.updateOne(
					{ _id: ObjectId(applicationID) },
					{ $set: applicationStatusUpdate },
					function () {
						//retrieves data from application to update record of the userModel of the applicant
						applicationsModel.findOne(
							{ _id: ObjectId(applicationID) },
							function (err, ApplicationData) {
								PRFModel.findOne({
									requisitionID: ApplicationData.requisition_id,
								}).then(requisition => {
									var user_ID = ApplicationData.user._id;
									var Applicant_object = ApplicationData.user;
									var newCompanyEmail = `${ApplicationData.user.firstName
										.split(" ")
										.join("")}.${ApplicationData.user.lastName
											.split(" ")
											.join("")}@leoniogroup.com`;
									var position = requisition.positionTitle;
									var department = requisition.department;
									var businessUnit = requisition.businessUnit;
									var employmentType = requisition.employmentType;
									var assessmentLength = {
										year: requisition.assessmentLength.years,
										month: requisition.assessmentLength.months,
									};

									var HRPartnerAssigned =
										requisition.approvalHRPartner.approver;
									var successCount = requisition.successCount;
									var headcount = requisition.headcount;
									var requisitionID = requisition.requisitionID;
									var PRF_createdBy = requisition.createdBy;

									console.log(
										`updated data ${newCompanyEmail} ${position} ${department} ${businessUnit} ${employmentType} ${assessmentLength} `
									);

									// updates user record with the position and stuff
									userModel.updateOne(
										{ _id: ObjectId(user_ID) },
										{
											$set: {
												userType: "Employee",
												email: newCompanyEmail,
												position: position,
												department: department,
												businessUnit: businessUnit,
												assessmentLength: assessmentLength,
											},
										},
										function () {
											console.log("abot pa here earlu");

											employeeActionFormModel.findOne(
												{ applicationID_reference: applicationID },
												function (err, EAFData) {
													var curDate = new Date(Date.now());
													// curDate = new Date(YYYYMMDDtoDate(curDate));
													var effectiveDate = EAFData.effectiveDate;

													//sends notification to the applicant, saying they are accepted.
													var notificationToApplicant_NowEmployee =
														new notificationModel({
															_id: ObjectId(),
															receiver: Applicant_object,
															date: curDate,
															description: `Congrats! You are now accepted as a ${position} employee at ${businessUnit}! Your new company email is ${newCompanyEmail}. This is effective on ${effectiveDate.toLocaleDateString()}`,
															referenceType: "None",
															task: "None",
														});
													notificationToApplicant_NowEmployee.save();

													// check all current skill setups
													// for each skill setup, check if the new employee matches the BU Dept and Position

													skillSetupModel.find(
														{
															skillPositionTitle: position,
															skillDepartment: department,
															skillBusinessUnit: businessUnit,
														},
														function (skillSetupErr, skillSetupData) {
															if (skillSetupErr)
																return console.error(skillSetupErr);
															const dateNow = new Date();
															skillSetupData.forEach(skill => {
																const expirationDate = new Date(
																	skill.expireDate
																);
																// console.log("skillSetupData");
																// console.log(skillSetupData);
																// console.log("dateNow");
																// console.log(dateNow);
																// console.log("expirationDate");
																// console.log(expirationDate);
																// if the skill setup is not yet expired
																if (dateNow < expirationDate) {
																	// send notification to user
																	skill.dates.map(date => {
																		var notifications = new notificationModel({
																			_id: new ObjectId(),
																			receiver: Applicant_object,
																			isSeen: false,
																			description: `You need to answer the skills assessment form`,
																			date,
																			referenceType:
																				"Answer Assessment Form Employee",
																			reference: skill,
																			task: "Answer Skills Assessment",
																		});
																		notifications
																			.save()
																			.then(() =>
																				console.log(
																					"sent to",
																					Applicant_object.firstName,
																					skill
																				)
																			);
																	});
																}
															});
														}
													);

													// check all current cycle goals
													// for each cycle goal, check if the newly transferred employee matches the BU Dept and Position
													goalCycleModel.find(
														{ position, department, businessUnit },
														function (cycleGoalsErr, cycleGoalsData) {
															if (cycleGoalsErr)
																return console.error(cycleGoalsErr);
															const dateNow = new Date();
															dateNow.setDate(dateNow.getDate() - 1);
															cycleGoalsData.forEach(cycle => {
																cycle.dates.map(date => {
																	if (dateNow < date) {
																		const notifToAnswerAppraisal =
																			new notificationModel({
																				_id: ObjectId(),
																				receiver: Applicant_object,
																				date: new Date(date),
																				description: `Please answer the Performance Appraisal. Click this notification to be redirected to the form.`,
																				referenceType: "Performance Appraisal",
																				reference: cycle,
																				task: "Answer Performance Appraisal",
																			});
																		notifToAnswerAppraisal
																			.save()
																			.then(() =>
																				console.log(
																					"sent to",
																					Applicant_object.firstName,
																					cycle
																				)
																			);
																	}
																});
															});
														}
													);
													// console.log(
													// 	`"abot pa here" sc ${successCount} hc ${headcount}`
													// );

													/**
													 * if successCount+1 reached the headcount, it means all slots are filled na, so close the job listing.
													 * else, just increment the successCount by 1.
													 */
													if (successCount + 1 >= headcount) {
														console.log("headcount reached na after this");

														PRFModel.updateOne(
															{ requisitionID: requisitionID },
															{
																$set: {
																	successCount: successCount + 1,
																	status: "Closed",
																	closeDate: new Date(),
																},
															},
															function () {

																/**
																 * note: this is when job closes after accepting a "confirm hiring"
																 * 
																 * schedules a job that deletes unaccepted applicants after a certain period of closing. 
																 * does not affect users that has applied to another job later that their application to the closed job
																 * 
																 * pass the requisitionID
																 */
																Scheduler.scheduler.data_deletion_for_inactive_applicants(requisitionID);


																//sends notification to the requester of the PRF : job listing is filled and now closed
																var notificationTo_PRF_requester =
																	new notificationModel({
																		_id: ObjectId(),
																		receiver: PRF_createdBy,
																		date: curDate,
																		description: `Your Personnel Request #${requisitionID} for ${headcount} ${position} has been completely filled. The job listing is now closed.`,
																		referenceType: "PRF",
																		reference: requisition,
																		task: "None",
																	});
																notificationTo_PRF_requester.save();

																//sends notification to the HR Partner : job listing is filled and now closed
																var notificationToHRPartner =
																	new notificationModel({
																		_id: ObjectId(),
																		receiver: HRPartnerAssigned,
																		date: curDate,
																		description: `Personnel Request Form #${requisitionID} for ${headcount} ${position} has been completely filled. The job listing is now closed.`,
																		referenceType: "PRF",
																		reference: requisition,
																		task: "None",
																	});
																notificationToHRPartner.save();

																console.log(
																	"successCount incremented & PRF is closed. successCount: " +
																	Number(successCount + 1) +
																	" | headcount: " +
																	headcount
																);
															}
														);
													} else {
														console.log("headcount not reached yet");
														PRFModel.updateOne(
															{ requisitionID: requisitionID },
															{
																$set: {
																	successCount: successCount + 1,
																},
															},
															function () {
																console.log(
																	"successCount incremented. successCount: " +
																	Number(successCount + 1) +
																	" | headcount: " +
																	headcount
																);
															}
														);
													}
												}
											);
										}
									);
								});
							}
						);
					}
				);
			});

		res.redirect("back");
	},

	// sends applicant data inside applicationsModel.
	// used for Employee Action Form > Recruitment via JS
	getApplicantInfoOnly: function (req, res) {
		var applicationID = req.params.applicationID;

		applicationsModel.findOne(
			{ _id: applicationID },
			function (err, applicationData) {
				if (err) throw err;

				var applicantData = applicationData.user;

				res.send(applicantData);
			}
		);
	},

	getPRFData: function (req, res) {
		var requisitionID = req.params.requisitionID;

		PRFModel.findOne({ requisitionID: requisitionID }, function (err, PRFData) {
			res.send(PRFData);
		});
	},

	// sends
	getPossibleInterviewerOptions: function (req, res) {
		var requisitionID = req.params.requisitionID;
		var approverVariables =
			"_id email firstName lastName businessUnit department position";

		PRFModel.findOne(
			{ requisitionID: requisitionID },
			function (err, PRF_Data) {
				var PRF_businessUnit = PRF_Data.businessUnit;
				var PRF_department = PRF_Data.department;
				var PRF_position = PRF_Data.position;

				userModel.find(
					{
						$or: [
							{
								department:
									"Corporate Human Resource & Organization Department",
							},
							{
								businessUnit: PRF_businessUnit,
								department: PRF_department,
								position: "Department Head",
							},
							{
								businessUnit: PRF_businessUnit,
								position: "Business Unit Head",
							},
						],
					},
					approverVariables,
					function (err, possibleUsers) {
						res.send(possibleUsers);
					}
				);
			}
		);
	},

};

module.exports = ApplicantApprovalController;

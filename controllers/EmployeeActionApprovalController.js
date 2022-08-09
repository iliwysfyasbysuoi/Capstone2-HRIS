const { ObjectId } = require("mongodb");
const applicationsModel = require("../models/applicationsModel.js");
const employeeActionFormModel = require("../models/employeeActionFormModel.js");
const notificationModel = require("../models/notificationModel.js");
const userModel = require("../models/userModel.js");

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

const EmployeeActionApprovalController = {
	EmployeeActionIndividual: function (req, res) {
		var EAF_id = req.params._id;

		employeeActionFormModel.findOne(
			{ _id: ObjectId(EAF_id) },
			function (err, EmployeeActionData) {
				res.render("pages/EmployeeActionApprovalPage", {
					EmployeeActionData: EmployeeActionData,
				});
			}
		);
	},

	getNextEAFID: function (req, res) {
		employeeActionFormModel.find({}, function (err, result) {
			var recordCount = result.length + 1;
			recordCount = recordCount.toString();

			res.send(recordCount);
		});
	},

	approve_EAF: function (req, res) {
		var sessionPosition = req.body.sessionPosition;
		var EAF_id = req.body.EAF_id;
		var action = req.body.action;
		var curDate = new Date(Date.now());

		// curDate = new Date(YYYYMMDDtoDate(curDate));

		// console.log (`${sessionPosition} ${EAF_id}`);

		switch (sessionPosition) {
			case "HR Supervisor":
				// code block

				employeeActionFormModel.updateOne(
					{ _id: ObjectId(EAF_id) },
					{ $set: { "approvalHRPartner.approval": "Approved" } },
					function () {
						employeeActionFormModel.findOne(
							{ _id: ObjectId(EAF_id) },
							function (err, updatedEAFData) {
								var HRSupervisorApproval =
									updatedEAFData.approvalHRPartner.approval;
								var DHeadApproval = updatedEAFData.approvalDHead.approval;
								var BUHeadApproval = updatedEAFData.approvalBUHead.approval;
								var CHRODDirectorApproval =
									updatedEAFData.approvalCHRODDirector.approval;

								// if fully approved na
								if (
									HRSupervisorApproval == "Approved" &&
									DHeadApproval == "Approved" &&
									BUHeadApproval == "Approved" &&
									CHRODDirectorApproval == "Approved"
								) {
									// code for complete approvals
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is fully approved. Finish employment.`,
														referenceType: "Application",
														reference: ApplicationData,
													});
												notificationForHRPartnerForTheApplication.save();

												//update application record status to "Employee Action Fully Approved" to let hr know
												applicationsModel.updateOne(
													{
														_id: ObjectId(
															updatedEAFData.applicationID.reference
														),
													},
													{
														$set: { status: "Employee Action Fully Approved" },
													},
													function () {
														// sets EAF status to "approved" since fully approved na siya
														employeeActionFormModel.updateOne(
															{ _id: ObjectId(EAF_id) },
															{ $set: { status: "Approved" } },
															function () {
																res.redirect("back");
															}
														);
													}
												);
											}
										);
									} else if (action == "Termination") {
										employeeActionFormModel
											.updateOne(
												{ _id: EAF_id },
												{ $set: { status: "Completed" } }
											)
											.then(() => console.log("changed"));

										employeeActionFormModel
											.findOne({ _id: EAF_id })
											.then(eafData => {
												//inactive
												userModel
													.updateOne(
														{ _id: eafData.userID_reference },
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

												//notify hr sp
												userModel
													.findOne({
														position: "HR Supervisor",
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Employee Action for ${eafData.name} has been fully approved`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});

												//notify yung may ari ng eaf
												userModel
													.findOne({
														_id: eafData.userID_reference,
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Your account is no longer active.`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});
											});

										res.redirect("back");
									} else {
										res.redirect("back");
									}
								}
								// else if not fully approved.
								else {
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is approved by HR Supervisor. `,
														referenceType: "EAF",
														reference: updatedEAFData,
													});
												notificationForHRPartnerForTheApplication.save();

												res.redirect("back");
											}
										);
									} else if (action == "ACTION_HERE") {
									} else {
										res.redirect("back");
									}
								}
							}
						);
					}
				);

				break;
			case "Department Head":
				// code block
				employeeActionFormModel.updateOne(
					{ _id: ObjectId(EAF_id) },
					{ $set: { "approvalDHead.approval": "Approved" } },
					function () {
						employeeActionFormModel.findOne(
							{ _id: ObjectId(EAF_id) },
							function (err, updatedEAFData) {
								var HRSupervisorApproval =
									updatedEAFData.approvalHRPartner.approval;
								var DHeadApproval = updatedEAFData.approvalDHead.approval;
								var BUHeadApproval = updatedEAFData.approvalBUHead.approval;
								var CHRODDirectorApproval =
									updatedEAFData.approvalCHRODDirector.approval;

								// if fully approved na
								if (
									HRSupervisorApproval == "Approved" &&
									DHeadApproval == "Approved" &&
									BUHeadApproval == "Approved" &&
									CHRODDirectorApproval == "Approved"
								) {
									// code for complete approvals
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is fully approved. Finish employment.`,
														referenceType: "Application",
														reference: ApplicationData,
													});
												notificationForHRPartnerForTheApplication.save();

												//update application record status to "Employee Action Fully Approved" to let hr know
												applicationsModel.updateOne(
													{
														_id: ObjectId(
															updatedEAFData.applicationID.reference
														),
													},
													{
														$set: { status: "Employee Action Fully Approved" },
													},
													function () {
														// sets EAF status to "approved" since fully approved na siya
														employeeActionFormModel.updateOne(
															{ _id: ObjectId(EAF_id) },
															{ $set: { status: "Approved" } },
															function () {
																res.redirect("back");
															}
														);
													}
												);
											}
										);
									} else if (action == "Termination") {
										employeeActionFormModel
											.updateOne(
												{ _id: EAF_id },
												{ $set: { status: "Completed" } }
											)
											.then(() => console.log("changed"));

										employeeActionFormModel
											.findOne({ _id: EAF_id })
											.then(eafData => {
												userModel
													.updateOne(
														{ _id: eafData.userID_reference },
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

												userModel
													.findOne({
														position: "HR Supervisor",
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Employee Action for ${eafData.name} has been fully approved`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});

												userModel
													.findOne({
														_id: eafData.userID_reference,
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Your account is no longer active.`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});
											});

										res.redirect("back");
									} else {
										res.redirect("back");
									}
								}
								// else if not fully approved.
								else {
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is approved by Department Head. `,
														referenceType: "EAF",
														reference: updatedEAFData,
													});
												notificationForHRPartnerForTheApplication.save();

												res.redirect("back");
											}
										);
									} else if (action == "ACTION_HERE") {
									} else {
										res.redirect("back");
									}
								}
							}
						);
					}
				);

				break;
			case "Business Unit Head":
				// code block
				employeeActionFormModel.updateOne(
					{ _id: ObjectId(EAF_id) },
					{ $set: { "approvalBUHead.approval": "Approved" } },
					function () {
						employeeActionFormModel.findOne(
							{ _id: ObjectId(EAF_id) },
							function (err, updatedEAFData) {
								var HRSupervisorApproval =
									updatedEAFData.approvalHRPartner.approval;
								var DHeadApproval = updatedEAFData.approvalDHead.approval;
								var BUHeadApproval = updatedEAFData.approvalBUHead.approval;
								var CHRODDirectorApproval =
									updatedEAFData.approvalCHRODDirector.approval;

								// if fully approved na
								if (
									HRSupervisorApproval == "Approved" &&
									DHeadApproval == "Approved" &&
									BUHeadApproval == "Approved" &&
									CHRODDirectorApproval == "Approved"
								) {
									// code for complete approvals
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is fully approved. Finish employment.`,
														referenceType: "Application",
														reference: ApplicationData,
													});
												notificationForHRPartnerForTheApplication.save();

												//update application record status to "Employee Action Fully Approved" to let hr know
												applicationsModel.updateOne(
													{
														_id: ObjectId(
															updatedEAFData.applicationID_reference
														),
													},
													{
														$set: { status: "Employee Action Fully Approved" },
													},
													function () {
														// sets EAF status to "approved" since fully approved na siya
														employeeActionFormModel.updateOne(
															{ _id: ObjectId(EAF_id) },
															{ $set: { status: "Approved" } },
															function () {
																res.redirect("back");
															}
														);
													}
												);
											}
										);
									} else if (action == "Termination") {
										employeeActionFormModel
											.updateOne(
												{ _id: EAF_id },
												{ $set: { status: "Completed" } }
											)
											.then(() => console.log("changed"));

										employeeActionFormModel
											.findOne({ _id: EAF_id })
											.then(eafData => {
												userModel
													.updateOne(
														{ _id: eafData.userID_reference },
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

												userModel
													.findOne({
														position: "HR Supervisor",
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Employee Action for ${eafData.name} has been fully approved`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});

												userModel
													.findOne({
														_id: eafData.userID_reference,
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Your account is no longer active.`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});
											});

										res.redirect("back");
									} else {
										res.redirect("back");
									}
								}
								// else if not fully approved.
								else {
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is approved by Business Unit Head. `,
														referenceType: "EAF",
														reference: updatedEAFData,
													});
												notificationForHRPartnerForTheApplication.save();

												res.redirect("back");
											}
										);
									} else if (action == "ACTION_HERE") {
									} else {
										res.redirect("back");
									}
								}
							}
						);
					}
				);

				break;
			case "Department Director":
				// code block
				employeeActionFormModel.updateOne(
					{ _id: ObjectId(EAF_id) },
					{ $set: { "approvalCHRODDirector.approval": "Approved" } },
					function () {
						employeeActionFormModel.findOne(
							{ _id: ObjectId(EAF_id) },
							function (err, updatedEAFData) {
								var HRSupervisorApproval =
									updatedEAFData.approvalHRPartner.approval;
								var DHeadApproval = updatedEAFData.approvalDHead.approval;
								var BUHeadApproval = updatedEAFData.approvalBUHead.approval;
								var CHRODDirectorApproval =
									updatedEAFData.approvalCHRODDirector.approval;

								// if fully approved na
								if (
									HRSupervisorApproval == "Approved" &&
									DHeadApproval == "Approved" &&
									BUHeadApproval == "Approved" &&
									CHRODDirectorApproval == "Approved"
								) {
									// code for complete approvals
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is fully approved. Finish employment.`,
														referenceType: "Application",
														reference: ApplicationData,
													});
												notificationForHRPartnerForTheApplication.save();

												//update application record status to "Employee Action Fully Approved" to let hr know
												applicationsModel.updateOne(
													{
														_id: ObjectId(
															updatedEAFData.applicationID_reference
														),
													},
													{
														$set: { status: "Employee Action Fully Approved" },
													},
													function () {
														// sets EAF status to "approved" since fully approved na siya
														employeeActionFormModel.updateOne(
															{ _id: ObjectId(EAF_id) },
															{ $set: { status: "Approved" } },
															function () {
																res.redirect("back");
															}
														);
													}
												);
											}
										);
									} else if (action == "Termination") {
										employeeActionFormModel
											.updateOne(
												{ _id: EAF_id },
												{ $set: { status: "Completed" } }
											)
											.then(() => console.log("changed"));

										employeeActionFormModel
											.findOne({ _id: EAF_id })
											.then(eafData => {
												userModel
													.updateOne(
														{ _id: eafData.userID_reference },
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

												userModel
													.findOne({
														position: "HR Supervisor",
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Employee Action for ${eafData.name} has been fully approved`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});

												userModel
													.findOne({
														_id: eafData.userID_reference,
													})
													.then(user => {
														var notificationForHRPartnerForTheApplication =
															new notificationModel({
																_id: ObjectId(),
																receiver: user,
																date: curDate,
																description: `Your account is no longer active.`,
																referenceType: "Termination Approved",
																reference: eafData,
															});
														notificationForHRPartnerForTheApplication
															.save()
															.then(result => console.log(result));
													});
											});
										res.redirect("back");
									} else {
										res.redirect("back");
									}
								}
								// else if not fully approved.
								else {
									if (
										action == "Confirm Regular Employment" ||
										action == "Transfer"
									) {
										applicationsModel.findOne(
											{ _id: ObjectId(updatedEAFData.applicationID_reference) },
											function (err, ApplicationData) {
												var HRPartnerForTheApplication =
													ApplicationData.requisition.approvalHRPartner
														.approver;
												var notificationForHRPartnerForTheApplication =
													new notificationModel({
														_id: ObjectId(),
														receiver: HRPartnerForTheApplication,
														date: curDate,
														description: `Employee Action Form for Applicant ${updatedEAFData.name} is approved by Department Director. `,
														referenceType: "EAF",
														reference: updatedEAFData,
													});
												notificationForHRPartnerForTheApplication.save();

												res.redirect("back");
											}
										);
									} else if (action == "ACTION_HERE") {
									} else {
										res.redirect("back");
									}
								}
							}
						);
					}
				);

				break;
			default:
			// code block
		}
	},

	disapprove_EAF: function (req, res) {
		var sessionPosition = req.body.sessionPosition;
		var EAF_id = req.body.EAF_id;
		var action = req.body.action;
		var curDate = new Date(Date.now());
		// curDate = new Date(YYYYMMDDtoDate(curDate));

		if (action === "Termination") {
			switch (sessionPosition) {
				case "HR Supervisor":
					employeeActionFormModel
						.updateOne(
							{ _id: ObjectId(EAF_id) },
							{
								$set: {
									"approvalHRPartner.approval": "Disapproved",
									status: "Disapproved",
								},
							}
						)
						.then(() => console.log("updated"));

					employeeActionFormModel.findOne(
						{ _id: ObjectId(EAF_id) },
						function (err, updatedEAFData) {
							// mark Application as disapproved
							// var notificationForHRPartnerForTheApplication = new notificationModel({
							//     _id: ObjectId(),
							//     receiver: updatedEAFData.approvalHRPartner.approver,
							//     date: curDate,
							//     description: `Employee Action Form for ${updatedEAFData.name} has been disapproved.`,
							//     referenceType: "Termination",
							//     reference: updatedEAFData
							// })
							// notificationForHRPartnerForTheApplication.save();

							userModel
								.findOne({
									_id: updatedEAFData.userID_reference,
								})
								.then(userData => {
									console.log(userData, "wasdfawefawesd");
									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: userData,
											date: curDate,
											description: `Your Employee Action Form has been disapproved by ${req.session.name}.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication.save();
								});
						}
					);
					break;
				case "Business Unit Head":
					// code block
					employeeActionFormModel.updateOne(
						{ _id: ObjectId(EAF_id) },
						{
							$set: {
								"approvalBUHead.approval": "Disapproved",
								status: "Disapproved",
							},
						},
						function () {
							employeeActionFormModel.findOne(
								{ _id: ObjectId(EAF_id) },
								function (err, updatedEAFData) {
									// mark Application as disapproved
									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: updatedEAFData.approvalHRPartner.approver,
											date: curDate,
											description: `Employee Action Form for ${updatedEAFData.name} has been disapproved by ${req.session.name}.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication
										.save()
										.then(data => console.log(data));

									userModel
										.findOne({
											_id: updatedEAFData.userID_reference,
										})
										.then(userData => {
											console.log(userData, "wasdfawefawesd");
											var notificationForHRPartnerForTheApplication =
												new notificationModel({
													_id: ObjectId(),
													receiver: userData,
													date: curDate,
													description: `Your Employee Action Form has been disapproved by ${req.session.name}.`,
													referenceType: "Termination",
													reference: updatedEAFData,
												});
											notificationForHRPartnerForTheApplication.save();
										});
								}
							);
						}
					);
					break;

				case "Department Head":
					// code block
					employeeActionFormModel.updateOne(
						{ _id: ObjectId(EAF_id) },
						{
							$set: {
								"approvalDHead.approval": "Disapproved",
								status: "Disapproved",
							},
						},
						function () {
							employeeActionFormModel.findOne(
								{ _id: ObjectId(EAF_id) },
								function (err, updatedEAFData) {
									// mark Application as disapproved
									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: updatedEAFData.approvalHRPartner.approver,
											date: curDate,
											description: `Employee Action Form for ${updatedEAFData.name} has been disapproved by ${req.session.name}.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication.save();

									userModel
										.findOne({
											_id: updatedEAFData.userID_reference,
										})
										.then(userData => {
											console.log(userData, "wasdfawefawesd");
											var notificationForHRPartnerForTheApplication =
												new notificationModel({
													_id: ObjectId(),
													receiver: userData,
													date: curDate,
													description: `Your Employee Action Form has been disapproved by ${req.session.name}.`,
													referenceType: "Termination",
													reference: updatedEAFData,
												});
											notificationForHRPartnerForTheApplication.save();
										});
								}
							);
						}
					);
					break;

				case "Department Director":
					// code block
					employeeActionFormModel.updateOne(
						{ _id: ObjectId(EAF_id) },
						{
							$set: {
								"approvalCHRODDirector.approval": "Disapproved",
								status: "Disapproved",
							},
						},
						function () {
							employeeActionFormModel.findOne(
								{ _id: ObjectId(EAF_id) },
								function (err, updatedEAFData) {
									// mark Application as disapproved
									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: updatedEAFData.approvalHRPartner.approver,
											date: curDate,
											description: `Employee Action Form for ${updatedEAFData.name} has been disapproved by ${req.session.name}.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication.save();

									userModel
										.findOne({
											_id: updatedEAFData.userID_reference,
										})
										.then(userData => {
											console.log(userData, "wasdfawefawesd");
											var notificationForHRPartnerForTheApplication =
												new notificationModel({
													_id: ObjectId(),
													receiver: userData,
													date: curDate,
													description: `Your Employee Action Form has been disapproved by ${req.session.name}.`,
													referenceType: "Termination",
													reference: updatedEAFData,
												});
											notificationForHRPartnerForTheApplication.save();
										});
								}
							);
						}
					);
			}
			res.redirect("back");
		} else {
			switch (sessionPosition) {
				case "HR Supervisor":
					// code block
					employeeActionFormModel.updateOne(
						{ _id: ObjectId(EAF_id) },
						{
							$set: {
								"approvalHRPartner.approval": "Disapproved",
								status: "Disapproved",
							},
						},
						function () {
							employeeActionFormModel.findOne(
								{ _id: ObjectId(EAF_id) },
								function (err, updatedEAFData) {
									// mark Application as disapproved

									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: updatedEAFData.approvalHRPartner.approver,
											date: curDate,
											description: `Employee Action Form for ${updatedEAFData.name} has been disapproved.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication.save();

									applicationsModel.updateOne(
										{ _id: ObjectId(updatedEAFData.applicationID_reference) },
										{ $set: { status: "Disapproved" } },
										function () {
											applicationsModel.findOne(
												{
													_id: ObjectId(updatedEAFData.applicationID_reference),
												},
												function (err, ApplicationData) {
													// notification For  hRPartner For The Application
													var HRPartnerForTheApplication =
														ApplicationData.requisition.approvalHRPartner
															.approver;
													var notificationForHRPartnerForTheApplication =
														new notificationModel({
															_id: ObjectId(),
															receiver: HRPartnerForTheApplication,
															date: curDate,
															description: `Employee Action Form for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The application is now disapproved. `,
															referenceType: "Application",
															reference: ApplicationData,
														});
													notificationForHRPartnerForTheApplication.save();

													// notification for applicant
													var applicant = ApplicationData.user;
													var notificationApplicant = new notificationModel({
														_id: ObjectId(),
														receiver: applicant,
														date: curDate,
														description: `We are sorry to inform you that your Application for the ${ApplicationData.requisition.positionTitle} position has been disapproved. `,
														referenceType: "None",
													});
													notificationApplicant.save();

													res.redirect("back");
												}
											);
										}
									);
								}
							);
						}
					);

					break;
				case "Department Head":
					// code block

					employeeActionFormModel.updateOne(
						{ _id: ObjectId(EAF_id) },
						{
							$set: {
								"approvalDHead.approval": "Disapproved",
								status: "Disapproved",
							},
						},
						function () {
							employeeActionFormModel.findOne(
								{ _id: ObjectId(EAF_id) },
								function (err, updatedEAFData) {
									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: updatedEAFData.approvalHRPartner.approver,
											date: curDate,
											description: `Employee Action Form for ${updatedEAFData.name} has been disapproved.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication.save();
									// mark Application as disapproved
									applicationsModel.updateOne(
										{ _id: ObjectId(updatedEAFData.applicationID_reference) },
										{ $set: { status: "Disapproved" } },
										function () {
											applicationsModel.findOne(
												{
													_id: ObjectId(updatedEAFData.applicationID_reference),
												},
												function (err, ApplicationData) {
													// notification For  hRPartner For The Application
													var HRPartnerForTheApplication =
														ApplicationData.requisition.approvalHRPartner
															.approver;
													var notificationForHRPartnerForTheApplication =
														new notificationModel({
															_id: ObjectId(),
															receiver: HRPartnerForTheApplication,
															date: curDate,
															description: `Employee Action Form for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The application is now disapproved. `,
															referenceType: "Application",
															reference: ApplicationData,
														});
													notificationForHRPartnerForTheApplication.save();

													// notification for applicant
													var applicant = ApplicationData.user;
													var notificationApplicant = new notificationModel({
														_id: ObjectId(),
														receiver: applicant,
														date: curDate,
														description: `We are sorry to inform you that your Application for the ${ApplicationData.requisition.positionTitle} position has been disapproved. `,
														referenceType: "None",
													});
													notificationApplicant.save();

													res.redirect("back");
												}
											);
										}
									);
								}
							);
						}
					);

					break;
				case "Business Unit Head":
					// code block
					employeeActionFormModel.updateOne(
						{ _id: ObjectId(EAF_id) },
						{
							$set: {
								"approvalBUHead.approval": "Disapproved",
								status: "Disapproved",
							},
						},
						function () {
							employeeActionFormModel.findOne(
								{ _id: ObjectId(EAF_id) },
								function (err, updatedEAFData) {
									// mark Application as disapproved
									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: updatedEAFData.approvalHRPartner.approver,
											date: curDate,
											description: `Employee Action Form for ${updatedEAFData.name} has been disapproved.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication.save();
									applicationsModel.updateOne(
										{ _id: ObjectId(updatedEAFData.applicationID_reference) },
										{ $set: { status: "Disapproved" } },
										function () {
											applicationsModel.findOne(
												{
													_id: ObjectId(updatedEAFData.applicationID_reference),
												},
												function (err, ApplicationData) {
													// notification For  hRPartner For The Application
													var HRPartnerForTheApplication =
														ApplicationData.requisition.approvalHRPartner
															.approver;
													var notificationForHRPartnerForTheApplication =
														new notificationModel({
															_id: ObjectId(),
															receiver: HRPartnerForTheApplication,
															date: curDate,
															description: `Employee Action Form for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The application is now disapproved. `,
															referenceType: "Application",
															reference: ApplicationData,
														});
													notificationForHRPartnerForTheApplication.save();

													// notification for applicant
													var applicant = ApplicationData.user;
													var notificationApplicant = new notificationModel({
														_id: ObjectId(),
														receiver: applicant,
														date: curDate,
														description: `We are sorry to inform you that your Application for the ${ApplicationData.requisition.positionTitle} position has been disapproved. `,
														referenceType: "None",
													});
													notificationApplicant.save();

													res.redirect("back");
												}
											);
										}
									);
								}
							);
						}
					);

					break;
				case "Department Director":
					employeeActionFormModel.updateOne(
						{ _id: ObjectId(EAF_id) },
						{
							$set: {
								"approvalCHRODDirector.approval": "Disapproved",
								status: "Disapproved",
							},
						},
						function () {
							employeeActionFormModel.findOne(
								{ _id: ObjectId(EAF_id) },
								function (err, updatedEAFData) {
									// mark Application as disapproved
									var notificationForHRPartnerForTheApplication =
										new notificationModel({
											_id: ObjectId(),
											receiver: updatedEAFData.approvalHRPartner.approver,
											date: curDate,
											description: `Employee Action Form for ${updatedEAFData.name} has been disapproved.`,
											referenceType: "Termination",
											reference: updatedEAFData,
										});
									notificationForHRPartnerForTheApplication.save();
									applicationsModel.updateOne(
										{ _id: ObjectId(updatedEAFData.applicationID_reference) },
										{ $set: { status: "Disapproved" } },
										function () {
											applicationsModel.findOne(
												{
													_id: ObjectId(updatedEAFData.applicationID_reference),
												},
												function (err, ApplicationData) {
													// notification For  hRPartner For The Application
													var HRPartnerForTheApplication =
														ApplicationData.requisition.approvalHRPartner
															.approver;
													var notificationForHRPartnerForTheApplication =
														new notificationModel({
															_id: ObjectId(),
															receiver: HRPartnerForTheApplication,
															date: curDate,
															description: `Employee Action Form for Applicant ${ApplicationData.user.firstName} ${ApplicationData.user.lastName} has been disapproved. The application is now disapproved. `,
															referenceType: "Application",
															reference: ApplicationData,
														});
													notificationForHRPartnerForTheApplication.save();

													// notification for applicant
													var applicant = ApplicationData.user;
													var notificationApplicant = new notificationModel({
														_id: ObjectId(),
														receiver: applicant,
														date: curDate,
														description: `We are sorry to inform you that your Application for the ${ApplicationData.requisition.positionTitle} position has been disapproved. `,
														referenceType: "None",
													});
													notificationApplicant.save();

													res.redirect("back");
												}
											);
										}
									);
								}
							);
						}
					);

					break;

				default:
				// code block
			}
		}
	},
};

module.exports = EmployeeActionApprovalController;

const { ObjectId } = require("bson");
const PRFModel = require("../../models/PRFModel.js");
const userModel = require("../../models/userModel.js");
const notificationModel = require("../../models/notificationModel.js");
const positionsModel = require("../../models/positionsModel.js");

// converts date string yyyy-mm-dd to Date data
// function YYYYMMDDtoDate(date) {
// 	var sendDate =
// 		date.getFullYear() +
// 		"-" +
// 		(date.getMonth() + 1) +
// 		"-" +
// 		("0" + date.getDate()).slice(-2) +
// 		"T" +
// 		("0" + date.getHours()).slice(-2) +
// 		":" +
// 		("0" + date.getMinutes()).slice(-2) +
// 		":" +
// 		("0" + date.getSeconds()).slice(-2) +
// 		".000+08:00";

// 	return sendDate;
// }

function updateApproval(status, id, position, disappoveContent, res) {
	if (status == "Approving") {
		PRFModel.findOneAndUpdate(
			{ requisitionID: id },
			{ $set: position },
			function (err, PRFresult) {
				// find the PRF and check if all approves.
				PRFModel.findOne({ requisitionID: id }, function (err, PRFupdated) {
					// console.log(id
					//     + PRFupdated.approvalBUHead.approval
					//     + PRFupdated.approvalDHead.approval
					//     + PRFupdated.approvalHRPartner.approval
					//     + PRFupdated.approvalCHRODDirector.approval
					//     + PRFupdated.approvalCHRODHead.approval)

					if (
						PRFupdated.approvalBUHead.approval == "Approved" &&
						PRFupdated.approvalDHead.approval == "Approved" &&
						PRFupdated.approvalHRPartner.approval == "Approved" &&
						PRFupdated.approvalCHRODDirector.approval == "Approved" &&
						PRFupdated.approvalCHRODHead.approval == "Approved"
					) {
						var curDate = new Date(Date.now());
						// var approvedDate = new Date(YYYYMMDDtoDate(curDate));
						var approvedDate = curDate;
						// sets PRF status to "Approved" and sets approvedDate to date today.
						PRFModel.updateOne(
							{ requisitionID: id },
							{ $set: { status: "Approved", approvedDate: approvedDate } },
							function () {
								// notify HRPartner if PRF is fully approved na
								notifications = new notificationModel({
									_id: new ObjectId(),
									receiver: PRFupdated.approvalHRPartner.approver,
									isSeen: false,
									description: `Personnel Requisition #${id} is fully approved and ready for listing.`,
									date: approvedDate,
									referenceType: "PRF",
									reference: PRFresult,
									task: "List Job Vacancy",
								});
								notifications.save();

								res.redirect("back");
							}
						);
					} else {
						console.log("trigger else");
						res.redirect("back");
					}
				});
			}
		);
	} else {
		console.log("position " + JSON.stringify(position));
		PRFModel.findOne({ requisitionID: id }, function (err, PRFresult) {
			PRFModel.updateOne(
				{ requisitionID: id },
				{ $set: position },
				function () {
					console.log("up");
					var curDate = new Date(Date.now());
					// var createdDate = new Date(YYYYMMDDtoDate(curDate));
					var createdDate = curDate;

					notifications = new notificationModel({
						_id: new ObjectId(),
						receiver: PRFresult.approvalHRPartner.approver,
						isSeen: false,
						description: `Personnel Requisition #${id} has been disapproved by ${disappoveContent.name} from ${disappoveContent.department} of ${disappoveContent.businessUnit}`,
						date: createdDate,
						referenceType: "PRF",
						reference: PRFresult,
					});
					notifications.save();

					res.redirect("back");
				}
			);
		});
	}
}

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

const PRFController = {
	PRFTracker: function (req, res) {
		var userEmail = req.session.email;
		var userBU = req.session.businessUnit;
		var userDep = req.session.department;
		var userPosition = req.session.position;

		// if CHROD Director or Head, or hr supervisor, send All.
		if (
			(userDep == "Corporate Human Resource & Organization Department" &&
				userPosition == "Department Director") ||
			(userDep == "Corporate Human Resource & Organization Department" &&
				userPosition == "Department Head") ||
			(userDep == "Corporate Human Resource & Organization Department" &&
				userPosition == "HR Assistant Manager") || (userPosition == "HR Supervisor")
		) {
			PRFModel.find({}, function (err, PRFData) {
				// if PRF has a data
				if (PRFData.length > 0) {
					for (i = 0; i < PRFData.length; i++) {
						PRFData[i].createdDateString =
							PRFData[i].createdDate.toLocaleDateString();
						PRFData[i].targetStartDateString =
							PRFData[i].targetStartDate.toLocaleDateString();

						if (PRFData[i].approvedDate != null)
							PRFData[i].approvedDateString =
								PRFData[i].approvedDate.toLocaleDateString();
						else PRFData[i].approvedDateString = "N/A";

						if (i == PRFData.length - 1)
							res.render("pages/Personnel_Requisitions/PRFTrackerPage", {
								PRFData: PRFData,
							});
					}
				} else {
					res.render("pages/Personnel_Requisitions/PRFTrackerPage");
				}
			});
		}
		// if HR Partners, show only the BU they are assigned to.
		else if (
			(userDep == "Corporate Human Resource & Organization Department" &&
				userPosition != "Department Director") ||
			(userDep == "Corporate Human Resource & Organization Department" &&
				userPosition != "Department Head")
		) {
			PRFModel.find(
				{ "approvalHRPartner.approver.email": userEmail },
				function (err, PRFData) {
					// if PRF has a data
					if (PRFData.length > 0) {
						for (i = 0; i < PRFData.length; i++) {
							PRFData[i].createdDateString =
								PRFData[i].createdDate.toLocaleDateString();
							PRFData[i].targetStartDateString =
								PRFData[i].targetStartDate.toLocaleDateString();

							if (PRFData[i].approvedDate != null)
								PRFData[i].approvedDateString =
									PRFData[i].approvedDate.toLocaleDateString();
							else PRFData[i].approvedDateString = "N/A";

							if (i == PRFData.length - 1)
								res.render("pages/Personnel_Requisitions/PRFTrackerPage", {
									PRFData: PRFData,
								});
						}
					} else {
						res.render("pages/Personnel_Requisitions/PRFTrackerPage");
					}
				}
			);
		} else if (
			userPosition == "Business Unit Head" ||
			userPosition == "Department Head"
		) {
			PRFModel.find(
				{
					$or: [
						{ "approvalBUHead.approver.email": userEmail },
						{ "approvalDHead.approver.email": userEmail },
					],
				},
				function (err, PRFData) {
					// if PRF has a data
					if (PRFData.length > 0) {
						for (i = 0; i < PRFData.length; i++) {
							PRFData[i].createdDateString =
								PRFData[i].createdDate.toLocaleDateString();
							PRFData[i].targetStartDateString =
								PRFData[i].targetStartDate.toLocaleDateString();

							if (PRFData[i].approvedDate != null)
								PRFData[i].approvedDateString =
									PRFData[i].approvedDate.toLocaleDateString();
							else PRFData[i].approvedDateString = "N/A";

							if (i == PRFData.length - 1)
								res.render("pages/Personnel_Requisitions/PRFTrackerPage", {
									PRFData: PRFData,
								});
						}
					} else {
						res.render("pages/Personnel_Requisitions/PRFTrackerPage");
					}
				}
			);
		} else {
			res.render("pages/errorPage", {
				error: "You do not have access to this page.",
			});
		}
	},

	PRFIndividual: function (req, res) {
		var requisitionID = Number(req.params.requisitionID);
		var query = { requisitionID: requisitionID };
		// query mongodb
		PRFModel.findOne(query, function (err, result) {
			result.createdDateString = result.createdDate.toLocaleDateString();
			result.targetStartDateString =
				result.targetStartDate.toLocaleDateString();

			if (result.approvedDate != null)
				result.approvedDateString = result.approvedDate.toLocaleDateString();
			else result.approvedDateString = "N/A";

			res.render("pages/Personnel_Requisitions/PRFIndividualPage", {
				PRF: result,
			});
		});
	},

	getOnePRFData: function (req, res) {
		var requisitionID = Number(req.params.requisitionID);
		var query = { requisitionID: requisitionID };
		// query mongodb
		PRFModel.findOne(query, function (err, result) {
			result.createdDateString = result.createdDate.toLocaleDateString();
			result.targetStartDateString =
				result.targetStartDate.toLocaleDateString();

			if (result.approvedDate != null)
				result.approvedDateString = result.approvedDate.toLocaleDateString();
			else result.approvedDateString = "N/A";

			res.send({ PRF: result });
		});
	},

	getNextRequisitionID: function (req, res) {
		PRFModel.find({}, function (err, result) {
			var requisitionID = result.length + 1;
			// console.log(requisitionID);
			res.send(requisitionID.toString());
		});
	},

	SubmitPRF: function (req, res) {
		/*
            retrieve data then add to DB.
            Note:   * also store the createdDate for the requester's reference, even tho not included in the form.
                    * approvedDate is not yet stored, it'll only be updated once the PRF si completely approved.
        */
		approverVariables =
			"_id email firstName lastName businessUnit department position";

		console.log(req.body.businessUnit + req.body.department);

		// console.log(req.body.businessUnit + req.body.department);
		/** finding the Department Head Approver */
		var query = {
			//query
			businessUnit: req.body.businessUnit,
			department: req.body.department,
			position: "Department Head",
		};

		userModel.findOne(query, approverVariables, function (err, departmentHead) {
			if (err) throw err;
			var approvalDHead;
			// if this is the current user, mark as Approved na
			if (req.session.email == departmentHead.email) {
				approvalDHead = { approver: departmentHead, approval: "Approved" };
			} else {
				approvalDHead = { approver: departmentHead, approval: "Pending" };
			}
			/**  finding the HR Partner Approver **/
			userModel.findOne(
				{
					//query
					businessUnit: "Circle Corporation Inc.",
					department: "Corporate Human Resource & Organization Department",
					position: getHRpartnerPosition(req.body.businessUnit),
				},
				approverVariables,
				function (err, HRPartner) {
					var approvalHRPartner;
					// if this is the current user, mark as Approved na
					if (req.session.email == HRPartner.email) {
						approvalHRPartner = { approver: HRPartner, approval: "Approved" };
					} else {
						approvalHRPartner = { approver: HRPartner, approval: "Pending" };
					}

					/**  finding the Business Unit Head Approver **/
					userModel.findOne(
						{
							//query
							businessUnit: req.body.businessUnit,
							position: "Business Unit Head",
						},
						//variables to get
						approverVariables,
						function (err, BUHead) {
							var approvalBUHead;
							// if this is the current user, mark as Approved na
							if (req.session.email == BUHead.email) {
								approvalBUHead = { approver: BUHead, approval: "Approved" };
							} else {
								approvalBUHead = { approver: BUHead, approval: "Pending" };
							}

							/**  finding the CHROD Head **/
							userModel.findOne(
								{
									//query
									businessUnit: "Circle Corporation Inc.",
									department:
										"Corporate Human Resource & Organization Department",
									position: "Department Head",
								},
								//variables to get
								approverVariables,
								function (err, CHRODHead) {
									var approvalCHRODDirector;
									// if this is the current user, mark as Approved na
									if (req.session.email == CHRODHead.email) {
										approvalCHRODHead = {
											approver: CHRODHead,
											approval: "Approved",
										};
									} else {
										approvalCHRODHead = {
											approver: CHRODHead,
											approval: "Pending",
										};
									}

									/**  finding the CHROD Director **/
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
											var approvalCHRODDirector;
											// if this is the current user, mark as Approved na
											if (req.session.email == CHRODDirector.email) {
												approvalCHRODDirector = {
													approver: CHRODDirector,
													approval: "Approved",
												};
											} else {
												approvalCHRODDirector = {
													approver: CHRODDirector,
													approval: "Pending",
												};
											}

											/** gets the requisitionID for the next document */
											PRFModel.find({}, function (err, PRFResult) {
												var requisitionID = PRFResult.length + 1;

												/* start place at the inner nest */
												var curDate = new Date(Date.now());
												console.log("curDate: " + curDate);
												// var createdDate = new Date(YYYYMMDDtoDate(curDate));
												var createdDate = curDate;
												var targetStartDate = new Date(
													req.body.targetStartDate
												);

												var toolsOfTrade = new Array();
												var skills = new Array();
												// for (i = 0; i < req.body.tool.length; i++) {
												//     toolsOfTrade.push([req.body.tool, req.body.availability])

												//     // if(i == )
												// }

												var i = 0;
												if (Array.isArray(req.body.tool) == true) {
													for (i = 0; i < req.body.tool.length; i++) {
														var pair = [
															req.body.tool[i],
															req.body.availability[i],
														];
														toolsOfTrade.push(pair);
													}
												} else {
													var pair = [req.body.tool, req.body.availability];
													toolsOfTrade.push(pair);
												}

												if (Array.isArray(req.body.skillName) == true) {
													for (let i = 0; i < req.body.skillName.length; i++) {
														skills.push(req.body.skillName[i]);
													}
												} else {
													skills.push(req.body.skillName);
												}

												var PRFDetails = new PRFModel({
													_id: ObjectId(),
													requisitionID: requisitionID,
													createdBy: req.session,
													createdDate: createdDate,

													positionTitle: req.body.positionTitle.trim(),
													targetStartDate: targetStartDate,
													// inTO: req.body.inTO,
													positionLevel: req.body.positionLevel,
													jobCode: req.body.jobCode,
													headcount: Number(req.body.headcount),
													businessUnit: req.body.businessUnit,
													department: req.body.department,
													directSupervisor: req.body.directSupervisor,
													billToCompany: req.body.billToCompany,
													location: req.body.location,

													approvedDate: null,

													employmentType: req.body.employmentType,
													assessmentLength: {
														years: Number(
															req.body.lengthOfAssignmentYear || "0"
														),
														months: Number(
															req.body.lengthOfAssignmentMonth || "0"
														),
													},

													purpose: req.body.purposeOfRequest,
													details: req.body.details,

													jobDescription: req.body.jobDescription,
													positionRequirements: req.body.positionRequirements,
													skills: skills,

													toolsOfTrade: toolsOfTrade,

													approvalDHead: approvalDHead,
													approvalHRPartner: approvalHRPartner,
													approvalBUHead: approvalBUHead,
													approvalCHRODDirector: approvalCHRODDirector,
													approvalCHRODHead: approvalCHRODHead,
													status: "For Approval",
												});
												PRFDetails.save();

												// console.log(PRFDetails);

												let positionData = {
													// _id: ObjectId(),
													positionTitle: req.body.positionTitle,
													businessUnit: req.body.businessUnit,
													department: req.body.department,
													positionLevel: req.body.positionLevel,
													jobCode: req.body.jobCode,
													billToCompany: req.body.billToCompany,
													location: req.body.location,
													jobDescription: req.body.jobDescription,
													positionRequirements: req.body.positionRequirements,
													skills: skills,
												};
												/**
												 * This is when the purpose if "New Position"
												 * This adds the position information to the positions collections
												 */
												if (req.body.purposeOfRequest == "New Position") {
													positionData._id = ObjectId();
													var newPosition = new positionsModel(positionData);
													newPosition.save();
												} else {
													positionsModel.updateOne(
														{
															positionTitle: req.body.positionTitle,
															businessUnit: req.body.businessUnit,
															department: req.body.department,
														},
														{
															$set: positionData,
														},
														x => {
															console.log("Updated : " + x);
														}
													);
												}

												/* 
                                                 This is for sending the notifications
                                                 that a new PRF has been made.
                                                 sent to the 5 approvers.
                                                 departmentHead, HRPartner ,BUHead , CHRODHead, CHRODDirector
                                                 */
												var description = `Approval needed for a Personnel Requisition #${PRFDetails.requisitionID} that ${req.session.name} from ${req.session.businessUnit} submitted.`;

												var receivers = [
													departmentHead,
													HRPartner,
													BUHead,
													CHRODHead,
													CHRODDirector,
												];

												for (var i = 0; i < receivers.length; i++) {
													var notifications = new notificationModel({
														_id: new ObjectId(),
														receiver: receivers[i],
														isSeen: false,
														description: description,
														date: createdDate,
														referenceType: "PRF",
														reference: PRFDetails,
														task: "Approval",
													});
													notifications.save();
												}

												res.redirect("/PRFTracker");
												/* end place at the inner nest */
											});
										}
									);
								}
							);
						}
					);
				}
			);
		});
	},

	DoINeedToApprove: function (req, res) {
		var email = req.session.email;
		var position = req.session.position;
		var requisitionID = req.body.requisitionID;

		PRFModel.findOne({ requisitionID: requisitionID }, function (err, PRF) {
			// if the user's approval is pending, show .approvalButtons and .approvalTitle
			if (
				(PRF.approvalDHead.approver.email == email &&
					PRF.approvalDHead.approval == "Pending") ||
				(PRF.approvalHRPartner.approver.email == email &&
					PRF.approvalHRPartner.approval == "Pending") ||
				(PRF.approvalBUHead.approver.email == email &&
					PRF.approvalBUHead.approval == "Pending") ||
				(PRF.approvalCHRODDirector.approver.email == email &&
					PRF.approvalCHRODDirector.approval == "Pending") ||
				(PRF.approvalCHRODHead.approver.email == email &&
					PRF.approvalCHRODHead.approval == "Pending")
			) {
				if (PRF.status == "For Approval") res.send("show");
			} else {
				res.send("hide");
			}
		});
	},

	approvePRF: function (req, res) {
		var requisitionID = req.params.requisitionID;
		var department = req.session.department;
		var position = req.session.position;

		// approvalDHead
		if (
			position == "Department Head" &&
			department != "Corporate Human Resource & Organization Department"
		) {
			updateApproval(
				"Approving",
				requisitionID,
				{ "approvalDHead.approval": "Approved" },
				{},
				res
			);
		}
		//approvalBUHead
		else if (position == "Business Unit Head") {
			updateApproval(
				"Approving",
				requisitionID,
				{ "approvalBUHead.approval": "Approved" },
				{},
				res
			);
		}
		//approvalHRPartner
		else if (
			department == "Corporate Human Resource & Organization Department" &&
			position != "Department Head" &&
			position != "Department Director"
		) {
			updateApproval(
				"Approving",
				requisitionID,
				{ "approvalHRPartner.approval": "Approved" },
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
				requisitionID,
				{ "approvalCHRODDirector.approval": "Approved" },
				{},
				res
			);
		}
		//approvalCHRODHead
		else if (
			department == "Corporate Human Resource & Organization Department" &&
			position == "Department Head"
		) {
			updateApproval(
				"Approving",
				requisitionID,
				{ "approvalCHRODHead.approval": "Approved" },
				{},
				res
			);
		}
	},

	disapprovePRF: function (req, res) {
		var requisitionID = req.body.requisitionID;
		var department = req.session.department;
		var position = req.session.position;
		var name = req.session.name;
		var businessUnit = req.session.businessUnit;
		var disapprovalReason = req.body.disapprovalReason;

		console.log("req.body.disapprovalReason " + req.body.disapprovalReason);
		console.log("req.params.disapprovalReason " + req.params.disapprovalReason);
		// approvalDHead
		if (position == "Department Head") {
			updateApproval(
				"Disapproving",
				requisitionID,
				{
					"approvalDHead.approval": "Disapproved",
					status: "Disapproved",
					disapprovalReason: disapprovalReason,
				},
				{ department, name, businessUnit },
				res
			);
		}
		//approvalBUHead
		else if (position == "Business Unit Head") {
			updateApproval(
				"Disapproving",
				requisitionID,
				{
					"approvalBUHead.approval": "Disapproved",
					status: "Disapproved",
					disapprovalReason: disapprovalReason,
				},
				{ department, name, businessUnit },
				res
			);
		}
		//approvalHRPartner
		else if (
			department == "Corporate Human Resource & Organization Department" &&
			position != "Department Head" &&
			position != "Department Director"
		) {
			updateApproval(
				"Disapproving",
				requisitionID,
				{
					"approvalHRPartner.approval": "Disapproved",
					status: "Disapproved",
					disapprovalReason: disapprovalReason,
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
				requisitionID,
				{
					"approvalCHRODDirector.approval": "Disapproved",
					status: "Disapproved",
					disapprovalReason: disapprovalReason,
				},
				{ department, name, businessUnit },
				res
			);
		}
		//approvalCHRODHead
		else if (
			department == "Corporate Human Resource & Organization Department" &&
			position == "Department Head"
		) {
			updateApproval(
				"Disapproving",
				requisitionID,
				{
					"approvalCHRODHead.approval": "Disapproved",
					status: "Disapproved",
					disapprovalReason: disapprovalReason,
				},
				{ department, name, businessUnit },
				res
			);
			// status,         id,                         position,                                                   disappoveContent, res
		}
	},
};

module.exports = PRFController;

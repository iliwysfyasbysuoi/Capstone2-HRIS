const userModel = require("../models/userModel.js");
const offboardingModel = require("../models/offboardingModel.js");
const notificationModel = require("../models/notificationModel.js");
const { ObjectId } = require("bson");

const OffboardingController = {
	getNextOffboardingID: function (req, res) {
		offboardingModel.find({}, function (err, results) {
			var offboardingID = results.length + 1;
			console.log(offboardingID);
			res.send(offboardingID.toString());
		});
	},
	SubmitOffboarding: function (req, res) {
		//para sa user
		let sessionName = req.session.name;
		let session_id = req.session._id;
		let sessionPosition = req.session.position;
		let sessionBusinessUnit = req.session.businessUnit;
		let sessionDepartment = req.session.department;

		const {
			name,
			lastName,
			off_user_id,
			email,
			position,
			businessUnit,
			department,
			natureOfSeparation,
			effectiveDate,
		} = req.body;
		console.log("effective date", effectiveDate);
		try {
			//not sure if this is needed
			userModel
				.findOne({
					lastName: lastName,
					position: position,
					businessUnit: businessUnit,
				})
				.then(data => {
					userModel.findOne(
						//change this query to the HR officer
						{
							//query
							businessUnit: "Circle Corporation Inc.",
							department: "Corporate Human Resource & Organization Department",
							position: "HR Supervisor",
						},

						function (err, HR) {
							//!di ko pa maupdate
							var offboardingID;
							/** gets the requisitionID for the next document */
							offboardingModel.find({}, function (err, result) {
								offboardingID = result.length + 1;

								var OffboardingData = {
									_id: ObjectId(),
									offboardingID: Number(offboardingID),
									name:
										sessionPosition === "HR Supervisor" ? name : sessionName,
									off_user_id:
										sessionPosition === "HR Supervisor"
											? ObjectId(off_user_id)
											: session_id,
									position:
										sessionPosition === "HR Supervisor"
											? position
											: sessionPosition,
									businessUnit:
										sessionPosition === "HR Supervisor"
											? businessUnit
											: sessionBusinessUnit,
									department:
										sessionPosition === "HR Supervisor"
											? department
											: sessionDepartment,
									effectiveDate: effectiveDate,
									clearanceApproval: sessionPosition === "HR Supervisor",
									separationLetter: req.body.separationLetter,
									requestDate: Date.now(),
									allDeptHeadSubmitted: false,
									natureOfSeparation: natureOfSeparation,
									status: "Pending",
									updatedDate: Date.now(),
								};

								userModel
									.find({
										businessUnit: {
											$in: [
												businessUnit ? businessUnit : sessionBusinessUnit,
												"Circle Corporation Inc.",
											],
										},
										department: {
											$in: [
												department ? department : sessionDepartment,
												"Corporate Human Resource & Organization Department",
												"Board of Directors",
											],
										},
										position: {
											$in: [
												"HR Supervisor",
												"Business Unit Head",
												"Department Director",
											],
										},
									})
									.then(usrData => {
										const bu = businessUnit
											? businessUnit
											: sessionBusinessUnit;
										usrData.map(rs => {
											const { position } = rs;
											switch (position) {
												case "HR Supervisor":
													let approvalHR = {
														approver: rs,
														approval: "Pending",
													};
													OffboardingData = { ...OffboardingData, approvalHR };

													break;
												case "Business Unit Head":
													if (rs.businessUnit === bu) {
														let approvalBUHead = {
															approver: rs,
															approval: "Pending",
														};
														OffboardingData = {
															...OffboardingData,
															approvalBUHead,
														};
													}
													break;
												case "Department Director":
													if (
														rs.department ===
														"Corporate Human Resource & Organization Department"
													) {
														let approvalCHRODDirector = {
															approver: rs,
															approval: "Pending",
														};
														OffboardingData = {
															...OffboardingData,
															approvalCHRODDirector,
														};
													}
													break;
											}
										});
										new offboardingModel(OffboardingData).save();

										var description;

										if (req.session.position === "HR Supervisor") {
											description = `Clearance Accountability needed for Offboarding #${offboardingID} that ${sessionName} from ${sessionBusinessUnit} submitted.`;
											userModel.find(
												{
													position: "Department Head",
													department: {
														$in: [
															"Corporate Human Resource & Organization Department",
															OffboardingData.department,
															"ICT",
															"Supply Chain and Administration",
															"Accounting and Finance",
														],
													},
												},
												function (err, deptHead) {
													let departmentList = [];
													deptHead.map(head => {
														departmentList.push({
															accountabilityList: [],
															approver: `${head.firstName} ${head.lastName}`,
															departmentName: head.department,
															submitted: "Pending",
														});

														var notification = new notificationModel({
															_id: new ObjectId(),
															receiver: head,
															isSeen: false,
															description: description,
															date: new Date(Date.now()),
															//change this reference type din kung anong type
															referenceType: "Offboarding",
															reference: OffboardingData,
															task: "Add Clearance Accountabilities",
														});
														notification.save();
													});
													offboardingModel
														.updateOne(
															{
																_id: OffboardingData._id,
															},
															{
																$set: {
																	accountabilities: departmentList,
																	notifStatus: "Notified",
																},
															}
														)
														.then(res => console.log(res))
														.catch(err => console.error(err));
												}
											);
										} else {
											description = `Submitted offboarding #${offboardingID} that ${sessionName} from ${sessionBusinessUnit} submitted.`;
											var notifications = new notificationModel({
												_id: new ObjectId(),
												receiver: HR,
												isSeen: false,
												description: description,
												date: new Date(Date.now()),
												//change this reference type din kung anong type
												referenceType: "Offboarding",
												reference: OffboardingData,
												task: "Approve Clearance Form",
											});
											notifications.save();
										}
									})
									.catch(err => console.error(err));
							});
						}
					);
				});
		} catch (err) {
			console.error(err);
		}
		console.log("body ", req.body);

		if (req.session.position === "HR Supervisor") {
			res.redirect("/OffboardingTracker");
		} else {
			res.redirect("/");
		}
	},
	SendNotifToDeptHead: function (req, res) {
		var id = req.params._id;
		const { approvalButton } = req.body;

		if (approvalButton) {
			offboardingModel
				.updateOne(
					{
						_id: id,
					},
					{
						$set: {
							clearanceApproval: approvalButton === "Approve",
							status: approvalButton === "Approve" ? "Pending" : "Closed",
						},
					}
				)
				.then(res => console.log(res))
				.catch(err => console.log(err));

			offboardingModel.findOne({ _id: id }, function (err, result) {
				console.log("resulta", result.name);

				//send notif sa may ari
				userModel
					.findOne({
						name: result.name,
						position: result.position,
						businessUnit: result.businessUnit,
					})
					.then(userData => {
						var notifications = new notificationModel({
							_id: new ObjectId(),
							receiver: userData,
							isSeen: false,
							description: `Your clearance form is ${
								approvalButton === "Approve" ? "approved" : "disapproved"
							} by ${req.session.name}`,
							date: new Date(Date.now()),
							//change this reference type din kung anong type
							referenceType: "Offboarding",
							reference: result,
							task: approvalButton === "Approve" ? "Clear Accountabilities" : ""
						});
						notifications.save();
					});
			});
		}

		if (approvalButton === "Approve") {
			offboardingModel.findOne({ _id: id }, function (err, result) {
				var { offboardingID } = result;

				userModel.find(
					{
						position: "Department Head",
						department: {
							$in: [
								"Corporate Human Resource & Organization Department",
								result.department,
								"ICT",
								"Supply Chain and Administration",
								"Accounting and Finance",
							],
						},
					},
					function (err, deptHead) {
						let departmentList = [];
						var description = `Clearance Accountability needed for Offboarding #${offboardingID} that ${req.session.name} from ${req.session.businessUnit} submitted.`;

						deptHead.map(head => {
							departmentList.push({
								accountabilityList: [],
								approver: `${head.firstName} ${head.lastName}`,
								departmentName: head.department,
								submitted: "Pending",
							});

							var notifications = new notificationModel({
								_id: new ObjectId(),
								receiver: head,
								isSeen: false,
								description: description,
								date: new Date(Date.now()),
								//change this reference type din kung anong type
								referenceType: "Offboarding",
								reference: result,
								task: "Add Clearance Accountabilities",
							});
							notifications.save();
						});
						offboardingModel
							.updateOne(
								{
									_id: id,
								},
								{
									$set: {
										accountabilities: departmentList,
										notifStatus: "Notified",
									},
								}
							)
							.then(res => console.log(res))
							.catch(err => console.log(err));
					}
				);
			});
		}

		res.redirect("back");
	},

	checkExistingClearanceFormBeingProcessed: function (req, res) {
		var firstName = req.session.firstName;
		var lastName = req.session.lastName;
		var name = req.body.name;
		console.log("name " + JSON.stringify(name));

		// if(req.session.position == "HR Supervisor"){
		// check for whatever name the HR Supervisor chooses
		offboardingModel.findOne(
			{
				$or: [
					{ name: name, status: "Pending" },
					{ name: name, status: "Approved" },
				],
			},
			function (err, offboardingResult) {
				if (offboardingResult != null) {
					res.send(offboardingResult._id);
				} else {
					res.send("null");
				}
			}
		);

		// }else{
		//     // check for the logged user

		// }
	},
};

module.exports = OffboardingController;

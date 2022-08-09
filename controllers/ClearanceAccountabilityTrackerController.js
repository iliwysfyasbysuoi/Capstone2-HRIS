const userModel = require("../models/userModel.js");
const offboardingModel = require("../models/offboardingModel.js");
const interviewModel = require("../models/interviewScheduleModel.js");
const notificationModel = require("../models/notificationModel.js");
const { ObjectId } = require("bson");

let formatDate = string => {
	if (string === "") {
		return "-";
	} else {
		let date = new Date(string);
		var month = date.toLocaleString("default", { month: "short" });
		return month + ". " + date.getDate() + ", " + date.getFullYear();
	}
};

const ClearanceAccountabilityTrackerController = {
	GetAccountability: function (req, res) {
		const id = req.params._id;
		offboardingModel.findOne(
			{
				_id: id,
			},
			function (err, offboardingData) {
				res.send(offboardingData);
			}
		);
	},
	GetAccountabilities: function (req, res) {
		const { name } = req.session;

		offboardingModel.find({}, function (err, offboardingData) {
			let filteredData = [];

			offboardingData.map((data, idx) => {
				let indiv = data.accountabilities.find(acc => acc.approver === name);
				if (indiv) {
					filteredData.push(offboardingData[idx]);
				}
			});
			res.send(filteredData);
		});
	},
	ClearanceAccountabilityTracker: function (req, res) {
		const { name } = req.session;
		offboardingModel.find({}, function (err, offboardingData) {
			let filteredData = [];

			offboardingData.map((data, idx) => {
				let indiv = data.accountabilities.find(acc => acc.approver === name);
				if (indiv) {
					filteredData.push(offboardingData[idx]);
				}
			});
			res.render("pages/ClearanceAccountabilityTrackerPage", {
				offboardingData: filteredData,
			});
		});
	},
	ClearanceAccountabilityIndividual: function (req, res) {
		var offboardingID = req.params._id;
		// query mongodb
		console.log("id", offboardingID);
		offboardingModel.findOne(
			{ _id: offboardingID },
			function (err, offboarding) {
				console.log(offboarding);

				res.render("pages/ClearanceAccountabilityFormPage", {
					offboarding: offboarding,
				});
			}
		);
	},
	SubmitClearanceAccountabilityForm: function (req, res) {
		var accountabilityName = req.body.Name;
		var accountabilityStatus = req.body.status;
		var buttontype = req.body.buttontype;
		var id = req.body.id;

		console.log("accountabilities", accountabilityStatus);
		var department = req.session.department;

		if (!accountabilityStatus) {
			res.redirect("back");
		} else {
			let accountability = {
				accountabilityList: [],
				submitted: buttontype === "submit" ? "Submitted" : "Pending",
				approver: req.session.name,
				dateSigned: new Date(Date.now()),
				departmentName: department,
			};

			if (accountabilityName && accountabilityStatus) {
				if (
					Array.isArray(accountabilityName) &&
					accountabilityName.length > 1
				) {
					for (let i = 0; i < accountabilityName.length; i++) {
						accountability.accountabilityList.push({
							name: accountabilityName[i],
							status: accountabilityStatus[i],
						});
					}
				} else {
					accountability.accountabilityList.push({
						name: accountabilityName,
						status: accountabilityStatus,
					});
				}
			}

			offboardingModel
				.updateOne(
					{ _id: id },
					{ $set: { "accountabilities.$[elem]": accountability } },
					{ arrayFilters: [{ "elem.departmentName": department }] }
				)

				.then(ressdf => {
					offboardingModel
						.findOne({
							_id: id,
						})
						.then(offboardingData => {
							console.log("offboarding data", offboardingData);

							userModel.find(
								{
									email: {
										$in: [
											offboardingData.approvalHR.approver.email,
											offboardingData.approvalBUHead.approver.email,
											offboardingData.approvalCHRODDirector.approver.email,
										],
									},
								},
								function (err, userData) {
									let allSubmitted = true;
									offboardingData.accountabilities.map(data => {
										if (data.submitted !== "Submitted") {
											allSubmitted = false;
										}
									});

									if (req.body.buttontype === "submit") {
										userModel
											.findOne({
												// name: offboardingData.name,
												// position: offboardingData.position,
												// department: offboardingData.department,
												_id: offboardingData.off_user_id,
											})
											.then(usr => {
												var notifications = new notificationModel({
													_id: new ObjectId(),
													receiver: usr,
													isSeen: false,
													description: `Your clearance for ${req.session.department} has been cleared.`,
													date: new Date(Date.now()),
													referenceType: "Offboarding",
													reference: offboardingData,
												});
												notifications.save();
											});
										userModel
											.findOne({
												position: "HR Supervisor",
											})
											.then(usr => {
												var notifications = new notificationModel({
													_id: new ObjectId(),
													receiver: usr,
													isSeen: false,
													description: `${req.session.name} has submitted list of accountabilities.`,
													date: new Date(Date.now()),
													//change this reference type din kung anong type
													referenceType: "Offboarding",
													reference: offboardingData,
												});
												notifications.save();

												if (allSubmitted) {
													var description = `All department heads have submitted accountability for accountability form #${offboardingData.offboardingID} that ${offboardingData.name} from ${offboardingData.businessUnit} submitted.`;
													offboardingModel
														.updateOne(
															{ _id: id },
															{ $set: { allDeptHeadSubmitted: true } }
														)
														.then(res => {
															userData.map(usr => {
																var notifications = new notificationModel({
																	_id: new ObjectId(),
																	receiver: usr,
																	isSeen: false,
																	description: description,
																	date: new Date(Date.now()),
																	//change this reference type din kung anong type
																	referenceType: "Offboarding",
																	reference: offboardingData,
																	task: "Approve Offboarding",
																});
																notifications.save();
															});
														})
														.catch(err => console.log(err));
												}
											});
									} else if (buttontype === "save") {
										if (
											accountabilityStatus.includes("Pending") ||
											[accountabilityStatus].includes("Pending")
										) {
											userModel
												.findOne({
													// name: offboardingData.name,
													// position: offboardingData.position,
													// department: offboardingData.department,
													_id: offboardingData.off_user_id,
												})
												.then(usr => {
													var notifications = new notificationModel({
														_id: new ObjectId(),
														receiver: usr,
														isSeen: false,
														description: `${req.session.name} has updated your clearance accountabilities`,
														date: new Date(Date.now()),
														referenceType: "Offboarding",
														reference: offboardingData,
													});
													notifications.save();
												});
										}
									}
								}
							);
						});
					res.redirect("/ClearanceAccountabilityTracker");
				})
				.catch(err => console.log(err));
		}
	},
	ApproveClearanceAccountability: function (req, res) {
		let { position, id, approval, disapprovalReason } = req.body;
		let approvalValue = approval === "approve" ? "Approved" : "Disapproved";
		switch (position) {
			case "HR Supervisor":
				offboardingModel
					.updateOne(
						{
							_id: id,
						},
						{
							$set: {
								"approvalHR.approval": approvalValue,
								status: approvalValue === "Approved" ? "Pending" : "Closed",
								disapprovalReason: disapprovalReason,
								updatedDate: new Date(Date.now()),
							},
						}
					)
					.then(() => {})
					.catch(err => console.log("error"));
				break;
			case "Business Unit Head":
				offboardingModel
					.updateOne(
						{
							_id: id,
						},
						{
							$set: {
								"approvalBUHead.approval": approvalValue,
								status: approvalValue === "Approved" ? "Pending" : "Closed",
								disapprovalReason: disapprovalReason,
								updatedDate: new Date(Date.now()),
							},
						}
					)
					.then(() => {});
				offboardingModel
					.findOne({
						_id: id,
					})
					.then(offboardingData => {
						const { approvalBUHead, approvalCHRODDirector, approvalHR } =
							offboardingData;
						console.log(
							"approval values",
							approvalBUHead.approval,
							approvalCHRODDirector.approval,
							approvalHR.approval
						);

						if (
							approvalBUHead.approval === "Approved" &&
							approvalCHRODDirector.approval === "Approved" &&
							approvalHR.approval === "Approved"
						) {
							userModel
								.findOne({
									email: approvalHR.approver.email,
								})
								.then(userData => {
									var notifications = new notificationModel({
										_id: new ObjectId(),
										receiver: userData,
										isSeen: false,
										description: `Offboarding #${offboardingData.offboardingID} has been approved. Kindly schdedule an interview.`,
										date: new Date(Date.now()),
										referenceType: "OffboardingApproval",
										reference: offboardingData,
										task: "Schedule Interview",
									});
									notifications.save();
								});
						}
					})
					.catch(() => console.log("di pumasok"));

				break;
			case "Department Director":
				offboardingModel
					.updateOne(
						{
							_id: id,
						},
						{
							$set: {
								"approvalCHRODDirector.approval": approvalValue,
								disapprovalReason: disapprovalReason,
								status: approvalValue === "Approved" ? "Pending" : "Closed",

								updatedDate: new Date(Date.now()),
							},
						}
					)
					.then(() => {
						offboardingModel
							.findOne({
								_id: id,
							})
							.then(offboardingData => {
								const { approvalBUHead, approvalCHRODDirector, approvalHR } =
									offboardingData;
								console.log(
									"approval values",
									approvalBUHead.approval,
									approvalCHRODDirector.approval,
									approvalHR.approval
								);

								if (
									approvalBUHead.approval === "Approved" &&
									approvalCHRODDirector.approval === "Approved" &&
									approvalHR.approval === "Approved"
								) {
									userModel
										.findOne({
											email: approvalHR.approver.email,
										})
										.then(userData => {
											var notifications = new notificationModel({
												_id: new ObjectId(),
												receiver: userData,
												isSeen: false,
												description: `Offboarding #${offboardingData.offboardingID} has been approved. Kindly schdedule an interview.`,
												date: new Date(Date.now()),
												referenceType: "OffboardingApproval",
												reference: offboardingData,
												task: "Schedule Interview",
											});
											notifications.save();
										});
								}
							})
							.catch(() => console.log("di pumasok"));
					})
					.catch(err => console.log("error"));
		}

		if (approvalValue === "Disapproved") {
			offboardingModel
				.findOne({
					_id: id,
				})
				.then(offboardingData => {
					userModel
						.findOne({
							name: offboardingData.name,
							position: offboardingData.position,
						})
						.then(userData => {
							var description = `Offboarding #${offboardingData.offboardingID} has been disapproved by ${req.session.name}.`;
							var notifications = new notificationModel({
								_id: new ObjectId(),
								receiver: userData,
								isSeen: false,
								description: description,
								date: new Date(Date.now()),
								referenceType: "OffboardingApproval",
								reference: offboardingData,
							});
							notifications.save();
						});

					if (position !== "HR Supervisor") {
						userModel
							.findOne({
								position: "HR Supervisor",
							})
							.then(userData => {
								var description = `Offboarding #${offboardingData.offboardingID} has been disapproved by ${req.session.name}.`;
								var notifications = new notificationModel({
									_id: new ObjectId(),
									receiver: userData,
									isSeen: false,
									description: description,
									date: new Date(Date.now()),
									referenceType: "OffboardingApproval",
									reference: offboardingData,
								});
								notifications.save();
							});
					}
				});
		}

		res.redirect(`back`);
	},

	ScheduleInterview: function (req, res) {
		let id = req.params.id;
		let { schedule } = req.body;
		let interview = {
			status: "Pending",
			date: schedule,
		};

		if (!schedule) {
			res.redirect("back");
		} else {
			interviewModel.find({}).then(interviewData => {
				var availableDate = true;
				interviewData.map(data => {
					// 01/05/2022 - 9am
					var range = new Date(data.date);
					// + 1hr
					// 01/05/2022 - 10am
					var max = range.setMinutes(new Date(data.date).getMinutes() + 60);
					// - 1hr
					// 01/05/2022 8am
					var min = range.setMinutes(new Date(data.date).getMinutes() - 120);
					var newSched = new Date(schedule).getTime();

					// in between
					if (newSched <= max && newSched >= min) {
						availableDate = false;
					}
				});

				if (availableDate) {
					offboardingModel
						.updateOne(
							{
								_id: id,
							},
							{
								$set: {
									interview: interview,
									updatedDate: new Date(Date.now()),
								},
							}
						)
						.then(res => console.log("updated"))
						.catch(err => console.log("error"));

					offboardingModel
						.findOne({
							_id: id,
						})
						.then(offData => {
							userModel
								.findOne({
									position: "HR Assistant Manager",
								})
								.then(user => {
									var description = `Submitted interview schedule for ${
										offData.name
									} from ${offData.businessUnit} on ${formatDate(schedule)}.`;

									var notifications = new notificationModel({
										_id: new ObjectId(),
										receiver: user,
										isSeen: false,
										description: description,
										date: new Date(Date.now()),
										referenceType: "Offboarding",
										reference: offData,
										task: "Conduct Exit Interview",
									});
									notifications.save();

									userModel
										.findOne({
											// name: offData.name,
											// position: offData.position,
											_id: offData.off_user_id,
										})
										.then(interviewee => {
											var notifications = new notificationModel({
												_id: new ObjectId(),
												receiver: interviewee,
												isSeen: false,
												description: `You have an interview scheduled on ${formatDate(
													schedule
												)}`,
												date: new Date(Date.now()),
												referenceType: "Offboarding",
												reference: offData,
												task: "Join Exit Interview",
											});
											notifications
												.save()
												.then(data => console.log("may interview", data));

											var interview = new interviewModel({
												_id: new ObjectId(),
												date: schedule,
												interviewId: id,
												stage: "Exit",
												status: "Pending",
												type: "Offboarding",
												reference: { _id: offData._id },
												interviewer: user,
												interviewee: interviewee,
											});
											interview.save();
										});
								})
								.catch(err => console.log("error", err));
						});

					res.redirect(`/OffboardingTracker/${id}`);
				} else {
					res.redirect(`/OffboardingTracker/${id}/error`);
				}
			});
		}
	},

	CompleteInterview: function (req, res) {
		let id = req.params.id;

		offboardingModel
			.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						"interview.status": "Completed",
						status: "Completed",
						updatedDate: new Date(Date.now()),
					},
				}
			)
			.then(res => {
				offboardingModel
					.findOne({
						_id: id,
					})
					.then(offboardingData => {
						console.log("interview", id);
						interviewModel
							.updateOne(
								{
									interviewId: offboardingData._id,
								},
								{
									$set: {
										status: "Completed",
									},
								}
							)
							.then(() => console.log("interview updated"))
							.catch(err => console.log("interview", err));

						userModel
							.findOne({
								_id: offboardingData.approvalHR.approver._id,
							})
							.then(userData => {
								var notifications = new notificationModel({
									_id: new ObjectId(),
									receiver: userData,
									isSeen: false,
									description: `Interview with ${offboardingData.name} has been completed. Submit EAF now.`,
									date: new Date(Date.now()),
									referenceType: "Offboarding",
									reference: offboardingData,
									task: "Submit Employee Action Form",
								});
								notifications.save();
							});
					});
			})
			.catch(err => console.log("error"));

		offboardingModel
			.findOne({
				_id: id,
			})
			.then(res => {
				userModel
					.findOne({
						// name: res.name,
						// position: res.position,
						_id: res.off_user_id,
					})
					.then(user => {
						var description = `Click here to answer Exit Survey Form.`;

						var notifications = new notificationModel({
							_id: new ObjectId(),
							receiver: user,
							isSeen: false,
							description: description,
							date: new Date(Date.now()),
							referenceType: "ExitSurveyForm",
							reference: res,
							task: "Answer Exit Survey Form",
						});
						notifications.save();
					})
					.catch(err => console.log("error"));
			});

		res.redirect("back");
	},
};

module.exports = ClearanceAccountabilityTrackerController;

const userModel = require("../models/userModel.js");
const skillSetupModel = require("../models/skillSetupModel.js");
const notificationModel = require("../models/notificationModel.js");
const skillAssessmentModel = require("../models/skillAssessmentModel.js");
const { ObjectId } = require("bson");

const skillsController = {
	getNextSkillSetUpID: function (req, res) {
		skillSetupModel.find({}, function (err, result) {
			var skillID = result.length + 1;

			res.send(skillID.toString());
		});
	},
	GetSkills: function (req, res) {
		const dateNow = new Date();
		skillSetupModel.find({}, function (err, results) {
			var skills = [];
			results.map(result => {
				const expirationDate = new Date(result.expireDate);
				expirationDate.setDate(expirationDate.getDate() + 30);
				if (dateNow < expirationDate) {
					skills.push(result);
				}
			});
			res.send(skills);
		});
	},
	SubmitSkillSetUp: function (req, res) {
		skillSetupModel.find({}, function (err, result) {
			var dates = [];
			var skillID = result.length + 1;
			const reviewCycle = req.body.reviewCycle;
			const cycles = Number(req.body.cycleNum);
			let expireDate;

			dates.push(new Date(req.body.startDate));
			expireDate = new Date(req.body.startDate).setDate(
				new Date(req.body.startDate).getDate() + 1
			);

			var j = 0;
			for (var i = 1; i < cycles; i++) {
				const nextDate =
					reviewCycle === "Annual"
						? new Date(dates[j]).setFullYear(
								new Date(dates[j]).getFullYear() + 1
						  )
						: new Date(dates[j]).setMonth(
								new Date(dates[j]).getMonth() +
									(reviewCycle === "Bi-Annual"
										? 6
										: reviewCycle === "Quarterly"
										? 3
										: i) //!CHECK THIS
						  );

				dates.push(new Date(nextDate));
				expireDate = new Date(nextDate).setDate(
					new Date(nextDate).getDate() + 1
				);

				j++;
			}

			userModel.find(
				{
					position: req.body.skillPositionTitle,
					department: req.body.skillDepartment,
					businessUnit: req.body.skillBusinessUnit,
				},
				function (err, users) {
					const skills = new skillSetupModel({
						_id: ObjectId(),
						skillID,
						skillPositionTitle: req.body.skillPositionTitle,
						skillDepartment: req.body.skillDepartment,
						skillBusinessUnit: req.body.skillBusinessUnit,
						targetSkills: req.body.targetSkills,
						reviewCycle,
						cycles,
						dates,
						expireDate,
						answerable: true,
					});

					skills.save();

					if (users && users.length > 0) {
						users.map(user => {
							dates.map(date => {
								var notifications = new notificationModel({
									_id: new ObjectId(),
									receiver: user,
									isSeen: false,
									description: `You need to answer the skills assessment form`,
									date,
									referenceType: "Answer Assessment Form Employee",
									reference: skills,
									task: "Answer Skills Assessment",
								});
								notifications.save();
							});
						});

						var HRSpecialist_expireNotifReceiver = req.session;
						HRSpecialist_expireNotifReceiver._id = ObjectId(req.session._id);
						// pre-send notification for expireDate of the skill setup cycle
						var notifications = new notificationModel({
							_id: new ObjectId(),
							receiver: HRSpecialist_expireNotifReceiver,
							isSeen: false,
							description: `Skill setup cycle ended. Set new skill setup cycle.`,
							date: skills.expireDate,
							referenceType: "Set Skill Setup",
							reference: skills,
							task: "Set Skill Setup",
						});
						notifications.save();
					}

					res.redirect("/SkillSetupTracker");
				}
			);
		});
	},
	SkillAssessmentForm: function (req, res) {
		session = {
			name: req.session.name,
			position: req.session.position,
			department: req.session.department,
			businessUnit: req.session.businessUnit,
		};

		skillSetupModel.findOne(
			{
				_id: req.params._id,
				date: req.params.date,
			},
			function (err, result) {
				skillAssessmentModel.findOne(
					{
						skillSetupID: req.params._id,
						skillCycleDate: req.params.date,
						"employeeDetails.name": req.session.name,
					},
					function (err, assessmentIndividual) {
						if (assessmentIndividual) {
							res.redirect(
								`/SkillAssessmentTracker/${assessmentIndividual._id}`
							);
						} else {
							skillAssessmentModel.find({}, function (err, assessments) {
								if (result) {
									res.render("pages/SkillsAssessmentFormPage", {
										session,
										date: req.params.date,
										targetSkills: result.targetSkills,
										skillsSetUpID: result._id,
										assessmentID: assessments.length + 1,
									});
								} else {
									res.redirect("/");
								}
							});
						}
					}
				);
			}
		);
	},
	SubmitSkillsAssessment: function (req, res) {
		var skillsID = req.params._id;

		skillAssessmentModel.find({}, function (err, assessments) {
			skillSetupModel.findOne(
				{ _id: skillsID, answerable: true },
				function (err, skillSetup) {
					var assessmentID = assessments.length + 1;
					if (skillSetup) {
						targetSkills = [];

						skillNames = skillSetup.targetSkills;
						for (var i = 0; i < skillNames.length; i++) {
							targetSkills.push({
								skillName: skillNames[i],
								rating: req.body.rating[i],
							});
						}
						assessmentDetails = {
							_id: new ObjectId(),
							assessmentID,
							skillSetupID: skillSetup._id,
							employeeDetails: {
								id: req.session._id,
								name: req.session.name,
								position: req.session.position,
								department: req.session.department,
								businessUnit: req.session.businessUnit,
							},
							targetSkills,
							skillCycleDate: req.params.date,
							submissionDate: new Date(Date.now()),
						};

						assessment = new skillAssessmentModel(assessmentDetails);
						assessment.save();

						userModel.findOne(
							{
								position: "HR Specialist",
							},
							function (err, user) {
								var notifications = new notificationModel({
									_id: new ObjectId(),
									receiver: user,
									isSeen: false,
									description: `${req.session.name} has answered the Skills Assessment Form #${assessmentID}`,
									date: new Date(Date.now()),
									referenceType: "Assessment Form Answer",
									reference: assessment,
								});

								notifications.save();

								// another notification if all employees answered the skill setup  form
								userModel.find(
									{
										position: skillSetup.skillPositionTitle,
										department: skillSetup.skillDepartment,
										businessUnit: skillSetup.skillBusinessUnit,
									},
									function (err, employees) {
										// if (err) return console.error(err)

										let employeeIDs = [];
										employees.map(emp => {
											employeeIDs.push(emp._id.toString());
										});
										let doneEmployeeIDs = [];
										assessments.map(asse => {
											if (
												asse.skillSetupID.toString() === skillsID &&
												asse.skillCycleDate.toString() ==
													skillSetup.dates[
														skillSetup.dates.length - 1
													].toString()
											)
												doneEmployeeIDs.push(
													asse.employeeDetails.id.toString()
												);
										});
										// go through the done employees
										doneEmployeeIDs.map(empId => {
											employeeIDs.splice(employeeIDs.indexOf(empId), 1);
										});

										// make sure current user is out there as well
										if (employeeIDs.includes(req.session._id))
											employeeIDs.splice(
												employeeIDs.indexOf(req.session._id),
												1
											);

										// console.log(doneEmployeeIDs);
										// console.log(employeeIDs);
										// console.log(employeeIDs.length === 0);
										// all has answered
										if (employeeIDs.length === 0) {
											const goToListNotification = new notificationModel({
												_id: new ObjectId(),
												receiver: user,
												isSeen: false,
												description: `All of the ${skillSetup.skillPositionTitle} employees covered by Skills Assessment Form #${skillSetup.skillID} have answered`,
												date: new Date(Date.now()),
												referenceType: "All Assessments Answered",
												reference: skillSetup,
												task: "Submit Training Nomination",
											});
											goToListNotification.save();
										}
									}
								);
							}
						);
					}

					res.redirect("/");
				}
			);
		});
	},
	getNextAssessmentID: function (req, res) {
		skillAssessmentModel.find({}, function (err, result) {
			var assessmentID = result.length + 1;
			res.send(assessmentID.toString());
		});
	},
	SkillAssessmentTracker: function (req, res) {
		skillSetupModel.find({}, function (err, results) {
			skills = [];

			res.render("pages/Skills/SkillsAssessmentTrackerPage", {
				skills: results,
			});
		});
	},
	SkillAssessmentTrackerSorted: function (req, res) {
		res.render("pages/Skills/SkillsAssessmentSortedListPage", {
			skillID: req.params._id,
		});
	},
	SkillsAssessmentListOfEmployees: function (req, res) {
		const skillsID = req.params._skillSetupID;
		skillAssessmentModel.find(
			{ skillSetupID: skillsID },
			function (err, result) {
				res.send({ result });
			}
		);
	},
	IndividualSkillAssessment: function (req, res) {
		skillAssessmentModel.findOne(
			{
				_id: req.params._id,
			},
			function (err, result) {
				res.render("pages/SkillsAssessmentIndividualPage", {
					assessmentDetails: result,
				});
			}
		);
	},
	IndividualSkillSetup: function (req, res) {
		skillSetupModel.findOne(
			{
				skillID: req.params.skillID,
			},
			function (err, result) {
				res.render("pages/SkillSetupIndividualPage", {
					skill: result,
				});
			}
		);
	},
	SkillSetupTracker: function (req, res) {
		skillSetupModel.find({}, function (err, results) {
			skills = [];

			results.map(result => {
				if (new Date(new Date(Date.now())) < new Date(result.expireDate)) {
					skills.push(result);
				}
			});

			res.render("pages/SkillsSetupTrackerPage", {
				skills,
			});
		});
	},
	getExistingActiveSkillSetup: function (req, res) {
		var position = req.body.position;
		var startDate = new Date(req.body.startDateString);

		skillSetupModel.find(
			{ skillPositionTitle: position },
			function (err, results) {
				var isStartDateBeforeExpireDate = false;
				var index;
				for (i = 0; i < results.length; i++) {
					var expireDate = new Date(results[i].expireDate);
					// console.log(results.length);

					if (startDate.getTime() < results[i].expireDate.getTime()) {
						// is startDate is before the latest expireDate for the position, send the skillSetup data
						isStartDateBeforeExpireDate = true;
						index = i;
					}
				}

				if (isStartDateBeforeExpireDate == true) {
					// console.log(results[index]);
					res.send({ showNotice: true, skillSetupData: results[index] });
				} else {
					res.send({ showNotice: false });
				}
			}
		);
	},
};

module.exports = skillsController;

const personalInformationsModel = require("../models/personalInformationsModel");
const { ObjectId } = require('bson');

const tempFormController = {
	FormPage: function (req, res) {
		var FormName = req.params.FormName;

		if (FormName == "PersonnelRequisitionForm") {
			if (
				req.session.position == "Department Head" ||
				req.session.position == "Business Unit Head"
			) {
				res.render(
					"pages/Personnel_Requisitions/PersonnelRequisitionFormPage",
					{
						Form: "forms/PersonnelRequisitionForm", //the file name in views/ without the ".hbs"
					}
				);
			} else {
				res.render("pages/errorPage", {
					error:
						"You do not have permission to access this page. Only the Department Head and Business Unit Head may submit a PRF.",
				});
			}
		} else if (FormName == "ClearanceForm") {
			res.render("pages/ClearanceFormPage", {
				Form: "forms/ClearanceForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "ClearanceAccountabilityForm") {
			res.render("pages/ClearanceAccountabilityFormPage", {
				Form: "forms/ClearanceAccountabilityForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "ExitInterviewForm") {
			res.render("pages/ExitInterviewFormPage", {
				Form: "forms/ExitInterviewForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "EmployeeExitSurveyForm") {
			res.render("pages/EmployeeExitSurveyFormPage", {
				Form: "forms/EmployeeExitSurveyForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "ApplicationForm") {
			res.render("pages/ApplicationFormPage", {
				Form: "forms/ApplicationForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "InitialInterviewForm") {
			// renders the form only because this is used in modal instead of its own page
			res.render("forms/InitialInterviewForm", {
				applicationID: req.body.applicationID,
			});
		} else if (FormName == "FunctionalInterviewForm") {
			// renders the form only because this is used in modal instead of its own page
			res.render("forms/FunctionalInterviewForm", {
				applicationID: req.body.applicationID,
			});
		} else if (FormName == "FinalInterviewForm") {
			// renders the form only because this is used in modal instead of its own page
			res.render("forms/FinalInterviewForm", {
				applicationID: req.body.applicationID,
			});
		} else if (FormName == "TNDNeedsForm") {
			res.render("pages/TNDNeedsFormPage", {
				Form: "forms/TNDNeedsForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "EmployeeActionForm") {
			res.render("pages/EmployeeActionFormPage", {
				Form: "forms/EmployeeActionForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "PersonalInformationForm") {

			// mode stores the value that determines if the form is for "update"
			let mode = req.query.mode;

			personalInformationsModel.findOne({'user._id': ObjectId(req.session._id)}, function(err, PIFResult){
				
				if(PIFResult != null && mode != "update"){
					// redirects to the Personal Information PAge if there is already a PIF.
					res.redirect("/PersonalInformationPage");
				}else{
					res.render("pages/PersonalInformationFormPage", {
						Form: "forms/PersonalInformationForm", //the file name in views/ without the ".hbs"
						PIF: PIFResult
					});
				}
			});
			
		} else if (FormName == "TrainingEvaluationForm") {
			res.render("pages/TrainingEvaluationFormPage", {
				Form: "forms/TrainingEvaluationForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "TrainingNominationForm") {
			res.render("pages/Training/TrainingNominationFormPage", {
				Form: "forms/Training/TrainingNominationForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "SkillsSetupForm") {
			res.render("pages/SkillsSetupFormPage", {
				Form: "forms/SkillsSetupForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "SkillsAssessmentForm") {
			res.render("pages/SkillsAssessmentFormPage", {
				Form: "forms/SkillsAssessmentForm", //the file name in views/ without the ".hbs"
			});
		}
		// <LAGING NATATANGGAL SA MERGE HAHAHAH>
		else if (FormName == "PerformanceAppraisalForm") {
			res.render("pages/Performance/PerformanceAppraisalFormPage", {
				Form: "forms/PerformanceAppraisalForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "PerformanceReviewForm") {
			res.render("pages/Performance/PerformanceReviewFormPage", {
				Form: "forms/PerformanceReviewForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "PerformanceSetGoalsCycleForm") {
			res.render("pages/Performance/PerformanceSetGoalsCycleFormPage", {
				Form: "forms/PerformanceSetGoalsCycleForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "RRReportForm") {
			res.render("pages/RRReportFormPage", {
				Form: "forms/RRReportForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "TNDReportForm") {
			res.render("pages/TNDReportFormPage", {
				Form: "forms/TNDReportForm", //the file name in views/ without the ".hbs"
			});
		} else if (FormName == "PMReportForm") {
			res.render("pages/PMReportFormPage", {
				Form: "forms/PMReportForm", //the file name in views/ without the ".hbs"
			});
		}
		// </LAGING NATATANGGAL SA MERGE HAHAHAH>
		// for future forms
		// else if(FormName == "FormName") {
		//     res.render("pages/FormName+Page", {
		//         Form: "forms/FormName" //the file name in views/ without the ".hbs"
		//     });
		// };
	},
	FormOnly: function (req, res) {
		var FormName = req.params.FormName;

		if (FormName == "EmployeeActionForm") {
			res.render("forms/EmployeeActionForm", { data: req.body.data });
		}

		// for future forms
		// else if(FormName == "FormName") {
		//     res.render("pages/FormName+Page", {
		//         Form: "forms/FormName" //the file name in views/ without the ".hbs"
		//     });
		// };
	},
	generatePRF: function (req, res) {
		var businessUnit = req.params.businessUnit;
		var department = req.params.department;
		var position = req.params.position;

		console.log(`${businessUnit} ${department} ${position}`);

		res.render("pages/Personnel_Requisitions/PersonnelRequisitionFormPage", {
			Form: "forms/PersonnelRequisitionForm", //the file name in views/ without the ".hbs"
		});
	},
};

module.exports = tempFormController;

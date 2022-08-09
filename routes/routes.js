const express = require("express");
const app = express();

// initController routes
const initController = require("../controllers/initController.js");
app.get("/", initController.getHome);
app.get("/links", initController.getLinks);
app.get("/Home", initController.getHomepage);
app.get("/getSessionDetails", initController.getSessionDetails);
app.get("/getAllPRFInJSON", initController.getAllPRFInJSON);

// loginController routes
const loginController = require("../controllers/loginController.js");
app.get("/login", loginController.getLogin);
app.post("/login", loginController.postLogin);
app.get("/logout", loginController.getLogout);

// registerController routes
const registerController = require("../controllers/registerController.js");
app.get("/register", registerController.getRegister);
app.post("/register", registerController.postRegister);

// templateController routes

const templateController = require("../controllers/templateController.js");
app.get("/template/chart", templateController.chart);
app.get("/template/dashboard", templateController.dashboard);
app.get("/template/empty", templateController.empty);
app.get("/template/form", templateController.form);
app.get("/template/tab-panel", templateController.tabpanel);
app.get("/template/table", templateController.table);
app.get("/template/ui-elements", templateController.uielements);

// TempFormsController routes

/* Temporary bec standalone forms lang. 
    Forms are formatted as Partials in views/forms folder.
    This way, it can be reused and placed easily in any page (eg. {{> FormName}})
    */

const tempFormController = require("../controllers/tempFormController.js");
app.get("/form/:FormName", tempFormController.FormPage);
app.post("/form/:FormName", tempFormController.FormPage); //this is for ajax/ External recruitment interview feedbacks
app.post("/FormOnly/:FormName", tempFormController.FormOnly); //this is for ajax/ form only using .load()
app.get(
	"/form/PersonnelRequisitionForm/:businessUnit/:department/:position",
	tempFormController.generatePRF
);

// PRFController routes
const PRFController = require("../controllers/Personnel_Requisitions/PRFController.js");
app.get("/PRFTracker", PRFController.PRFTracker);
app.get("/getOnePRFData/:requisitionID", PRFController.getOnePRFData);
app.get("/PRFTracker/:requisitionID", PRFController.PRFIndividual);
app.post("/SubmitPRF", PRFController.SubmitPRF);
app.get("/getNextRequisitionID", PRFController.getNextRequisitionID);
app.post("/DoINeedToApprove", PRFController.DoINeedToApprove);
app.get("/approvePRF/:requisitionID", PRFController.approvePRF);
app.post("/disapprovePRF", PRFController.disapprovePRF);

//OffboardingTrackerController routes
const OffboardingTrackerController = require("../controllers/OffboardingTrackerController.js");
app.get("/ClearanceForm", OffboardingTrackerController.ClearanceForm);
app.get("/OffboardingTracker", OffboardingTrackerController.OffboardingTracker);
app.get(
	"/OffboardingTracker/:_id/:data",
	OffboardingTrackerController.OffboardingIndividual
);

app.get(
	"/OffboardingTracker/:_id",
	OffboardingTrackerController.OffboardingIndividual
);
app.get(
	"/get-offboarding-data",
	OffboardingTrackerController.getOffboardingData
);

//OffboardingController routes
const OffboardingController = require("../controllers/OffboardingController.js");
app.post("/SubmitOffboarding", OffboardingController.SubmitOffboarding);
app.post(
	"/SendNotifToDeptHead/:_id",
	OffboardingController.SendNotifToDeptHead
);
app.get("/getNextOffboardingID", OffboardingController.getNextOffboardingID);
app.post(
	"/checkExistingClearanceFormBeingProcessed",
	OffboardingController.checkExistingClearanceFormBeingProcessed
);

//ClearanceAccountabilityTrackerController routes

const ClearanceAccountabilityTrackerController = require("../controllers/ClearanceAccountabilityTrackerController.js");
app.get(
	"/GetAccountability/:_id",
	ClearanceAccountabilityTrackerController.GetAccountability
);
app.get(
	"/getAllOffboardingData",
	ClearanceAccountabilityTrackerController.GetAccountabilities
);
app.get(
	"/ClearanceAccountabilityTracker",
	ClearanceAccountabilityTrackerController.ClearanceAccountabilityTracker
);

app.get(
	"/ClearanceAccountabilityTracker/:type",
	ClearanceAccountabilityTrackerController.GetAccountabilities
);

app.get(
	"/ClearanceAccountabilityForm/:_id",
	ClearanceAccountabilityTrackerController.ClearanceAccountabilityIndividual
);
app.post(
	"/SubmitClearanceAccountabilityForm",
	ClearanceAccountabilityTrackerController.SubmitClearanceAccountabilityForm
);
app.post(
	"/ApproveClearanceAccountability",
	ClearanceAccountabilityTrackerController.ApproveClearanceAccountability
);
app.post(
	"/ScheduleInterview/:id",
	ClearanceAccountabilityTrackerController.ScheduleInterview
);
app.post(
	"/CompleteInterview/:id",
	ClearanceAccountabilityTrackerController.CompleteInterview
);

//Employee Exit and Action route
const ExitSurveyFormController = require("../controllers/ExitSurveyFormController.js");
app.post("/ExitSurveyForm", ExitSurveyFormController.SubmitExitSurveyForm);
app.get("/ExitSurveyTracker", ExitSurveyFormController.ExitSurveyTracker);
app.get("/GetExitSurvey/:id", ExitSurveyFormController.GetExitSurvey);
app.get(
	"/ExitSurveyTracker/:id",
	ExitSurveyFormController.ExitSurveyTrackerIndividual
);

app.get(
	"/EmployeeExitSurveyForm/:id",
	ExitSurveyFormController.EmployeeExitSurveyForm
);
app.get(
	"/getIndividualExitSurvey/:id",
	ExitSurveyFormController.getIndividualExitSurvey
);

//EmployeeClearance route
const EmployeeClearanceController = require("../controllers/EmployeeClearanceController.js");
app.get("/EmployeeClearance", EmployeeClearanceController.EmployeeClearance);

//ApproveClearance route
const ApproveClearanceController = require("../controllers/ApproveClearanceController.js");
app.get("/ApproveClearance", ApproveClearanceController.ApproveClearance);

//TaskTracker route
const TaskTrackerController = require("../controllers/TaskTrackerController.js");
app.get("/TaskTracker", TaskTrackerController.TaskTracker);
app.get("/get_sorted_notifs", TaskTrackerController.get_tasks);

// JobListingController routes
const JobListingController = require("../controllers/JobListingController.js");
app.get("/JobListing", JobListingController.JobListing);
app.get("/JobDetails", JobListingController.JobDetails);
app.get("/JobDetails/:requisitionID", JobListingController.SpecificJobDetails);
app.get("/ListJobVacancy/:requisitionID", JobListingController.ListJobVacancy);
app.post("/ApplyForJob", JobListingController.ApplyForJob);
app.post("/SubmitApplication", JobListingController.SubmitApplication);

//ApplicantApprovalController routes

const ApplicantApprovalController = require("../controllers/ApplicantApprovalController.js");
app.get("/ApplicantApproval/", ApplicantApprovalController.ApplicantIndividual);
app.get(
	"/ApplicantApproval/:applicationID",
	ApplicantApprovalController.ApplicantIndividual
);
app.get(
	"/getApplicationData/:applicationID",
	ApplicantApprovalController.getApplicationData
);

app.post(
	"/ScheduleInterviewFromApplication",
	ApplicantApprovalController.ScheduleInterviewFromApplication
);
app.post(
	"/submitInitialInterviewForm",
	ApplicantApprovalController.submitInitialInterviewForm
);
app.post(
	"/submitFunctionalInterviewForm",
	ApplicantApprovalController.submitFunctionalInterviewForm
);
app.post(
	"/submitFinalInterviewForm",
	ApplicantApprovalController.submitFinalInterviewForm
);

app.post(
	"/submitForFinalApproval",
	ApplicantApprovalController.submitForFinalApproval
);

app.post(
	"/BUH_approve_summary_of_application",
	ApplicantApprovalController.BUH_approve_summary_of_application
);
app.post(
	"/BUH_disapprove_summary_of_application",
	ApplicantApprovalController.BUH_disapprove_summary_of_application
);
app.post(
	"/submitApplicationFinalApproval",
	ApplicantApprovalController.submitApplicationFinalApproval
);
app.post(
	"/submitEmployeeActionForm",
	ApplicantApprovalController.submitEmployeeActionForm
);

app.get("/SubmitActionForm/:id", ApplicantApprovalController.SubmitActionForm);

app.post(
	"/SubmitActionForm/:id",
	ApplicantApprovalController.submitEmployeeActionForm
);
app.post(
	"/updatePreEmploymentReqs",
	ApplicantApprovalController.updatePreEmploymentReqs
);

app.post(
	"/CompleteApplication",
	ApplicantApprovalController.CompleteApplication
);
app.get(
	"/getApplicantInfoOnly/:applicationID",
	ApplicantApprovalController.getApplicantInfoOnly
);
app.get(
	"/getPossibleInterviewerOptions/:requisitionID",
	ApplicantApprovalController.getPossibleInterviewerOptions
);
app.get("/getPRFData/:requisitionID", ApplicantApprovalController.getPRFData);

//SummaryofApplicationController routes
const SummaryofApplicationController = require("../controllers/SummaryofApplicationController.js");
app.get(
	"/SummaryofApplication",
	SummaryofApplicationController.SummaryofApplicationIndividual
);
app.post(
	"/SummaryOfApplicationContentOnly",
	SummaryofApplicationController.SummaryOfApplicationContentOnly
);

//InterviewTrackerController routes
const InterviewTrackerController = require("../controllers/InterviewTrackerController.js");
app.get("/InterviewTracker", InterviewTrackerController.ScheduledInterviews);

//SummaryofApplicationTrackerController routes

const SummaryofApplicationTrackerController = require("../controllers/SummaryofApplicationTrackerController.js");
app.get(
	"/SummaryofApplicationTracker",
	SummaryofApplicationTrackerController.SummaryofApplications
);

//EmployeeActionTrackerController routes
const EmployeeActionTrackerController = require("../controllers/EmployeeActionTrackerController.js");
app.get(
	"/EmployeeActionTracker",
	EmployeeActionTrackerController.EmployeeActions
);

// app.get('/GetEmployeeActions/:id', EmployeeActionTrackerController.GetEmployeeActions)

//EmployeeActionApprovalController routes
const EmployeeActionApprovalController = require("../controllers/EmployeeActionApprovalController.js");
app.get(
	"/EmployeeActionApproval/",
	EmployeeActionApprovalController.EmployeeActionIndividual
);
app.get(
	"/EmployeeActionApproval/:_id",
	EmployeeActionApprovalController.EmployeeActionIndividual
);
app.get(
	"/getEAFNumberOfRecords/",
	EmployeeActionApprovalController.getNextEAFID
);
app.post("/approve_EAF/", EmployeeActionApprovalController.approve_EAF);
app.post("/disapprove_EAF/", EmployeeActionApprovalController.disapprove_EAF);

//userController routes
const userController = require("../controllers/userController.js");
app.get("/getEmployees", userController.getEmployees);
app.get("/get_employees", userController.get_employees);
app.get("/getAssessmentLength/:position", userController.getAssessmentLength);
app.get(
	"/get-employees-with-same-department",
	userController.getEmployeesSameDept
);
app.get("/getUserPublicInfo/:_id", userController.getUserPublicInfo);

//TrainingNominationFormController routes

const TrainingNominationsController = require("../controllers/TrainingNominationsController.js");
app.post(
	"/submitTrainingNominationForm",
	TrainingNominationsController.SubmitNominationForm
);
app.get(
	"/TrainingNominationTracker",
	TrainingNominationsController.GetAllNominations
);
app.get(
	"/get-training-evaluations",
	TrainingNominationsController.GetTrainingEvaluations
);

app.get(
	"/training-nomination-form/:skill/:_id",
	TrainingNominationsController.TrainingNominationForm
);
app.get("/getNextTrainingID", TrainingNominationsController.GetNextTrainingID);
app.get(
	"/TrainingNominationTracker/:_id",
	TrainingNominationsController.GetSingleTrainingForApproval
);
app.get(
	"/TrainingIndividualTracker/:_id",
	TrainingNominationsController.GetScheduledTraining
);
app.post(
	"/DoINeedToApproveTNF",
	TrainingNominationsController.DoINeedToApproveTNF
);
app.get("/ApproveTNF/:trainingID", TrainingNominationsController.ApproveTNF);
app.post("/DisapproveTNF/", TrainingNominationsController.DisapproveTNF);
app.get(
	"/GetApprovedNominations",
	TrainingNominationsController.GetApprovedNominations
);
app.get(
	"/GetConfirmAttendancePage/:_id",
	TrainingNominationsController.GetConfirmAttendancePage
);
app.get(
	"/get_training_prescription_page",
	TrainingNominationsController.get_training_prescription_page
);
app.post(
	"/UpdateAttendance/:_id",
	TrainingNominationsController.UpdateAttendance
);
app.get(
	"/get_training_recommendation",
	TrainingNominationsController.get_training_recommendation
);
app.get("/get_kpi_list", TrainingNominationsController.get_kpi_list);
app.get("/get_trainings", TrainingNominationsController.get_trainings);
// test
// app.post("/update_date", TrainingNominationsController.update_date);

//for evaluation forms
app.get(
	"/GetTrainingDetailsForEvaluationForm/:_id",
	TrainingNominationsController.GetTrainingDetailsForEvaluationForm
);
app.get(
	"/getNextEvaluationID",
	TrainingNominationsController.GetNextEvaluationID
);
app.post(
	"/AnswerEvaluationForm/:_id",
	TrainingNominationsController.AnswerEvaluationForm
);
app.get(
	"/GetEvaluationForms",
	TrainingNominationsController.GetEvaluationForms
);
app.get(
	"/EvaluationForm/:_id",
	TrainingNominationsController.CheckEvaluationForm
);
app.get(
	"/GetIndividualEvaluationForm/:_id",
	TrainingNominationsController.GetIndividualEvaluationForm
);
app.get(
	"/TrainingTrackerEmployee",
	TrainingNominationsController.TrainingTrackerEmployee
);

//SkillsController routes
const skillsController = require("../controllers/skillsController.js");
app.get("/getNextSkillSetUpID", skillsController.getNextSkillSetUpID);
app.post("/SubmitSkillSetUp", skillsController.SubmitSkillSetUp);
app.post(
	"/SubmitSkillsAssessment/:_id/:date",
	skillsController.SubmitSkillsAssessment
);
app.get(
	"/SkillAssessmentForm/:_id/:date",
	skillsController.SkillAssessmentForm
);
app.get("/getNextAssessmentID", skillsController.getNextAssessmentID);
app.get("/SkillAssessmentTracker", skillsController.SkillAssessmentTracker);
app.get(
	"/SkillAssessmentTrackerSorted/:_id",
	skillsController.SkillAssessmentTrackerSorted
);
app.get(
	"/get-list-of-employees/:_skillSetupID",
	skillsController.SkillsAssessmentListOfEmployees
);
app.get(
	"/SkillAssessmentTracker/:_id",
	skillsController.IndividualSkillAssessment
);
app.get("/GetSkills", skillsController.GetSkills);
app.get("/SkillSetupTracker", skillsController.SkillSetupTracker);
app.get("/SkillSetupTracker/:skillID", skillsController.IndividualSkillSetup);
app.post(
	"/getExistingActiveSkillSetup",
	skillsController.getExistingActiveSkillSetup
);

// Performance
// appraisal
const PerformanceAppraisalTrackerController = require("../controllers/Performance/PerformanceAppraisalTrackerController.js");
app.get(
	"/PerformanceAppraisalTracker",
	PerformanceAppraisalTrackerController.PerformanceAppraisal
);

app.get(
	"/GetAppraisalData/:id",
	PerformanceAppraisalTrackerController.GetAppraisalData
);

app.get(
	"/GetAllAppraisalData",
	PerformanceAppraisalTrackerController.GetAllAppraisalData
);

app.get(
	"/PerformanceAppraisalForm/:id/:date",
	PerformanceAppraisalTrackerController.PerformanceForm
);

app.get(
	"/PerformanceAppraisalForm/:id/:date",
	PerformanceAppraisalTrackerController.PerformanceForm
);

const PerformanceAppraisalIndividualController = require("../controllers/Performance/PerformanceAppraisalIndividualController.js");
app.get(
	"/PerformanceAppraisalIndividual/:id",
	PerformanceAppraisalIndividualController.PerformanceAppraisalIndividual
);

app.get(
	"/PerformanceAppraisalIndividual/:id/:date",
	PerformanceAppraisalIndividualController.PerformanceAppraisalIndividual
);

app.get(
	"/PerformanceAppraisalIndividualPage/:id",
	PerformanceAppraisalIndividualController.PerformanceAppraisalIndividualPage
);

const PerformanceAppraisalFormController = require("../controllers/Performance/PerformanceAppraisalFormController.js");
app.post(
	"/submit-performance-appraisal/:id/:date",
	PerformanceAppraisalFormController.submitAppraisal
);
// cycle
const SetGoalsCycleFormController = require("../controllers/Performance/PerformanceSetGoalsCycleFormController.js");

app.post("/submit-goals-cycle", SetGoalsCycleFormController.submitCycle);

app.get("/GetCycleData/:id/:date", SetGoalsCycleFormController.GetCycleData);

app.get(
	"/PerformanceSetGoalsCycleForm",
	SetGoalsCycleFormController.GetAllCycleData
);
app.get(
	"/get-all-cycles",
	SetGoalsCycleFormController.GetAllCyclesUsingBUnitAndDept
);
app.get("/get_current_cycle", SetGoalsCycleFormController.get_current_cycle);
app.post(
	"/getExistingActiveGoalsCycle",
	SetGoalsCycleFormController.getExistingActiveGoalsCycle
);

// app.get(
//   "/PerformanceSetGoalsCycleForm/:filter",
//   SetGoalsCycleFormController.GetAllCycleData
// );

// app.get("/performance-cycle-list", SetGoalsCycleFormController.getCycleData);
app.get(
	"/PerformanceIndividualGoalsCycle/:id",
	SetGoalsCycleFormController.InvidualView
);
// review
const PerfoReviewCont = require("../controllers/Performance/PerformanceReviewFormController.js");
//performance review
app.get("/PerformanceReviewTracker", PerfoReviewCont.PerformanceReviewTracker);
app.post("/submit-performance-review", PerfoReviewCont.submitReview);

app.get(
	"/PerformanceReviewIndividualPage/:id",
	PerfoReviewCont.PerformanceReview
);
app.get(
	"/get-all-performance-reviews-appraisals",
	PerfoReviewCont.GetAllPerformanceDataByBUnitDepartmentPosition
);

// satisfaction
// const PerformanceSatisfactionTrackerController = require("../controllers/Performance/PerformanceSatisfactionTrackerController.js");
app.get(
	"/PerformanceSatisfactionTracker",
	PerformanceAppraisalTrackerController.PerformanceSatisfaction
);

const PerformanceSatisfactionIndividualController = require("../controllers/Performance/PerformanceSatisfactionIndividualController.js");
app.get(
	"/PerformanceSatisfactionIndividual",
	PerformanceSatisfactionIndividualController.PerformanceSatisfactionIndividual
);

//ExitSurveyTrackerController routes
// const ExitSurveyTrackerController = require("../controllers/ExitSurveyTrackerController.js");
// app.get("/ExitSurveyTracker", ExitSurveyTrackerController.ExitSurveys);

//ExitSurveyIndividualController routes
const ExitSurveyIndividualController = require("../controllers/ExitSurveyIndividualController.js");
app.get(
	"/ExitSurveyIndividual",
	ExitSurveyIndividualController.ExitSurveyIndividualController
);

//ReportTrackerController routes
const ReportTrackerController = require("../controllers/Reports/ReportTrackerController.js");
app.get("/ReportTracker", ReportTrackerController.Report);
app.get("/get-report-data", ReportTrackerController.getReports);
app.get("/ReportTracker/:id", ReportTrackerController.displayReportPage);
app.get("/get-report-data/:id", ReportTrackerController.getReportData);

//DashboardController routes
const DashboardController = require("../controllers/Dashboard/DashboardController.js");

app.post("/Dashboard/submit-report/:section", DashboardController.submitReport);
app.get("/Dashboard/:section", DashboardController.Dashboard);
app.get("/get-chart-data/:section/:model", DashboardController.getChartData);
app.get(
	"/get-chart-data/:section/:model/:startDate/:endDate",
	DashboardController.getChartData
);
app.get("/Dashboard", DashboardController.getDashboardPowerBI);

//ProfileController routes
const ProfileController = require("../controllers/ProfileController.js");
app.get("/Profile", ProfileController.getProfile);

// NotificationsController routes
const NotificationController = require("../controllers/NotificationController.js");

app.get(
	"/get-notifications-page",
	NotificationController.get_notifications_page
);
app.get("/GetMyNotifications", NotificationController.getMyNotifications);
app.post("/SetNotificationSeen", NotificationController.setNotificationSeen);

// PersonalInformationController routes
const PersonalInformationController = require("../controllers/PersonalInformationController.js");
app.post(
	"/postPersonalInformationForm",
	PersonalInformationController.postPersonalInformationForm
);
app.get(
	"/getPersonalInformationData",
	PersonalInformationController.getPersonalInformationData
);
app.get(
	"/PersonalInformationPage",
	PersonalInformationController.getPersonalInformationPage
);
app.get(
	"/deletePersonalInformation",
	PersonalInformationController.deletePersonalInformation
);
app.post(
	"/updatePersonalInformationForm",
	PersonalInformationController.updatePersonalInformationForm
);

// positionsController routes
const PositionsController = require("../controllers/positionsController.js");
app.post(
	"/postRetrieveListOfPositions",
	PositionsController.postRetrieveListOfPositions
);
app.post(
	"/postRetrievePositionDetails",
	PositionsController.postRetrievePositionDetails
);
app.get("/get-positions/:needed", PositionsController.getPositions);
// MyJobApplicationsController routes
const MyJobApplicationsController = require("../controllers/MyJobApplicationsController.js");
app.get(
	"/MyJobApplications",
	MyJobApplicationsController.getMyJobApplicationsPage
);

const ReportsController = require("../controllers/Reports/ReportsController.js");
app.get("/Report/:reportName", ReportsController.getReportPage);
app.get(
	"/getReportData_AnnualRecruitmentReport",
	ReportsController.getReportData_AnnualRecruitmentReport
);

// test Agenda.js
const Agenda = require("../jobs/index.js");
const AgendaScheduler = require("../jobs/scheduler.js");

app.get("/Test-agenda-js/test", AgendaScheduler.scheduler.test);
app.get(
	"/Test-agenda-js/delete_applicants_data_after_6_months",
	AgendaScheduler.scheduler.test2
);
app.get(
	"/Test-agenda-js/TEST_data_deletion_for_offboarding_employee",
	AgendaScheduler.scheduler.TEST_data_deletion_for_offboarding_employee
);

app.get("/test-agenda-page", (req, res) => {
	res.render("test-agenda");
});

// AutomationScheduleController routes
const AutomationScheduleController = require("../controllers/Automation_Schedule/AutomationScheduleController.js");
app.get(
	"/AutomationSchedule",
	AutomationScheduleController.AutomationSchedulePage
);
app.post(
	"/AutomationSchedule/UpdateSchedule",
	AutomationScheduleController.updateSchedule
);

module.exports = app;

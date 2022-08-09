const applicationsModel = require("../../models/applicationsModel");
const exitSurveyModel = require("../../models/exitSurveyModel");
const offboardingModel = require("../../models/offboardingModel");
const trainingEvaluationModel = require("../../models/trainingEvaluationModel");
const trainNomi = require("../../models/trainingNominationModel");
const notificationModel = require("../../models/notificationModel.js");
const perfoAppraisalModel = require("../../models/performance/perfoAppraisalModel");
const userModel = require("../../models/userModel");
const perfoGoalCycleModel = require("../../models/performance/perfoGoalCycleModel");
const perfoReviewModel = require("../../models/performance/perfoReviewModel");
const graphReport = require("../../models/dashboard/graphReport");
const { ObjectId } = require("mongodb");

/**removes the str from the arr */
function removeItem(arr, str) {
  const strIndex = arr.indexOf(str);
  if (strIndex > -1) {
    arr.splice(strIndex, 1);
  }
  return arr;
}

const DashboardController = {
  /**saves the submitted report to the db
   * {
   *    userId: req.session._id
   *    type: req.params.section
   *    submittedBy: req.session.name
   *    dateSubmitted: new Date()
   *    data: req.body
   * }
   *
   * then notifies chrod director
   *
   */
  submitReport: function (req, res) {
    // console.log(req.body);
    // console.log(`${req.session.name}`);
    const submittedBy = `${req.session.name}`;
    const userId = new ObjectId(req.session._id);
    const dateSubmitted = new Date();
    let type;
    switch (req.params.section) {
      case "recret":
        type = "Recruitment & Retention";
        break;
      case "traindev":
        type = "Training & Development";
        break;
      case "perfomgmt":
        type = "Performance Management";
        break;
    }
    const data = req.body;

    const reportData = {
      _id: new ObjectId(),
      userId,
      type,
      submittedBy,
      dateSubmitted,
      data,
    };
    // console.log(reportData);
    const report = new graphReport(reportData);
    report
      .save()
      .then((savedReport) => {
        // notif sa CHROD
        userModel
          .findOne({
            position: "Department Director",
            department: "Corporate Human Resource & Organization Department",
          })
          .then((user) => {
            // console.log(savedReport);
            // save notif
            const notifCHRODDirectorReportSubmitted = new notificationModel({
              _id: new ObjectId(),
              receiver: user,
              date: new Date(),
              description: `A ${type} report has been submitted.`,
              referenceType: "Report",
              reference: savedReport,
            });
            notifCHRODDirectorReportSubmitted
              .save()
              .then //() => console.log("sent to", user.firstName, savedReport)
              ();
            // console.log(notifCHRODDirectorReportSubmitted);
            // console.log(user);
            res.redirect("/");
          });
      })
      .catch((reportErr) => console.error(reportErr));
  },
  /**
   * returns data based on the section and model requested through the parameters
   *
   * valid sections->models:
   *
   * recruitment-retention->applications
   *  -could receive startDate endDate params for query - def: year ago -> now;
   *
   * recruitment-retention->offboarding
   *  -query offboarding data from the last 30 days with status: "Completed";
   *
   * recruitment-retention->exit-survey
   *  -reasonLeave data queried;
   *
   * training-development->training-nomination
   *  -could receive startDate endDate params for query - def: year ago -> now;
   *  -query "employees inclusiveDates" data with status: "Approved";
   *
   * training-development->training-evaluation
   * -could receive startDate endDate params for query - def: year ago -> now;
   * -query trainingDetails.id and program data;
   *    for each unique training id -> title and program object created;
   *    map through data again to get the values for program object;
   *
   * performance-management->perfo-appraisal
   * -could receive startDate endDate params for query - def: year ago -> now;
   * -get appraisal data and store cycle ids and answers;
   * -query cycles within the cycle ids collected getting bu, dept, pos and cycle type;
   *
   * performance-management->perfo-review
   * -could receive startDate endDate params for query - def: year ago -> now;
   * -data is based on submission dates of appraisals;
   * -ratings, key res areas, and user ids are stored for each datum;
   * -query users in the gathered user ids from perfo reviews and store pos, dept, id;
   *
   */
  getChartData: function (req, res) {
    switch (req.params.section) {
      case "recruitment-retention":
        switch (req.params.model) {
          case "applications":
            // recuritment success rate
            // Recruitment Progress Rate
            const dateNow = new Date();
            const startDate =
              req.params.startDate != null
                ? new Date(req.params.startDate)
                : new Date(dateNow.setFullYear(dateNow.getFullYear() - 1));
            const endDate =
              req.params.endDate != null
                ? new Date(req.params.endDate)
                : new Date();
            let applicationApproved = 0;
            let applicationRejected = 0;
            let applicationOthers = 0;
            let applicationTotal = 0;
            let appCurrPendingAssHRManager = 0;
            let appCurrPendingInterviewAssHRManager = 0;
            let appCurrPendingHRPartner = 0;
            let appCurrPendingInterviewHRPartner = 0;
            let appCurrPendingDHead = 0;
            let appCurrPendingInterviewDHead = 0;
            let appCurrPendingBUHead = 0;
            // query
            applicationsModel.find(
              {
                $and: [
                  { applicationDate: { $gte: startDate } },
                  { applicationDate: { $lte: endDate } },
                ],
              },
              function (appErr, applicationsData) {
                if (appErr) return console.error(appErr);
                // get number of approved,rejected,others, total
                applicationTotal = applicationsData.length;
                applicationsData.map((application) => {
                  if (
                    application.approvalAsstHRManager === "Approved" &&
                    application.approvalHRPartner === "Approved" &&
                    application.approvalDHead === "Approved" &&
                    application.approvalBUHead === "Approved"
                  )
                    ++applicationApproved;
                  else if (
                    application.approvalAsstHRManager === "Disapproved" ||
                    application.approvalHRPartner === "Disapproved" ||
                    application.approvalDHead === "Disapproved" ||
                    application.approvalBUHead === "Disapproved"
                  )
                    ++applicationRejected;
                  else ++applicationOthers;
                  switch (application.approvalAsstHRManager) {
                    case "Pending":
                      ++appCurrPendingAssHRManager;
                      break;
                    case "Interview Scheduled":
                      ++appCurrPendingInterviewAssHRManager;
                      break;
                  }
                  switch (application.approvalHRPartner) {
                    case "Pending":
                      ++appCurrPendingHRPartner;
                      break;
                    case "Interview Scheduled":
                      ++appCurrPendingInterviewHRPartner;
                      break;
                  }
                  switch (application.approvalDHead) {
                    case "Pending":
                      ++appCurrPendingDHead;
                      break;
                    case "Interview Scheduled":
                      ++appCurrPendingInterviewDHead;
                      break;
                  }
                  switch (application.approvalBUHead) {
                    case "Pending":
                      ++appCurrPendingBUHead;
                  }
                });
                const applicationsObj = {
                  applicationApproved,
                  applicationRejected,
                  applicationOthers,
                  applicationTotal,
                  appCurrPendingAssHRManager,
                  appCurrPendingInterviewAssHRManager,
                  appCurrPendingHRPartner,
                  appCurrPendingInterviewHRPartner,
                  appCurrPendingDHead,
                  appCurrPendingInterviewDHead,
                  appCurrPendingBUHead,
                };
                res.send(applicationsObj);
              }
            );
            //end of applications model
            break;
          case "offboarding":
            //attrition rate
            const dateLimit = new Date(
              new Date().setDate(new Date().getDate() - 30)
            );
            let Attrition = {
              resignations: 0,
              terminator: 0,
              retirements: 0,
            };
            //  offboarding data within the past 30 days and w completed status
            offboardingModel.find(
              {
                effectiveDate: { $gt: dateLimit },
                status: "Completed",
              },
              function (e, data) {
                if (e) return console.error(e);
                // console.log("data offb", data);
                data.map((d) => {
                  switch (d.natureOfSeparation) {
                    case "Resignation":
                      return ++Attrition.resignations;
                    case "Termination":
                      return ++Attrition.terminator;
                    case "Retirement":
                      return ++Attrition.retirements;
                    default:
                      console.error("Offboarding Model is Corrupted");
                  }
                });
                res.send(Attrition);
              }
            );
            //end of offboarding model
            break;
          case "exit-survey":
            // exit survey model
            let exitSurvey = {
              betterPayelsewhere: 0,
              betterBenefitselsewhere: 0,
              betterJobOpportunitieselsewhere: 0,
              commute: 0,
              conflictwithotherEmployees: 0,
              familyandPersonalReasons: 0,
              relocationMove: 0,
              companyInstability: 0,
              others: 0,
              totalExitSurveys: 0,
            };
            exitSurveyModel.find({}, "reasonLeave", function (e, data) {
              if (e) return console.error(e);
              exitSurvey.totalExitSurveys = data.length;
              data.map((d) => {
                let reasons = d.reasonLeave;
                if (reasons.includes("Better pay elsewhere")) {
                  ++exitSurvey.betterPayelsewhere;
                  removeItem(reasons, "Better pay elsewhere");
                }
                if (reasons.includes("Better benefits elsewhere")) {
                  ++exitSurvey.betterBenefitselsewhere;
                  removeItem(reasons, "Better benefits elsewhere");
                }
                if (reasons.includes("Better job opportunities elsewhere")) {
                  ++exitSurvey.betterJobOpportunitieselsewhere;
                  removeItem(reasons, "Better job opportunities elsewhere");
                }
                if (reasons.includes("Commute")) {
                  ++exitSurvey.commute;
                  removeItem(reasons, "Commute");
                }
                if (reasons.includes("Conflict with other employees")) {
                  ++exitSurvey.conflictwithotherEmployees;
                  removeItem(reasons, "Conflict with other employees");
                }
                if (reasons.includes("Family and personal reasons")) {
                  ++exitSurvey.familyandPersonalReasons;
                  removeItem(reasons, "Family and personal reasons");
                }
                if (reasons.includes("Relocation/move")) {
                  ++exitSurvey.relocationMove;
                  removeItem(reasons, "Relocation/move");
                }
                if (reasons.includes("Company instability")) {
                  ++exitSurvey.companyInstability;
                  removeItem(reasons, "Company instability");
                }
                if (reasons.length > 0) {
                  ++exitSurvey.others;
                }
              });
              res.send(exitSurvey);
            });
            //end of exit survey model
            break;
          default:
            console.error("Invalid Graph Data Query");
        }
        break;
      case "training-development":
        switch (req.params.model) {
          case "training-nomination":
            const dateNowTN = new Date();
            const endDate =
              req.params.endDate != null
                ? new Date(req.params.endDate)
                : new Date();
            const startDate =
              req.params.startDate != null
                ? new Date(req.params.startDate)
                : new Date(
                    new Date().setFullYear(new Date().getFullYear() - 1)
                  );
            let nomination = {
              present: 0,
              late: 0,
              absent: 0,
              completedTrainings: 0,
              totalTrainings: 0,
            };
            // query
            trainNomi.find(
              {
                $and: [
                  { updatedDate: { $gte: startDate } },
                  { updatedDate: { $lte: endDate } },
                  { status: "Approved" },
                ],
              },
              "employees inclusiveDates ",
              function (nomErr, nominationData) {
                if (nomErr) return console.error(nomErr);
                // extract data
                nomination.totalTrainings = nominationData.length;
                nominationData.map((d) => {
                  d.employees.map((emp) => {
                    switch (emp.attendance) {
                      case "Present":
                        ++nomination.present;
                        break;
                      case "Late":
                        ++nomination.late;
                        break;
                      case "Absent":
                        ++nomination.absent;
                        break;
                      default:
                        // console.log(emp.attendance);
                        console.error("Training Nomination Model is Corrupted");
                    }
                  });
                  ++nomination.completedTrainings;
                  d.inclusiveDates.every((date) => {
                    if (new Date(date).getTime() >= dateNowTN.getTime()) {
                      --nomination.completedTrainings;
                      return false;
                    }
                  });
                });
                res.send(nomination);
              }
            );
            //end of training nomination model
            break;
          case "training-evaluation":
            // training eval
            const endDateEval =
              req.params.endDate != null
                ? new Date(req.params.endDate)
                : new Date();
            const startDateEval =
              req.params.startDate != null
                ? new Date(req.params.startDate)
                : new Date(
                    new Date().setFullYear(new Date().getFullYear() - 1)
                  );
            let programDataArr = [];
            trainingEvaluationModel.find(
              {
                $and: [
                  { createdDate: { $gte: startDateEval } },
                  { createdDate: { $lte: endDateEval } },
                ],
              },
              "trainingDetails programUsefulness programAdequacy programSkillsPractice programInstructorKnowledge programInstructorDelivery programFacility programAVSupport programLectureNotes programDuration",
              function (evalErr, evaluationData) {
                if (evalErr) console.error(evalErr);
                let trainingIds = new Array();
                let trainingNames = new Array();
                // get ids and title
                evaluationData.map((d, i) => {
                  const idStr = d.trainingDetails.id.toString();
                  if (!trainingIds.includes(idStr)) {
                    trainingIds.push(idStr);
                    trainingNames.push(d.trainingDetails.trainingTitle);
                    programDataArr.push({
                      id: i,
                      count: 0,
                      programUsefulness: 0,
                      programAdequacy: 0,
                      programSkillsPractice: 0,
                      programInstructorKnowledge: 0,
                      programInstructorDelivery: 0,
                      programFacility: 0,
                      programAVSupport: 0,
                      programLectureNotes: 0,
                      programDuration: 0,
                    });
                  }
                });
                // map again to get program data
                evaluationData.map((d) => {
                  const idStr = d.trainingDetails.id.toString();
                  const index = trainingIds.indexOf(idStr);
                  let obj = programDataArr[index];
                  ++obj.count;
                  obj.programUsefulness += d.programUsefulness;
                  obj.programAdequacy += d.programAdequacy;
                  obj.programSkillsPractice += d.programSkillsPractice;
                  obj.programInstructorKnowledge +=
                    d.programInstructorKnowledge;
                  obj.programInstructorDelivery += d.programInstructorDelivery;
                  obj.programFacility += d.programFacility;
                  obj.programAVSupport += d.programAVSupport;
                  obj.programLectureNotes += d.programLectureNotes;
                  obj.programDuration += d.programDuration;
                });
                res.send({ programDataArr, trainingIds, trainingNames });
                // this works when comparing mongodb object id
                // console.log(
                //   new ObjectId("61c98c4f704a3861d1f93e35").equals(
                //     new ObjectId("61c98c4f704a3861d1f93e35")
                //   )
                // );
              }
            );
            //end of training eval model
            break;
          default:
            console.error("Invalid Graph Data Query");
        }
        break;
      case "performance-management":
        switch (req.params.model) {
          case "perfo-appraisal":
            const endDateSatis =
              req.params.endDate != null
                ? new Date(req.params.endDate)
                : new Date();
            const startDateSatis =
              req.params.startDate != null
                ? new Date(req.params.startDate)
                : new Date(
                    new Date().setFullYear(new Date().getFullYear() - 1)
                  );
            let satisfaction = [];
            let cycleIds = new Set();
            let cycleObj = [];
            perfoAppraisalModel.find(
              {
                $and: [
                  { submissionDate: { $lte: endDateSatis } },
                  { submissionDate: { $gte: startDateSatis } },
                ],
              },
              function (satisErr, satisData) {
                if (satisErr) console.error(satisErr);

                satisData.map((d, i) => {
                  // console.log(d);
                  satisfaction.push({
                    id: i,
                    cycleId: d.cycleId.toString(),
                    rolesRespoAreClear: d.rolesRespoAreClear,
                    enoughOpporToExploSkills: d.enoughOpporToExploSkills,
                    treatment: d.treatment,
                    recognition: d.recognition,
                    workLifeBalance: d.workLifeBalance,
                    superGaveEnouOppor: d.superGaveEnouOppor,
                    teamwork: d.teamwork,
                  });
                  cycleIds.add(d.cycleId.toString());
                });
                const cycleIdsArr = [...cycleIds];
                perfoGoalCycleModel.find(
                  { _id: { $in: cycleIdsArr } },
                  function (cycleErr, cycles) {
                    if (cycleErr) console.error(cycleErr);
                    cycles.map((cycle, i) =>
                      cycleObj.push({
                        id: i,
                        cycleId: cycle._id.toString(),
                        bU: cycle.businessUnit,
                        dept: cycle.department,
                        pos: cycle.position,
                        cycType: cycle.reviewCycle,
                      })
                    );
                    res.send({ satisfaction, cycleIdsArr, cycleObj });
                  }
                );
              }
            );
            // end of perfo appraisal model
            break;
          case "perfo-review":
            const endDateReview =
              req.params.endDate != null
                ? new Date(req.params.endDate)
                : new Date();
            const startDateReview =
              req.params.startDate != null
                ? new Date(req.params.startDate)
                : new Date(
                    new Date().setFullYear(new Date().getFullYear() - 1)
                  );
            let validIds = [];
            let userIdsFromPerfoReviews = [];
            let usersFromPerfoReviews = [];
            let ratings = [];
            let ratingNames = [];
            perfoAppraisalModel.find(
              {
                $and: [
                  { submissionDate: { $lte: endDateReview } },
                  { submissionDate: { $gte: startDateReview } },
                ],
              },
              "_id",
              function (apprErr, apprData) {
                if (apprErr) console.error(apprErr);
                apprData.map((d) => validIds.push(d._id.toString()));
                perfoReviewModel.find(
                  { appraisalId: { $in: validIds } },
                  "kpiRating userId",
                  function (revErr, revData) {
                    if (revErr) console.error(revErr);
                    revData.map((rev, revi) => {
                      // console.log(`${revi} ${rev}`);
                      rev.kpiRating.map((ra) => {
                        ratings.push(ra.rating);
                        ratingNames.push(ra.keyResAreas);
                        userIdsFromPerfoReviews.push(rev.userId.toString());
                      });
                    });
                    // let ratingsNameSet = new Set();
                    userModel.find(
                      { _id: { $in: userIdsFromPerfoReviews } },
                      "position department _id",
                      (userError, userData) => {
                        if (userError) console.error(userError);
                        userData.map((user, userI) => {
                          usersFromPerfoReviews.push({
                            id: userI,
                            userId: user._id.toString(),
                            pos: user.position,
                            dept: user.department,
                          });
                        });
                        const userIdArr = [];
                        usersFromPerfoReviews.map((user) =>
                          userIdArr.push(user.userId)
                        );
                        let ratingPos = new Array(
                          userIdsFromPerfoReviews.length
                        ).fill(0);
                        let ratingDept = new Array(
                          userIdsFromPerfoReviews.length
                        ).fill(0);
                        userIdArr.map((id, idi) => {
                          userIdsFromPerfoReviews.map((ruid, ruidi) => {
                            if (id === ruid) {
                              ratingPos[ruidi] = usersFromPerfoReviews[idi].pos;
                              ratingDept[ruidi] =
                                usersFromPerfoReviews[idi].dept;
                            }
                          });
                        });

                        res.send({
                          ratings,
                          ratingNames,
                          ratingPos,
                          ratingDept,
                        });
                      }
                    );
                  }
                );
              }
            );
            // end of perfo review model
            break;
          default:
            console.error("Invalid Graph Data Query");
        }
        break;
      default:
        console.error("Invalid Dashboard Chart Section Request.");
    }
  },
  /**sets up the dashboard depending on the params
   *
   */
  Dashboard: function (req, res) {
    let dashHTMLData;
    let dashParams;
    const dateNow = new Date();
    const dateNowStr = dateNow.toISOString().substring(0, 10);
    const dateNowMinus5years = new Date(
      dateNow.setFullYear(dateNow.getFullYear() - 5)
    );
    const dateNowMinus5yearsStr = dateNowMinus5years
      .toISOString()
      .substring(0, 10);
    switch (req.params.section) {
      case "recruitment-retention":
        dashHTMLData = [
          {
            title: "Recruitment Success Rate",
            chartId: "rec-suc",
            dateId: "rec",
            minDate: dateNowMinus5yearsStr,
            maxDate: dateNowStr,
            forData: [
              { dataName: "rec-suc", dataId: "applicationApproved" },
              { dataName: "rec-suc", dataId: "applicationRejected" },
              { dataName: "rec-suc", dataId: "applicationOthers" },
              { dataName: "rec-suc", dataId: "applicationTotal" },
            ],
          },
          {
            title: "Recruitment Progress Rate",
            chartId: "rec-prog",
            hr: true,
            forData: [
              { dataName: "rec-prog", dataId: "appCurrPendingAssHRManager" },
              {
                dataName: "rec-prog",
                dataId: "appCurrPendingInterviewAssHRManager",
              },
              { dataName: "rec-prog", dataId: "appCurrPendingHRPartner" },
              {
                dataName: "rec-prog",
                dataId: "appCurrPendingInterviewHRPartner",
              },
              { dataName: "rec-prog", dataId: "appCurrPendingDHead" },
              { dataName: "rec-prog", dataId: "appCurrPendingInterviewDHead" },
              { dataName: "rec-prog", dataId: "appCurrPendingBUHead" },
            ],
          },
          {
            title: "Attrition Rate",
            chartId: "attrition",
            hr: true,
            forData: [
              { dataName: "attrition", dataId: "resignation" },
              { dataName: "attrition", dataId: "terminator" },
              { dataName: "attrition", dataId: "retirement" },
            ],
          },
          {
            title: "Exit Interview Feedback",
            chartId: "exit-int",
            forData: [
              { dataName: "exit-int", dataId: "betterPayelsewhere" },
              { dataName: "exit-int", dataId: "betterBenefitselsewhere" },
              {
                dataName: "exit-int",
                dataId: "betterJobOpportunitieselsewhere",
              },
              { dataName: "exit-int", dataId: "commute" },
              { dataName: "exit-int", dataId: "conflictwithotherEmployees" },
              { dataName: "exit-int", dataId: "familyandPersonalReasons" },
              { dataName: "exit-int", dataId: "relocationMove" },
              { dataName: "exit-int", dataId: "companyInstability" },
              { dataName: "exit-int", dataId: "others" },
              { dataName: "exit-int", dataId: "totalExitSurveys" },
            ],
          },
        ];
        dashParams = "DashboardRecruitmentRetention";
        break;
      case "training-development":
        dashHTMLData = [
          {
            title: "Training Attendance Rate",
            chartId: "train-attend",
            dateId: "train",
            minDate: dateNowMinus5yearsStr,
            maxDate: dateNowStr,
            forData: [
              { dataName: "train-attend", dataId: "present" },
              { dataName: "train-attend", dataId: "late" },
              { dataName: "train-attend", dataId: "absent" },
            ],
            dateRangeTitle:
              "Training Attendance Rate & Completion Rate Date Range",
          },
          {
            title: "Training Completion Rate",
            chartId: "train-complete",
            forData: [
              { dataName: "train-complete", dataId: "completedTrainings" },
              { dataName: "train-complete", dataId: "totalTrainings" },
            ],

            hr: true,
          },
          {
            title: "Post-Event Assessment Rate",
            chartId: "post-event-ass",
            dateId: "traeval",
            dateRangeTitle: "Post-Event Assessment Date Range",
            minDate: dateNowMinus5yearsStr,
            maxDate: dateNowStr,
            scaleDescription: true,
          },
        ];
        dashParams = "DashboardTrainingDevelopment";
        break;
      case "performance-management":
        dashHTMLData = [
          {
            title: "Employee Satisfaction Rating",
            chartId: "emp-sat",
            minDate: dateNowMinus5yearsStr,
            maxDate: dateNowStr,
            dateId: "satis",
            hr: true,
            buDeptFilter: true,
          },
          {
            minDate: dateNowMinus5yearsStr,
            maxDate: dateNowStr,
            title: "Performance Review",
            chartId: "perf-rev",
            dateId: "review",
            rateDes: true,
            forData: [
              { dataName: "perf-rev", dataId: "reviewRatings" },
              { dataName: "perf-rev", dataId: "reviewNames" },
            ],
            deptPosFilter: true,
          },
        ];
        dashParams = "DashboardPerformanceManagement";
        break;
      default:
        console.error("Invalid Dashboard Link.");
    }
    res.render(`pages/Dashboard/${dashParams}`, {
      dashHTMLData,
    });
  },

  getDashboardPowerBI: function (req, res){
    res.render("pages/Dashboard/Dashboard-PowerBI");
  }
};

module.exports = DashboardController;

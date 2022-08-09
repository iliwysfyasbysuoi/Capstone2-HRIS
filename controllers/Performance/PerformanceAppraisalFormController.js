const userModel = require("../../models/userModel.js");
const perfoAppraisalModel = require("../../models/performance/perfoAppraisalModel.js");
const notificationModel = require("../../models/notificationModel.js");
const { ObjectId } = require("bson");

const PerformanceAppraisalFormController = {
  submitAppraisal: function (req, res) {
    // save data in db
    // const cycleId = new ObjectId(req.params._id)
    // test
    const cycleId = req.params.id;
    const cycleDate = req.params.date;
    // console.log("params id", req.params)
    const userId = req.session._id;
    const {
      description,
      results,
      helpfulThingsText,
      agreedKeyActsNextCycText,
      rolesRespoAreClear,
      enoughOpporToExploSkills,
      recommToImporveText,
      mostSatisfEnjText,
      frustrationText,
      treatment,
      recognition,
      workLifeBalance,
      superGaveEnouOppor,
      relationWithSuperText,
      teamwork,
      relationWithTeamText,
    } = req.body;
    let listOfAddTasks = [];
    if (Array.isArray(description)) {
      description.map((desc, i) =>
        listOfAddTasks.push({
          description: desc,
          results: results[i],
        })
      );
    } else
      listOfAddTasks.push({
        description,
        results,
      });
    const submissionDate = new Date();
    const isReviewed = false;
    const data = {
      _id: ObjectId(),
      userId,
      listOfAddTasks,
      cycleId,
      helpfulThingsText,
      agreedKeyActsNextCycText,
      rolesRespoAreClear,
      enoughOpporToExploSkills,
      recommToImporveText,
      cycleDate,
      mostSatisfEnjText,
      frustrationText,
      treatment,
      recognition,
      workLifeBalance,
      superGaveEnouOppor,
      relationWithSuperText,
      teamwork,
      relationWithTeamText,
      submissionDate,
      isReviewed,
    };
    // console.log(data);
    const department = req.session.department;
    const appraisal = new perfoAppraisalModel(data);
    appraisal
      .save()
      .then((data) => {
        userModel
          .find({
            position: { $in: ["Department Head", "HR Assistant Manager"] },
            department: {
              $in: [
                department,
                "Corporate Human Resource & Organization Department",
              ],
            },
          })
          .then((user) => {
            user.map((usr) => {
              let deptHeadDescription = `${req.session.name} has answered the Performance Appraisal Form. Please answer the Performance Review for the employee. Click this notification to be redirected to the form.`;
              let asstHRDescription = `${req.session.name} has answered the Satisfaction Form.`;
              const notifToAnswerAppraisal = new notificationModel({
                _id: ObjectId(),
                receiver: usr,
                date: new Date(),
                description:
                  usr.position === "Department Head"
                    ? deptHeadDescription
                    : asstHRDescription,
                referenceType: "Performance Appraisal Answered",
                reference: data,
                task: 
                  usr.position === "Department Head"
                    ? "Submit Performance Review"
                    :"None"
              });
              notifToAnswerAppraisal.save();
            });
          })
          .catch(() => console.log("walang dept head"));
      })
      .catch((err) => console.error(err));
    // console.log(req.body);
    // console.log(req);
    // const businessUnit = req.session.businessUnit;

    // notif dept head w same (business unit and dept)
    // that notification will redirect dept
    //   head to the performance review of the employee

    // werll dis go?
    res.redirect("/");
  },
};

module.exports = PerformanceAppraisalFormController;

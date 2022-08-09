const exitSurveyModel = require("../models/exitSurveyModel.js");
const notificationModel = require("../models/notificationModel.js");
const userModel = require("../models/userModel.js");
const { ObjectId } = require("bson");

const ExitSurveyFormController = {
  EmployeeExitSurveyForm: function (req, res) {
    // console.log("hello");
    res.render("pages/EmployeeExitSurveyFormPage", {
      offboardingId: req.params.id,
    });
  },
  SubmitExitSurveyForm: function (req, res) {
    const employee = req.session;
    // console.log(req.params);

    const reasons = req.body.reasonLeave;
    const reasonLeave = Array.isArray(reasons)
      ? reasons.filter((item) => item != "on")
      : [reasons];
    let exitSurvey = new exitSurveyModel({
      ...req.body,
      _id: new ObjectId(),
      employee,
      reasonLeave: reasonLeave,
      referenceId: req.session.id,
      submitDate: new Date(Date.now()),
    });

    exitSurvey
      .save()
      .then((data) => {
        userModel.findOne(
          //change this query to the HR officer
          {
            //query
            position: "HR Supervisor",
          },
          function (err, HR) {
            var notifications = new notificationModel({
              _id: new ObjectId(),
              receiver: HR,
              isSeen: false,
              description: `${req.session.name} employee has answered the survey form`,
              date: new Date(Date.now()),
              //change this reference type din kung anong type
              referenceType: "exitsurvey",
              reference: data,
            });
            notifications
              .save()
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
          }
        );
      })
      .catch((err) => console.log(err));

    res.redirect("/");
  },
  ExitSurveyTracker: function (req, res) {
    let positions = [];
    exitSurveyModel.find({}, function (err, ExitSurveyData) {
      if (err) console.error(err);
      ExitSurveyData.map(function (e, ei) {
        // console.log(positions);
        if (!positions.includes(e.employee.position))
          positions.push(e.employee.position);
      });
      // console.log(positions);
      res.render("pages/ExitSurveyFormTrackerPage", {
        ExitSurveyData,
        positions,
      });
    });
  },
  GetExitSurvey: function (req, res) {
    exitSurveyModel
      .findOne({
        offboardingId: req.params.id,
      })
      .then((data) => {
        if (data) {
          // console.log(data);
          res.send({ data: true, id: data._id });
        } else {
          res.send({ data: false });
        }
      })
      .catch((err) => {});
  },
  ExitSurveyTrackerIndividual: function (req, res) {
    const id = req.params.id;
    exitSurveyModel.findOne(
      {
        _id: id,
      },
      function (err, ExitSurveyData) {
        res.render(`pages/ExitSurveyIndividualPage`, {
          ExitSurveyData: ExitSurveyData,
        });
      }
    );
  },
  getIndividualExitSurvey: function (req, res) {
    const id = req.params.id;
    exitSurveyModel.findOne(
      {
        _id: id,
      },
      function (err, ExitSurveyData) {
        res.send(ExitSurveyData);
      }
    );
  },
};

module.exports = ExitSurveyFormController;

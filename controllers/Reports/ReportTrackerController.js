const graphReport = require("../../models/dashboard/graphReport");

const ReportTrackerController = {
  /**gets and sends the data for the certain report */
  getReportData: function (req, res) {
    graphReport.find(
      {
        _id: req.params.id,
      },
      "data",
      function (repErr, repData) {
        // console.log(repData);
        if (repErr) console.error(repErr);
        res.send(repData);
      }
    );
  },
  /**sets up the report page */
  displayReportPage: function (req, res) {
    graphReport.find(
      {
        _id: req.params.id,
      },
      "type dateSubmitted",
      function (oneGErr, oneGData) {
        // console.log(oneGData);
        if (oneGErr) console.error(oneGErr);
        let otherData = [];
        switch (oneGData[0].type) {
          case "Recruitment & Retention":
            oneGData.recret = true;
            otherData = [
              {
                title: "Recruitment Success Rate",
                chartId: "rec-suc",
              },
              {
                title: "Recruitment Progress Rate",
                chartId: "rec-prog",
                hr: true,
              },
              {
                title: "Attrition Rate",
                chartId: "attrition",
                hr: true,
              },
              {
                title: "Exit Interview Feedback",
                chartId: "exit-int",
              },
            ];

            break;
          case "Training & Development":
            oneGData.traindev = true;
            otherData = [
              {
                title: "Training Attendance Rate",
                chartId: "train-attend",
              },
              {
                title: "Training Completion Rate",
                chartId: "train-complete",
                hr: true,
              },
              {
                title: "Post-Event Assessment Rate",
                chartId: "post-event-ass",
                scaleDescription: true,
              },
            ];
            break;
          case "Performance Management":
            oneGData.perfomgmt = true;
            otherData = [
              {
                title: "Employee Satisfaction Rating",
                chartId: "emp-sat",
                hr: true,
                buDeptFilter: true,
              },
              {
                title: "Performance Review",
                chartId: "perf-rev",
                rateDes: true,
                deptPosFilter: true,
              },
            ];
            break;
        }
        const reportZip = {
          oneGData,
          otherData,
          id: req.params.id,
        };
        console.log(reportZip);
        res.render("pages/Reports/ReportPage", reportZip);
      }
    );
  },
  /**renders reports tracker page */
  Report: function (req, res) {
    res.render("pages/Reports/ReportTrackerPage");
  },
  /**sends list of reports and filter boolean if user is the chrod director */
  getReports: function (req, res) {
    let findObj = {};
    let chrodDirector = false;
    if (
      !(
        req.session.position === "Department Director" &&
        req.session.department ===
          "Corporate Human Resource & Organization Department"
      )
    )
      findObj.userId = req.session._id;
    else {
      chrodDirector = true;
    }
    // console.log(findObj);
    graphReport.find(
      findObj,
      "type submittedBy dateSubmitted _id",
      function (graphErr, reports) {
        if (graphErr) console.error(graphErr);
        // console.log(graphData);
        res.send({
          reports,
          chrodDirector,
        });
      }
    );
  },
};

module.exports = ReportTrackerController;

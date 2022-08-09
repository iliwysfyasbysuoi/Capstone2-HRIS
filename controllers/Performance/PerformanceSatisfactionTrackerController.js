const PerformanceSatisfactionTrackerController = {
  PerformanceSatisfaction: function (req, res) {
    PerformanceSatisfactionData = [
      {
        formID: "1",
        name: "John Doe",
        position: "Accountant",
        department: "Finance & Treasury",
        businessUnit: "Unit Circle, Inc.",
        submissionDate: "01/31/2021",
      },
    ];
    console.log(PerformanceSatisfactionData)
    res.render("pages/Performance/PerformanceSatisfactionTrackerPage", {
      PerformanceSatisfactionData: PerformanceSatisfactionData,
    });
  },
};

module.exports = PerformanceSatisfactionTrackerController;

const PerformanceSatisfactionIndividualController = {
  PerformanceSatisfactionIndividual: function (req, res) {
    PerformanceSatisfactionIndividualData = [{}];

    res.render("pages/Performance/PerformanceSatisfactionIndividualPage", {
      PerformanceSatisfactionIndividualData:
        PerformanceSatisfactionIndividualData,
    });
  },
};

module.exports = PerformanceSatisfactionIndividualController;

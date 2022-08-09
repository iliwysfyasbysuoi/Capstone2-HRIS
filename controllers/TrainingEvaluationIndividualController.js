const TrainingEvaluationIndividualController = {

    TrainingEvaluationIndividual: function (req, res) {

        TrainingEvaluationIndividualData = [
            {
                
                
            }
        ]

        res.render("pages/TrainingEvaluationIndividualPage", {
            TrainingEvaluationIndividualData:TrainingEvaluationIndividualData
        });
    }
}

module.exports = TrainingEvaluationIndividualController;
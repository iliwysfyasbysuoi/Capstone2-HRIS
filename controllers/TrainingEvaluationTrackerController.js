const TrainingEvaluationTrackerController = {

    TrainingEvaluations: function (req, res) {

        TrainingEvaluationTrackerData = [
            {
                trainingID: "1",
                trainingNTitle: "Training Program Title", 
                trainingParticipant: "John Doe",
                position: "Accountant",
                department: "Finance & Treasury",
                submissionDate: "01/31/2021"
                
            }
        ]

        res.render("pages/TrainingEvaluationTrackerPage", {
            TrainingEvaluationTrackerData:TrainingEvaluationTrackerData
        });
    }
}

module.exports = TrainingEvaluationTrackerController;
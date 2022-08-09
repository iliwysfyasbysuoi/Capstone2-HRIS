const TrainingTrackerController ={
    TrainingIndividualList: function(req,res){

        TrainingData = [
            {
                trainingID: "1",
                trainingTitle: "Training Title",
                trainingVenue: "Training Venue",
                trainingDate: "1/1/2021"

                
            }
        ]
        res.render("pages/TrainingTrackerPage", {
            TrainingData:TrainingData
            
        });
    }


}

module.exports = TrainingTrackerController;
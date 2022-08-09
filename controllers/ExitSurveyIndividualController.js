const ExitSurveyIndividualController = {

    ExitSurveyIndividualController: function (req, res) {

        ExitSurveyIndividualData = [
            {
                
                
            }
        ]

        res.render("pages/ExitSurveyIndividualPage", {
            ExitSurveyIndividualData:ExitSurveyIndividualData
        });
    }
}

module.exports = ExitSurveyIndividualController;
const SkillsAssessmentIndividualController = {

    SkillsAssessmentIndividual: function (req, res) {

        SkillsAssessmentIndividualData = [
            {
                
                
            }
        ]

        res.render("pages/SkillsAssessmentIndividualPage", {
            SkillsAssessmentIndividualData:SkillsAssessmentIndividualData
        });
    }
}

module.exports = SkillsAssessmentIndividualController;


const applicationsModel = require('../models/applicationsModel.js');

const { ObjectId } = require('mongodb');

const SummaryofApplicationController = {

    SummaryofApplicationIndividual: function(req,res){

        ScheduledInterviewsData = [
            {
                applicationID: "1",
                name: "Juan Dela Cruz",
                positionTitle: "Accountant",
                businessUnit: "Circle Corporation Inc.",
                department: "Finance & Treasury",
                interviewDateString: "01/12/2021",
                approvedDateString: "01/12/2021",
                status: "Approved"

                
            }
        ]
        res.render("pages/SummaryofApplicationPage", {
            ScheduledInterviewsData:ScheduledInterviewsData
            
        });
    },

    SummaryOfApplicationContentOnly: function(req,res){

        var applicationID = req.body.applicationID
       
    
        applicationsModel.findOne( {_id: ObjectId(applicationID) }, function(err, ApplicationData){

            //computes for total rating initial interview
            var initialFeedback = ApplicationData.initialInterviewFeedback;
            ApplicationData.initialInterviewFeedback.totalRating = initialFeedback.pbac + initialFeedback.ic_skills + initialFeedback.work_history+ initialFeedback.functional_skills + initialFeedback.personality + initialFeedback.impression;

            //computes for total rating functional interview
            var functionalFeedback = ApplicationData.functionalInterviewFeedback;
            ApplicationData.functionalInterviewFeedback.totalRating = functionalFeedback.practical_experience + functionalFeedback.functional_expertise + functionalFeedback.management_skills + functionalFeedback.response_resource + functionalFeedback.self_management + functionalFeedback.impression;

            //computes for total rating final interview
            var finalFeedback = ApplicationData.finalInterviewFeedback;
            ApplicationData.finalInterviewFeedback.totalRating = finalFeedback.org_fit + finalFeedback.core_values + finalFeedback.leadership + finalFeedback.innovation + finalFeedback.accountability + finalFeedback.personal_effectiveness + finalFeedback.potential_growth + finalFeedback.overall_impression;

            console.log(ApplicationData.functionalInterviewFeedback);
            res.render("pages/SummaryOfApplicationPageContentOnly", {
                ApplicationData:ApplicationData
            });
        })
    }


}

module.exports = SummaryofApplicationController;
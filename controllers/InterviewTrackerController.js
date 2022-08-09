const interviewModel = require('../models/interviewScheduleModel.js');


const InterviewTrackerController = {
    ScheduledInterviews: function (req, res) {
        const userEmail = req.session.email
        console.log(userEmail)



        interviewModel.find(
            {
                "interviewer.email": userEmail,
                status: "Pending"
            }
        )
            .then(result => {
                res.render("pages/InterviewTrackerPage", {
                    ScheduledInterviewsData: result
                });
            })



    }


}

module.exports = InterviewTrackerController;



const SummaryofApplicationTrackerController ={
    SummaryofApplications: function(req,res){

        SummaryofApplicationsData = [
            {
                applicationID: "1",
                name: "Juan Dela Cruz",
                positionTitle: "Accountant",
                businessUnit: "Circle Corporation Inc.",
                department: "Finance & Treasury",
                targetStartDateString: "01/12/2021",
                status: "For Approval"

                
            }
        ]
        res.render("pages/SummaryofApplicationTrackerPage", {
            SummaryofApplicationsData:SummaryofApplicationsData
            
        });
    }


}

module.exports = SummaryofApplicationTrackerController;

const ApproveClearanceController ={
    ApproveClearance: function(req,res){
        ApproveClearanceData = [
            {
                department: "Information Technology",
                accountabilityName: "Accountability 1", 
                accountabilityStatus: "Approved",
                approver: "John Doe",
                signedDate: "01/31/2021"
                
            },
            {
                department: "Supply Chain & Administration",
                accountabilityName: "Accountability 2", 
                accountabilityStatus: "Approved",
                approver: "Juan Dela Cruz",
                signedDate: "01/31/2021"
                
            },
            {
                department: "Accounting and Finance",
                accountabilityName: "Accountability 3", 
                accountabilityStatus: "Approved",
                approver: "Gil Puyat",
                signedDate: "01/31/2021"
                
            }
        ]
        res.render("pages/ApproveClearancePage", {
            ApproveClearanceData:ApproveClearanceData
        });
    }

    
    

}

module.exports = ApproveClearanceController;


const TNDNeedsController ={
    TNDNeeds: function(req,res){

        TNDNeedsData = [
            {
                jobarea: "Job Area 1",
                tndreq: "TND Requirement 1", 
                
            }
        ]
        res.render("pages/TNDNeedsFormPage", {
            TNDNeedsData:TNDNeedsData
            
        });
    }


}

module.exports = TNDNeedsController;
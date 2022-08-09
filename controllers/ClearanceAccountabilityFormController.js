const ClearanceAccountabilityFormController = {

    ClearanceAccountabilityForm: function (req, res) {

        ClearanceAccountabilityFormData = [
            {
                accountabilityName: "Accountability 1",
                accountabilityStatus: "Pending"
                
            },
            {
                accountabilityName: "Accountability 2",
                accountabilityStatus: "On-Hold"
                
            },
            {
                accountabilityName: "Accountability 3",
                accountabilityStatus: "Approved"
                
            }
        ]

        res.render("pages/ClearanceAccountabilityFormPage", {
            ClearanceAccountabilityFormData:ClearanceAccountabilityFormData,
        });
    }
}

module.exports = ClearanceAccountabilityFormController;
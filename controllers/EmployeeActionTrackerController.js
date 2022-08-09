
const employeeActionFormModel = require('../models/employeeActionFormModel.js');

const EmployeeActionTrackerController = {
    EmployeeActions: function (req, res) {

        var validPosition = ["HR Supervisor", "Department Head", "Business Unit Head", "Department Director", "HR Specialist", "HR Officer", "HR Assistant Manager"]
        const { position, department, businessUnit } = req.session
        if (validPosition.includes(position)) {
            employeeActionFormModel.find({}, function (err, EmployeeActionsData) {
                switch (position) {
                    case validPosition[0]:
                        res.render("pages/EmployeeActionTrackerPage", {
                            EmployeeActionsData: EmployeeActionsData
                        });
                        break;
                    case validPosition[1]:
                        res.render("pages/EmployeeActionTrackerPage", {
                            EmployeeActionsData: EmployeeActionsData.filter(data => (data.approvalDHead.approver && data.approvalDHead.approver.department === department) && (data.approvalDHead.approver && data.approvalDHead.approver.businessUnit === businessUnit))
                        });
                        break;
                    case validPosition[2]:
                        res.render("pages/EmployeeActionTrackerPage", {
                            EmployeeActionsData: EmployeeActionsData.filter(data => data.approvalDHead.approver && data.approvalDHead.approver.businessUnit === businessUnit)
                        });
                        break;
                    case validPosition[3]:
                        if (department === "Corporate Human Resource & Organization Department") {
                            res.render("pages/EmployeeActionTrackerPage", {
                                EmployeeActionsData: EmployeeActionsData
                            });
                        }
                        break;
                    case validPosition[4]:
                        res.render("pages/EmployeeActionTrackerPage", {
                            EmployeeActionsData: EmployeeActionsData.filter(data => data.businessUnit  === "LNL Archipelago Minerals")
                        });
                        break;
                    case validPosition[5]:
                        res.render("pages/EmployeeActionTrackerPage", {
                            EmployeeActionsData: EmployeeActionsData.filter(data => data.businessUnit  === "Petrolift")
                        });
                        break;
                    default:
                        res.redirect("back");

                }
            })
        }
        else {
            res.redirect("back");
        }


    }


}

module.exports = EmployeeActionTrackerController;

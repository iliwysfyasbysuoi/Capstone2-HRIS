const PRFModel = require('../models/PRFModel.js');
const notificationModel = require('../models/notificationModel.js');
const applicationsModel = require('../models/applicationsModel.js');
const userModel = require('../models/userModel.js');
const personalInformationsModel = require('../models/personalInformationsModel.js');
const { ObjectId } = require('bson');


// converts date string yyyy-mm-dd to Date data 
function YYYYMMDDtoDate(date) {
    var sendDate = date.getFullYear() + "-" + (date.getMonth() + 1) +
        "-" + ("0" + date.getDate()).slice(-2) +
        "T" + ("0" + date.getHours()).slice(-2) + ":" +
        ("0" + date.getMinutes()).slice(-2) + ":" +
        ("0" + date.getSeconds()).slice(-2) +
        ".000+08:00";

    console.log("sendDate " + sendDate);

    return sendDate;

}

function getHRpartnerPosition(businessUnit) {

    var HRPartner;
    switch (businessUnit) {
        case "Petrolift":
            HRPartner = "HR Officer";
            break;
        case "Circle Corporation Inc.":
            HRPartner = "HR Officer";
            break;
        case "LNL Archipelago Minerals":
            HRPartner = "HR Specialist";
            break;
        case "Leonio Land":
            HRPartner = "HR Supervisor";
            break;

    }

    return HRPartner;

}

const JobListingController = {

    JobListing: function (req, res) {
        PRFModel.find({ status: "Open" }, function (err, JobListingList) {
            res.render("pages/JobListingPage", {
                JobListingList: JobListingList
            });
        })


    },

    // NOTE: this is decpreciated. this is only used for testing the template
    // job details page is being accessed with an ID, 
    // so refer to SpecificJobDetails instead
    JobDetails: function (req, res) {


        JobDetailsList = [
            {
                positionTitle: "IT Intern",
                employmentType: "Full Time",
                businessUnit: "Petrolift",
                department: "Information Technology",
                location: "Alabang",
                description: "Assists in tasks specific to assigned department for internship. Tasks include monitoring department-specific projects.",
                requirements: "List of Pre-Employment Requirements"
            }
        ]

        JobApplicationData = [
            {
                applicationID: "1",
                name: "Juan Dela Cruz",
                positionTitle: "Accountant",
                businessUnit: "Circle Corporation Inc",
                department: "Finance & Treasury",
                applicationDateString: "01/01/2021",
                targetStartDateString: "01/01/2021",
                approvedDateString: "01/01/2021",
                status: "For Approval"

            }
        ]

        res.render("pages/JobDetailsPage", { JobDetailsList: JobDetailsList, JobApplicationData: JobApplicationData });
    },


    // specific Job Details PAge
    // accessed through /JobDetails/:requisitionID
    SpecificJobDetails: function (req, res) {


        var requisitionID = Number(req.params.requisitionID);
        console.log("position " +req.session.position);


        PRFModel.findOne({ requisitionID: requisitionID }, function (err, PRF) {
            applicationsModel.find({"requisition_id": requisitionID}, function (err, JobApplicationData){
                var user_id = req.session._id;
                if (PRF != null) {

                    // console.log("JobApplicationData: " + JobApplicationData);


                    if(req.session.position == undefined){
                        res.render("pages/JobDetailsPage", { 
                            JobDetailsList: PRF,
                            canSee: "false",
                            canApply: "false"
                        });
                    }
                    else if(req.session.position == "HR Director" || req.session.position == "HR Assistant Manager" 
                    ||req.session.position == "HR Officer" ||req.session.position == "HR Specialist" ||req.session.position == "HR Supervisor"
                    ||req.session.position == "Department Head" || req.session.position == "Business Unit Head"
                    || req.session.position == "Department Director"){
                        // if position is the following, show applicants list
                        res.render("pages/JobDetailsPage", { 
                            JobDetailsList: PRF,
                            JobApplicationData: JobApplicationData,
                            canSee: "true",
                            canApply:"false"
                        });

                    }else{
                        applicationsModel.findOne({ "user._id": ObjectId(user_id), "requisition_id": requisitionID}, function (err, applicationResult) {
                            console.log("user_id "+ user_id+ " requisitionID " + requisitionID);
                            console.log("applicationResult " + applicationResult);
                            if (applicationResult != null) {
                                // if may application na si user sa job na to canApply: "false"
                                res.render("pages/JobDetailsPage", { 
                                    JobDetailsList: PRF,
                                    canSee: "false",
                                    canApply: "false",
                                    existingApplicationNotice: "You already applied for this position."
                                });
                            
                            }else{
                                res.render("pages/JobDetailsPage", { 
                                    JobDetailsList: PRF,
                                    canSee: "false",
                                    canApply: "true"
                                });
                            }

                            
                        })
                        
                    }
                    

                } else {
                    res.render("pages/errorPage", {
                        err: err
                    })
                }
            })

            
        })

    },

    ListJobVacancy: function (req, res) {

        var requisitionID = req.params.requisitionID;
        console.log("requisitionID : " + requisitionID);

        var curDate = new Date(Date.now());
        console.log("curDate: " + curDate);
        // var listDate = new Date(YYYYMMDDtoDate(curDate));
        var listDate = curDate;

        console.log("listDate: " + listDate);

        PRFModel.updateOne({ requisitionID: requisitionID },
            { $set: { listDate: listDate, status: "Open" } },
            function () {

                PRFModel.findOne({ requisitionID: requisitionID }, function (err, PRFDetails) {

                    // notify createdBy that the PRF is now listed as job vacancy
                    var notifications = new notificationModel(
                        {
                            _id: new ObjectId(),
                            receiver: PRFDetails.createdBy,
                            isSeen: false,
                            description: `Your Personnel Requisition #${requisitionID} has been approved and is now listed as a job vacancy.`,
                            date: listDate,
                            referenceType: "PRF",
                            reference: PRFDetails
                        }
                    );
                    notifications.save();

                    res.redirect('back');
                })

            })

    },

    ApplyForJob: function (req, res) {

        var requisitionID = Number(req.body.requisitionID);
        var user_id = req.session._id
        console.log(requisitionID);

        personalInformationsModel.findOne({ 'user._id': ObjectId(user_id) }, function (err, personalInformationResult) {

            if (personalInformationResult == null) {
                // if no personal information record yet
                // send alert that there's no personal information record yet
                // in frontend: user will be shown this error and be prompted to submit personal information
                var resData = "No Personal Information";
                res.send(resData);
            }
            else {
                // else, if may personal information na, check if application na for the job

                applicationsModel.findOne({ "user._id": ObjectId(user_id), "requisition_id": requisitionID}, function (err, applicationResult) {
                    if (applicationResult != null) {
                        // if may application na si user sa job na to, 
                        // send alert that meron na
                        // in frontend: user will be shown this error

                        var resData = "Already Applied";
                        res.send({resData: resData, applicationID: applicationResult._id});

                    }
                    else {
                        // else, if wala pa, then continue with application process.


                        // shows the final step. the actual submission of application is on function SubmitApplication
                        var resData = "Show Final Step";
                        res.send(resData);




                    }
                })
            }
        })
    },

    SubmitApplication: function (req, res) {
        // get User, Personal Information, and Requisition then the applicationDate and opening-apply
        // then create new Applications Object 

        var requisitionID = req.body.requisitionID;
        var user_id = req.session._id;
        var opening_apply = req.body.opening_apply;
        var curDate = new Date();

        userProjection = " _id email firstName middleName lastName nickName userType businessUnit department position personalEmail employmentDate"
        userModel.findOne({ _id: req.session._id }, userProjection, function (err, userData) {
            personalInformationsModel.findOne({ 'user._id': ObjectId(req.session._id) }, function (err, personalInformationData) {
                PRFModel.findOne({ requisitionID: requisitionID }, function (err, PRFData) {

                    var businessUnit = PRFData.businessUnit;
                    var DHead_id = PRFData.approvalDHead.approver._id;
                    /**  finding the HR Partner Approver **/
                    userModel.findOne(
                        {   //query
                            businessUnit: "Circle Corporation Inc.",
                            department: "Corporate Human Resource & Organization Department",
                            position: getHRpartnerPosition(businessUnit)
                        },
                        //variables to get
                        '_id',
                        function (err, HRPartner) {
                            if (err) throw err;

                            var HRPartner;
                            HRPartner_id = HRPartner._id; 


                            var curDate = new Date(Date.now());
                            // var applicationDate = new Date(YYYYMMDDtoDate(curDate));

                            var applicationData = {
                                _id: new ObjectId(),
                                user: userData,
                                personalInformation_id: personalInformationData._id,
                                requisition_id: PRFData.requisitionID,
                                applicationDate: curDate,
                                openingApply: opening_apply,
                                HRPartner_id: HRPartner_id,
                                DHead_id: DHead_id
                            };
        
                            var applicationObject = new applicationsModel(applicationData);
                            applicationObject.save();

                            var notificationToHRPartner = new notificationModel({
                                _id: new ObjectId(),
                                receiver: {
                                    _id: HRPartner_id
                                },
                                isSeen: false,
                                description: `Application from ${applicationData.user.firstName} ${applicationData.user.lastName} for Requisition #${applicationData.requisition_id} received. Schedule initial interview now.`,
                                date: curDate,
                                referenceType: "Application",
                                reference: applicationData,
                                task: "Schedule Initial Interview"
                            })
                            notificationToHRPartner.save();
                            
        
                            res.send("Successfuly Applied");



                        }
                    );
            
                    
                   



                })
            })
        })
    }
}

module.exports = JobListingController;
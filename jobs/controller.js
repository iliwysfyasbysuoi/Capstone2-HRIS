const { ObjectId } = require("mongodb");
const applicationsModel = require("../models/applicationsModel.js");
const userModel = require("../models/userModel.js");
const interviewScheduleModel = require("../models/interviewScheduleModel.js");
const notificationModel = require("../models/notificationModel.js");
const employeeActionFormModel = require("../models/employeeActionFormModel.js");
const offboardingModel = require("../models/offboardingModel.js");
const personalInformationsModel = require("../models/personalInformationsModel.js");
const PRFModel = require("../models/PRFModel.js");
const skillSetupModel = require("../models/skillSetupModel.js");
const goalCycleModel = require("../models/performance/perfoGoalCycleModel.js");
const testModel = require("../models/testModel.js");
// const { resolve } = require("path");

const JobsController = {
    testJobsController: function (data) {

        try {
            return new Promise((resolve, reject) => {
                // console.log(`req: ${data}`);

                var test = new testModel({
                    _id: ObjectId(),
                    description: "Agenda Test Worked from controller"
                })

                test.save();



                resolve("oke");
            });
        } catch (e) {
            if (e) throw e;
        }



    },
    test: function (job) {

        console.log("controller.js job + " + JSON.stringify(job))
        console.log(job.attrs);

        try {

            let description = job.attrs.data.description;
            let job_id = job.attrs._id;

            var test = new testModel({
                _id: ObjectId(),
                description: description + " from controller.test",
                job_id: job_id
            })

            test.save();

            console.log(description + "from controller.test");

        } catch (e) {
            if (e) console.log(e)
            else console.log()


        }
    },
    /**
     * 
     * @param {*} job the job data.
     * @param {*} job.attrs.data the data passed along the job/scheduled task
     * 
     * TODO: What's happening
     * [x] get applications from the target PRF  (status != "Transferred", "Employed")
     * [x] for each application/applicant, check if they have other applications after the applicationDate of the current application.
     *      if wala, then do the ff
     *      [x] delete PIF of the user
     *      [x] delete all notifications related to the deleted applications (in next step) because mage-error sa task/notifs if hindi i-delete.
     *      [x] delete applications of the user //removed
     *      [x] delete notifications of the user
     *      [x] delete account of the user
     * 
     * NOTES:
     *      1. In scheduler.js, the schedule is still set to "1 second" for testing purposes. To set the actual schedule, change to "6 months"
     */
    dataDeletionForInactiveApplicants: async function (job) {

        /**
         * REMINDER: In ApplicationApprovalController.js, to reference this, input:
         *  Scheduler.scheduler.delete_applicants_data_after_6_months({object of data here})
         */
        console.log("job executed: dataDeletionForInactiveApplicants");
        console.log("job.attrs: " + JSON.stringify(job.attrs));

        const deletePIF = async (user_id) => {
            new Promise((resolve, reject) => {
                personalInformationsModel.deleteOne({ 'user._id': user_id }, function (err, result) {
                    console.log("deletePIF deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }

        /**
         * Deletes notifs related to the application.
         * @param {*} user_id 
         * 
         */
        const deleteNotifsRelatedToApplication = async (user_id) => {
            new Promise((resolve, reject) => {

                const deleteNotifs = async (app_id) => {
                    new Promise((resolve, reject) => {
                        notificationModel.deleteMany({ 'referenceType': 'Application', 'reference._id': app_id }, function (err, result) {
                            console.log(`notifs related to application ${app_id} deletedCount: ${result.deletedCount}`);
                            resolve(result.deletedCount);
                        })
                    })
                }

                var totalDeleteCount = 0;
                applicationsModel.find({ 'user._id': user_id }, async function (err, applicationsData) {
                    console.log("applicationsData.length " + applicationsData.length);
                    for (let i = 0; i <= applicationsData.length; i++) {
                        if (i == applicationsData.length) {
                            resolve(totalDeleteCount);
                        } else {
                            let app_id = applicationsData[i]._id;
                            let deletedCount = await deleteNotifs(app_id);
                        }
                    }
                })
            })
        }

        const deleteApplication = async (user_id) => {
            new Promise((resolve, reject) => {

                applicationsModel.deleteMany({ 'user._id': user_id }, function (err, result) {
                    console.log("deleteApplication deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }

        const deleteUserNotifs = async (user_id) => {
            new Promise((resolve, reject) => {
                notificationModel.deleteMany({ 'receiver._id': user_id }, function (err, result) {
                    console.log("deleteUserNotifs deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }

        const deleteUser = async (user_id) => {
            new Promise((resolve, reject) => {
                userModel.deleteOne({ '_id': user_id }, function (err, result) {
                    console.log("deleteUser deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }


        try {
            let requisitionID = job.attrs.data.requisitionID;
            console.log("requisitionID: " + requisitionID);
            // gets applications for a PRF excluding records with status of "Transferred" or "Employed"
            applicationsModel.find({ requisition_id: requisitionID, status: { $nin: ["Transferred", "Employed"] } }, "_id user personalInformation_id requisition_id applicationDate status").then(async (applicationsData) => {

                console.log("applications Data " + JSON.stringify(applicationsData, null, ' '));

                // filters the applications to those without newer application (these applicants are eligible for data deletion)
                // returns [] of applications
                let applications_without_newer_application = await filter_without_newer_application(applicationsData);
                console.log("applications_without_newer_application:" + JSON.stringify(applications_without_newer_application, null, ' '));

                for (let i = 0; i <= applications_without_newer_application.length; i++) {
                    if (i == applications_without_newer_application.length) {
                        //insert functions after looping through the array
                    } else {
                        // insert fucntions FOR each item in the array
                        let applicant_user_id = applications_without_newer_application[i].user._id;
                        await deletePIF(applicant_user_id);
                        await deleteUserNotifs(applicant_user_id);
                        await deleteNotifsRelatedToApplication(applicant_user_id);
                        // removed deleteApplication because it shouldn't be deleted.
                        // await deleteApplication(applicant_user_id); 
                        await deleteUser(applicant_user_id);
                    }
                }
            })
        } catch (e) {


        }

    },
    /**
     * 
     * @param {*} job the job data.
     * @param {*} job.attrs.data the data passed along the job/scheduled task
     * 
     * TODO: What's happening
     *      deletes the ff
     *      [x] delete PIF of the user
     *      [x] delete all notifications related to the deleted applications (in next step) because mage-error sa task/notifs if hindi i-delete.
     *      [x] delete applications of the user //removed
     *      [x] delete notifications of the user
     *      [x] delete account of the user
     */
    dataDeletionForOffboardingEmployee: async function (job) {

        console.log("job executed: dataDeletionForOffboardingEmployee");
        // console.log("job.attrs: " + JSON.stringify(job.attrs));
        var user_id = job.attrs.data.user_id;
        console.log("_id of user to be deleted: " + user_id);

        const deletePIF = async (user_id) => {
            new Promise((resolve, reject) => {
                personalInformationsModel.deleteOne({ 'user._id': user_id }, function (err, result) {
                    console.log("deletePIF deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }

        /**
         * Deletes notifs related to the application.
         * @param {*} user_id 
         * 
         */
        const deleteNotifsRelatedToApplication = async (user_id) => {
            new Promise((resolve, reject) => {

                const deleteNotifs = async (app_id) => {
                    new Promise((resolve, reject) => {
                        notificationModel.deleteMany({ 'referenceType': 'Application', 'reference._id': app_id }, function (err, result) {
                            console.log(`notifs related to application ${app_id} deletedCount: ${result.deletedCount}`);
                            resolve(result.deletedCount);
                        })
                    })
                }

                var totalDeleteCount = 0;
                applicationsModel.find({ 'user._id': user_id }, async function (err, applicationsData) {
                    console.log("applicationsData.length " + applicationsData.length);
                    for (let i = 0; i <= applicationsData.length; i++) {
                        if (i == applicationsData.length) {
                            resolve(totalDeleteCount);
                        } else {
                            let app_id = applicationsData[i]._id;
                            let deletedCount = await deleteNotifs(app_id);
                        }
                    }
                })
            })
        }

        const deleteApplication = async (user_id) => {
            new Promise((resolve, reject) => {

                applicationsModel.deleteMany({ 'user._id': user_id }, function (err, result) {
                    console.log("deleteApplication deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }

        const deleteUserNotifs = async (user_id) => {
            new Promise((resolve, reject) => {
                notificationModel.deleteMany({ 'receiver._id': user_id }, function (err, result) {
                    console.log("deleteUserNotifs deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }

        const deleteUser = async (user_id) => {
            new Promise((resolve, reject) => {
                userModel.deleteOne({ '_id': user_id }, function (err, result) {
                    console.log("deleteUser deleted count: " + result.deletedCount);
                    resolve();
                })
            })
        }

        const deleteNotifsReferencingUser = async (user_id) => {
            new Promise((resolve, reject) => {

                // //just to confirm what notifs are being deleted. for testing
                // notificationModel.find({
                //     $or: [
                //         { 'reference.user._id': user_id }, // for applications notifications & notifs that uses "references.user._id"
                //         { 'reference.off_user_id': user_id }, //for offboarding/clearances notifications
                //         { 'reference.off_user_id': user_id.toHexString(), task: "Approve Clearance Form" } //for offboarding specifically task: Approve Clearance Form
                //     ]
                // }, 'referenceType receiver.email description task reference.user._id reference.off_user_id', function(err, notifData){
                //     console.log(notifData)
                // })

                notificationModel.deleteMany(
                    {
                        $or: [
                            { 'reference.user._id': user_id }, // for applications notifications & notifs that uses "references.user._id"
                            { 'reference.off_user_id': user_id }, //for offboarding/clearances notifications
                            { 'reference.off_user_id': user_id.toHexString() , task: "Approve Clearance Form"} //for offboarding specifically task: Approve Clearance Form
                        ]
                    }, function (err, result) {
                        console.log(`deleteNotifsReferencingUser ${user_id} | deletedCount: ${result.deletedCount}`);
                        console.log(result)
                        resolve(result.deletedCount);
                    })
            })
        }


        try {
            await deletePIF(user_id);
            await deleteUserNotifs(user_id);
            await deleteNotifsRelatedToApplication(user_id);
            // removed deleteApplication because it shouldn't be deleted.
            // await deleteApplication(applicant_user_id); 
            await deleteUser(user_id);
            await deleteNotifsReferencingUser(user_id);
        } catch (e) {


        }

    }
}


async function filter_without_newer_application(applicationsData) {
    return new Promise(async (resolve, reject) => {

        /**
         * Checks if the applicant has submitted newer applications than the inputted application.
         * @param {*} thisApplicationDate 
         * @param {*} thisApplicationUser_id 
         * @returns {boolean} true if the applicant has newer applications; false if none
         */
        const hasNewerApplication = async (thisApplicationDate, thisApplicationUser_id) => {
            return new Promise((resolve, reject) => {
                applicationsModel.find({ applicationDate: { $gt: thisApplicationDate }, 'user._id': thisApplicationUser_id }, '_id user personalInformation_id requisition_id applicationDate status', function (err, newerApplicationsData) {

                    console.log("\n\nnewerApplicationsData count: " + newerApplicationsData.length);
                    console.log(newerApplicationsData);
                    if (newerApplicationsData.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
            });
        };

        /**
         * checks if user is an employee. checks "userType"
         * @param {*} thisApplicationUser_id 
         * @returns {Promise: boolean} true if user is an employee; false if not
         */
        const checkIfUserIsAnEmployee = async (thisApplicationUser_id) => {
            return new Promise((resolve, reject) => {
                userModel.find({ '_id': thisApplicationUser_id }, '_id userType', function (err, userData) {

                    console.log(" \n \n userData userType: " + userData.userType);
                    if (userData.userType == "Employee") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
            });
        };

        // applicationsData = applicationsData;
        let filtered_applications = [];

        console.log("START filter_without_newer_application");
        console.log("applicationsData.length " + applicationsData.length);
        for (let i = 0; i <= applicationsData.length; i++) {

            if (i == applicationsData.length) {
                console.log("filtered_applications | triggered at i: " + i);
                console.log(filtered_applications);
                resolve(filtered_applications);
            } else {
                let thisApplicationDate = applicationsData[i].applicationDate;
                let thisApplicationUser_id = applicationsData[i].user._id;

                // checks if applicant has newer application or not [true/false]
                let thisUserHasNewerApplication = await hasNewerApplication(thisApplicationDate, thisApplicationUser_id);
                let isUserAnEmployee = await checkIfUserIsAnEmployee(thisApplicationUser_id);

                // if [false] no newer application , eligible for data deletion. If [true], then not eligible for data deletion.
                // if isUserAnEmployee is [false], eligible for data deletion. IF [true], it means that the user is an employee/the application is for internal
                if (thisUserHasNewerApplication == false && isUserAnEmployee == false) {
                    filtered_applications.push(applicationsData[i]);
                }
            }
        }
    });
}

// async function batch_data_deletion(applicationsData) {

//     for(let i = 0; i<=applicationsData.length; i++){
//         if(i == applicationsData.length){
//             resolve("thing here");
//         }else{

//         }

//     }

// }


module.exports = JobsController;
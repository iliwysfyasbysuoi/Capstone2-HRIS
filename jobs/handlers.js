//NB this imports are relative to where you have this funtions defined in your own projects
const JobsController = require("./controller.js");
const testModel = require("../models/testModel.js");

const { ObjectId } = require("mongodb");

const JobHandlers = {
    test: (job) => {
        JobsController.test(job);
    },
    dataDeletionForInactiveApplicants: (job) => {
        JobsController.dataDeletionForInactiveApplicants(job);
    },
    dataDeletionForOffboardingEmployee: (job) => {
        JobsController.dataDeletionForOffboardingEmployee(job);
    },

    // .... more methods that perform diffrent tasks
};

module.exports = { JobHandlers }
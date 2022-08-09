const { JobHandlers } = require("../handlers");

const dataRetentionDefinitions = (agenda) => {

    agenda.define("test", JobHandlers.test)

    agenda.define("data-deletion-for-inactive-applicants", JobHandlers.dataDeletionForInactiveApplicants)
    agenda.define("data-deletion-for-offboarding-employee", JobHandlers.dataDeletionForOffboardingEmployee)
        

    // agenda.define(
    //     "billings-info",
    //     {
    //         priority: "high",
    //         concurrency: 20,
    //     },
    //     JobHandlers.monthlyBillingInformation
    // );
};

module.exports = { dataRetentionDefinitions }
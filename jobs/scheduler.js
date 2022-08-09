// import { agenda } from "./index";

const agenda = require("./index");
const automationScheduleModel = require("../models/automationScheduleModel");
const { ObjectId } = require("bson");

const scheduler = {
  test: function (req, res, data) {
    // TEST if via rest api

    try {

      console.log("req: " + JSON.stringify(req.query.description));
      console.log("agenda scheduled from scheduler -- req/res");

      automationScheduleModel.findOne({jobFunctionName: "test"}, function(err, data){
        var scheduleString = data.schedule;
        agenda.schedule(scheduleString, "test", { description: req.query.description }).then(x =>{
          console.log("Will run at " + x.attrs.nextRunAt.toLocaleString());
        });
      })
      

      res.send("ok");
    } catch (e) {
      // if(e) throw e;
    }
  },

  test2: function () {
    scheduler.data_deletion_for_inactive_applicants({ requisitionID: 1 });
  },

  /**
   * 
   * @param {*} data data to be passed. In this case, the description. 
   *    passed by test3(data)
   */
  test3: function (data) {
    try {
      let description = data.description;
      console.log("[test3 > scheduler] agenda scheduled from scheduler -- function(data)");
      agenda.schedule("in 1 month", "test", { description: description });
      res.send("ok");
    } catch (e) {
      // if(e) throw e;
    }
  },

  /**
   * 
   * @param {*} data data to be passed. 
   *        -personnelrequisitionforms  requisitionID (bec ito yung gamit sa pagcclose ng PRF)
   * 
   */
   data_deletion_for_inactive_applicants: function (data) {

    try {
      console.log("[scheduler.js > data_deletion_for_inactive_applicants > data.requisitionID: " + data.requisitionID);

      // get the schedule for this job
      automationScheduleModel.findOne({jobFunctionName: "data_deletion_for_inactive_applicants"}, function(err, automationScheduleData){
        var scheduleString = automationScheduleData.schedule;
        agenda.schedule(scheduleString, "data-deletion-for-inactive-applicants", { requisitionID: data.requisitionID }).then(x =>{
          console.log("Will run at " + x.attrs.nextRunAt.toLocaleString());
        });

      })

    } catch (e) {

    }


  },
  /**
   * used for testing data_deletion_for_offboarding_employee
   */
  TEST_data_deletion_for_offboarding_employee: function(){
    // ObjectId('62a2f31a31a88be7440742c2')  is lia.roces@leoniogroup.com // default for testing
    scheduler.data_deletion_for_offboarding_employee({ user_id: ObjectId('62a2f31a31a88be7440742c2')  });
  },
  /**
   * 
   * @param {*} data data to be passed. 
   *        -user's _id  
   * 
   */
   data_deletion_for_offboarding_employee: function (data) {

    try {
      

      console.log(data);
      // get the schedule for this job
      automationScheduleModel.findOne({jobFunctionName: "data_deletion_for_offboarding_employee"}, function(err, automationScheduleData){
        var scheduleString = automationScheduleData.schedule;
        var user_id = data.user_id;

        console.log("[scheduler.js > data_deletion_for_offboarding_employee > data.user_id: " + user_id);

        agenda.schedule(scheduleString, "data-deletion-for-offboarding-employee", { user_id: user_id }).then(x =>{
          console.log("Will run at " + x.attrs.nextRunAt.toLocaleString());
        });

      })

    } catch (e) {

    }


  }

}

module.exports = { scheduler }
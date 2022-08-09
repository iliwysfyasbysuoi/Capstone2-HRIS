
const automationScheduleModel = require("../../models/automationScheduleModel");
const { ObjectId } = require("bson");
const dateJS = require("date.js");

const AutomationScheduleController = {
    AutomationSchedulePage: async function(req,res){
        automationScheduleModel.find({}, function(err, schedules){
            res.render("pages/AutomationSchedule/AutomationSchedulePage", {
                schedules:schedules
            });
        })
        
    },
    updateSchedule: function(req,res){

        var schedule_id = req.body.scheduleID;
        var schedule = req.body.schedule;

        automationScheduleModel.updateOne({_id: ObjectId(schedule_id)}, { $set: { schedule: schedule } }, function(err, data){
            res.send(data);
        })


    }


    

    
    

}

module.exports = AutomationScheduleController;
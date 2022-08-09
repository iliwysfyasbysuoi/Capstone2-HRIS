const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const automationScheduleSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    jobPrettyName: {
        type : String,
        required: [true, 'Required']
    },
    jobFunctionName: {
        type : String,
        required: [true, 'Required']
    },
    schedule:{
        type : String,
        required: [true, 'Required']
    },
    scheduleContext:{
        type : String,
        required: [true, 'Required']
    },
    contextFirst: {
        type: Boolean
    },
    description: {
        type : String
    },
    conditions: [{
        type : String
    }],
    dataDeleted: [{
        type : String
    }],

});

module.exports = mongoose.model('automationschedules', automationScheduleSchema);
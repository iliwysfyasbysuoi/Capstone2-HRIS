const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const notificationSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },

    date:{
        type : Date, // current date
        required: [true, 'Required']
    },

    receiver: {
        type : Object, // User Object
        required: [true, 'Required']
    },
    isSeen: {
        type : Boolean,
        required: [true, 'Required'],
        default: false
    },
    referenceType: {
        // type of reference: PRF, Personal Information, Application, interview schedule (?)
        type: String
    },
    reference: {
        // Object of the reference
        type: Object
    },
    description: {
        // text that will appear in notification bar.
        type: String,
        required: [true, 'Required']
    },
    task: {
        // this is the task relating to the notification. can be empty
        // we already have referenceType, so just put here the "task/action"
        // eg. (for PRF) "Approval", "List Job Vacancy"; 
        //      (for application) "Schedule Interview", "Final Approval", "EAF", etc
        type: String
    }
});

module.exports = mongoose.model('notifications', notificationSchema);
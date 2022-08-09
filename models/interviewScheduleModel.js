const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const interviewScheduleSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    date: {
        type: Date,
        required: [true, 'Required']
    },
    stage: {
        // initial, functional, final, exit, etc etc
        type: String,
        required: [true, 'Required']
    },
    interviewer: {
        // user object
        type: Object,
        required: [true, 'Required']
    },
    reference: {
        // user object
        type: Object,
        required: [true, 'Required']
    },
    interviewee: {
        // user object
        type: Object,
        required: [true, 'Required']
    },

    // changed required to false, bec it affected yung part ng applicant approval
    status: {
        type: String,
        required: [false, 'Required']
    },
    type: {
        type: String,
        required: [false, 'Required']
    },
    interviewId: {
        type: String,
        required: [false, 'Required']
    }
});

module.exports = mongoose.model('interviewschedule', interviewScheduleSchema);
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const employeeTrackerSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    employees: [
        {
            employeeID: {
                type: Schema.Types.ObjectId,
                default: null
            },
            employeeName: {
                type: String,
                required: [true, 'Required']
            },
            attendance: {
                type: String,
                required: [true, 'Required']
            },
            employeeContractPeriod: {
                type: String,
                required: [true, 'Required']
            },
            employeePosition: {
                type: String,
                required: [true, 'Required']
            }
        }
    ],
    trainingID: {
        type: Number,
        required: [true, 'Required']
    },
    trainingDetails: {
        id: {
            type: Schema.Types.ObjectId,
            default: null
        },
        trainingTitle: {
            type: String,
            required: [true, 'Required']
        },
        trainingVenue: {
            type: String,
            required: [true, 'Required']
        },
        trainingSponsor: {
            type: String,
            required: [true, 'Required']
        },
        trainingDate: {
            type: Date,
            required: [true, 'Required']
        }
    },
    status: {
        type: String,
        required: [true, 'Required']
    },
    answered: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('employeeTracker', employeeTrackerSchema);
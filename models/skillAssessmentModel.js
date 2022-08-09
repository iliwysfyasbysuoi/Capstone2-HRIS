const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const skillAssessmentSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },
    assessmentID: {
        type: Number
    },
    skillSetupID: {
        type: Schema.Types.ObjectId,
        default: null
    },
    skillCycleDate: {
        type: Date,
        required: [true, 'Required']
    },
    employeeDetails: {
        id: {
            type: Schema.Types.ObjectId,
            default: null
        },
        name: {
            type: String,
            required: [true, 'Required']
        },
        position: {
            type: String,
            required: [true, 'Required']
        },
        department: {
            type: String,
            required: [true, 'Required']
        },
        businessUnit: {
            type: String,
            required: [true, 'Required']
        }
    },
    targetSkills: [
        {
            skillName: {
                type: String,
                required: [true, 'Required']
            },
            rating: {
                type: String,
                required: [true, 'Required']
            }
        }
    ],
    submissionDate: {
        type: Date
    }
})

module.exports = mongoose.model('skillAssessment', skillAssessmentSchema);
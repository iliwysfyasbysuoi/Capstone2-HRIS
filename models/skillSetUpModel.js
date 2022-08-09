const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const skillSetUpSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },
    skillID: {
        type: Number,
        required: [true, 'Required']
    },
    skillPositionTitle: {
        type: String,
        required: [true, 'Required']
    },
    skillDepartment: {
        type: String,
        required: [true, 'Required']
    },
    skillBusinessUnit: {
        type: String,
        required: [true, 'Required']
    },
    targetSkills: [
        {
            type: String,
            required: [true, 'Required']
        }
    ],
    dates: [{
        type: Date,
        required: [true, 'Required']
    }],
    expireDate: {
        type: Date,
        required: [true, 'Required']
    },
    cycles: {
        type: Number,
        required: [true, 'Required']
    },
    reviewCycle: {
        type : String,
        required: [true, 'Required']
    },
    answerable: {
        type: Boolean,
        required: [true, 'Required']
    }
})

module.exports = mongoose.model('skillSetUp', skillSetUpSchema);
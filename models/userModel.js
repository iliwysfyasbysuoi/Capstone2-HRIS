const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },
    email: {
        type : String,
        required: [false, 'Required']
    },
    password: {
        type : String,
        required: [true, 'Required']
    },
    firstName: {
        type : String,
        required: [true, 'Required']
    },
    middleName: {
        type : String,
        required: [true, 'Required']
    },
    lastName: {
        type : String,
        required: [true, 'Required']
    },
    nickName: {
        type : String,
        required: [true, 'Required']
    },
    userType: {
        type: String,
        required: [false, 'Required']  //  HMM???
    },
    businessUnit: {
        type : String,
        required: [false, 'Required'],
        default: "None"
    },
    department: {
        type : String,
        required: [false, 'Required'],
        default: "None"
    },
    position: {
        type : String,
        required: [false, 'Required'],
        default: "None"
    },
    employmentDate: {
        type : Date,
        required: [false, 'Required']
    },
    // contactNum: {
    //     type : String,
    //     required: [false, 'Required']
    // },
    personalEmail: {
        type : String,
        required: [true, 'Required']
    },
    // address: {
    //     type: String,
    //     required: [false, 'Required']
    // },

    employmentType: {
        type: String,
        required: [false, 'Required']
    },
    assessmentLength: {
        month: {
            type: Number,
            required: [false, 'Required']
        }, 
        year: {
            type: Number,
            required: [false, 'Required']
        }
    }



});

module.exports = mongoose.model('users', userSchema);
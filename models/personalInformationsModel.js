const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const personalInformationsSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },
    
    user: {
        type: Object,
        required: [true, 'Required']
    },

    //  I. Personal
    presentAddress: {
        type: String,
        required: [true, 'Required']
    },
    provincialAddress: {
        type: String,
        required: [true, 'Required']
    },
    telNum: {
        type: String,
        required: [true, 'Required']
    },
    mobileNum: {
        type: String,
        required: [true, 'Required']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Required']
    },
    placeOfBirth: {
        type: String,
        required: [true, 'Required']
    },
    age: {
        type: Number,
        required: [true, 'Required']
    },
    gender: {
        type: String,
        required: [true, 'Required']
    },
    weight: {
        type: Number,
        required: [true, 'Required']
    },
    height: {
        type: Number,
        required: [true, 'Required']
    },
    civilStatus: {
        type: String,
        required: [true, 'Required']
    },
    citizenship: {
        type: String,
        required: [true, 'Required']
    },
    religion: {
        type: String,
        required: [true, 'Required']
    },
    bloodType: {
        type: String,
        required: [true, 'Required']
    },
    SSS: {
        type: String,
        required: [true, 'Required']
    },
    TIN: {
        type: String,
        required: [true, 'Required']
    },
    HDMF: {
        type: String,
        required: [true, 'Required']
    },
    PhilHealth: {
        type: String,
        required: [true, 'Required']
    },

    spouseName: {
        type: String,
        required: [false, 'Required']
    },
    marriageDate: {
        type: Date,
        required: [false, 'Required']
    },
    spouseOccupation: {
        type: String,
        required: [false, 'Required']
    },
    spouseEmployer: {
        type: String,
        required: [false, 'Required']
    },
    spousePresentAddress: {
        type: String,
        required: [false, 'Required']
    },
    spouseTelNum: {
        type: String,
        required: [false, 'Required']
    },
    spouseMobileNum: {
        type: String,
        required: [false, 'Required']
    },

    children: [{
        type: Object,
        required: [false, 'Required']
        
    }],

    fatherName: {
        type: String,
        required: [false, 'Required']
    },
    fatherHomeAddress: {
        type: String,
        required: [false, 'Required']
    },
    fatherOccupation: {
        type: String,
        required: [false, 'Required']
    },
    fatherCompany: {
        type: String,
        required: [false, 'Required']
    },

    motherName: {
        type: String,
        required: [false, 'Required']
    },
    motherHomeAddress: {
        type: String,
        required: [false, 'Required']
    },
    motherOccupation: {
        type: String,
        required: [false, 'Required']
    },
    motherCompany: {
        type: String,
        required: [false, 'Required']
    },

    siblings:[ {
        type: Object,
        required: [false, 'Required']
    }],

    // II. Educational Background
    
    schoolRecords: [{
        type: Object,
        required: [false, 'Required']
    }],
    award: {
        type: String,
        required: [false, 'Required']
    },
    exams: [{
        type: Object,
        required: [false, 'Required']
    }],
    trainingsAndSeminarInfo: [{
        type: Object,
        required: [false, 'Required']
    }],

    //  III. Employment Record

    employmentRecordInfo: [{
        type: Object,
        required: [false, 'Required']
    }],

    // IV. Organization

    organizations: [{
        type: Object,
        required: [false, 'Required']
    }],
    characterReferences: [{
        type: Object,
        required: [false, 'Required']
    }],

    //  V. Contact Information
    contactPerson: {
        type: String,
        required: [true, 'Required']
    },
    contactRelationship: {
        type: String,
        required: [true, 'Required']
    },
    contactAddress: {
        type: String,
        required: [true, 'Required']
    },
    contactNumber: {
        type: String,
        required: [true, 'Required']
    }




});

module.exports = mongoose.model('personalinformations', personalInformationsSchema);
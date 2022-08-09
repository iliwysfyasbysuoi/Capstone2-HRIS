const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PRFSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },

    positionTitle: {
        type : String,
        required: [true, 'Required']
    },

    businessUnit: {
        type : String,
        required: [true, 'Required']
    },
    department: {
        type : String,
        required: [true, 'Required']
    },
    
    positionLevel: {
        type : String,
        required: [true, 'Required']
    },
    jobCode: {
        type : String,
        required: [true, 'Required']
    },
    

    billToCompany: {
        type : String,
        required: [true, 'Required']
    },
    location: {
        type : String,
        required: [true, 'Required']
    },


    

    jobDescription: {
        type: String,
        required: [true, 'Required']
    },
    positionRequirements: {
        type: String,
        required: [true, 'Required']
    },
    skills:{
        type: Array,
        required:[true, 'Required']
    }
    

    




});

module.exports = mongoose.model('positions', PRFSchema);
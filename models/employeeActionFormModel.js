const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const employeeactionformSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },

    formID:{
        type: Number
    },

    requestDate: {
        type: Date
    },

    name: {
        type : String
    },
    // middleName: {
    //     type : String
    // },
    // lastName: {
    //     type : String
    // },

    positionTitle: {
        type : String
    },
    immediateSupervisor:{
        type : String, 
    },
    department:{
        type : String, 
    },
    businessUnit:{
        type : String, 
    },

    action: {
        // this is the recommended action options
        // Confirm Regular Employment, Transfer, Termination  
        // (not included na based sa scope: promotion, salary adjustment)
        type: String
    },
    status: {
        // Pending, Approved, Disapproved
        type: String,
        default: "Pending"

    },
    updatedDate: {
        type: Date
    },

    departmentFrom:{
        type: String
    },
    departmentTo:{
        type: String
    },
    positionFrom:{
        type: String
    },
    positionTo:{
        type: String
    },

    terminationReason: {
        type: String
    },

    effectiveDate: {
        type: Date
    },

    justification: {
        type: String
    },

    dateHired:{
        type : Date, 
    },
    monthsInCurrentPosition: {
        type : Number, 
    },


    applicationID_reference:{
        type: Schema.Types.ObjectId
    },

    offboardingID_reference: {
        type: Schema.Types.ObjectId
    },
    userID_reference:{
        type: Schema.Types.ObjectId
    },

    approvalHRPartner: {
        // HR Supervisor
        approver: {
            type: Object
        },
        approval: {
            type: String,
            enum: ['Pending', 'Disapproved', 'Approved'],
            default: "Pending"
        }
    },
    approvalDHead: {
        approver: {
            type: Object
        },
        approval: {
            type: String,
            enum: ['Pending', 'Disapproved', 'Approved'],
            default: "Pending"
        }
    },
    approvalBUHead: {
        approver: {
            type: Object
        },
        approval: {
            type: String,
            enum: ['Pending', 'Disapproved', 'Approved'],
            default: "Pending"
        }
    },
    approvalCHRODDirector: {
        approver: {
            type: Object
        },
        approval: {
            type: String,
            enum: ['Pending', 'Disapproved', 'Approved'],
            default: "Pending"
        }
    }


    






});

module.exports = mongoose.model('employeeactionform', employeeactionformSchema);
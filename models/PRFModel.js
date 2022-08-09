const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// const assessmentLength = new Schema({
//     years: {
//         type: Number,
//         required: [true, 'Required']
//     },
//     months : {
//         type: Number,
//         required: [true, 'Required']
//     }
// })

// const approvals = new Schema({
//     email: {
//         type: String,
//         required : [true, 'Required']
//     },
//     approval: {
//         type: String,
//         required : [true, 'Required'],
//         enum: ['Pending', 'Disapproved', 'Approved']
//     }
// })

// const toolsOfTrade = new Schema({
//     tool: {
//         type: String,
//         required : [true, 'Required']
//     },
//     availability: {
//         type: String,
//         required : [true, 'Required'],
//         enum: ['Pending', 'Disapproved', 'Approved']
//     }
// })




const PRFSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },

    requisitionID: {
        type : Number,
        required: [true, 'Required']
    },
    
    createdDate: {
        type : Date,
        required: [true, 'Required']
    },
    
    createdBy: {
        type : Object,
        required: [true, 'Required']
    },

    status: {
        type: String,
        required: [true, 'Required']
    },

    positionTitle: {
        type : String,
        required: [true, 'Required']
    },

    targetStartDate: {
        type : Date,
        required: [true, 'Required']
    },
    inTO: {
        type : String,
        required: [false, 'Required']
    },
    positionLevel: {
        type : String,
        required: [true, 'Required']
    },
    jobCode: {
        type : String,
        required: [true, 'Required']
    },
    headcount: {
        type : Number,
        required: [true, 'Required']
    },
    successCount: {
        // count of successfully employed/transferred
        type : Number,
        required: [true, 'Required'],
        default: 0
    },
    businessUnit: {
        type : String,
        required: [true, 'Required']
    },
    department: {
        type : String,
        required: [true, 'Required']
    },
    directSupervisor: {
        type : String,
        required: [false, 'Required']
    },
    billToCompany: {
        type : String,
        required: [true, 'Required']
    },
    location: {
        type : String,
        required: [true, 'Required']
    },

    approvedDate: {
        type : Date,
        required: [false, 'Required']
    },

    employmentType: {
        type: String,
        required: [true, 'Required']
    },
    assessmentLength: {
        years: {
            type: Number,
            required: [true, 'Required'],
            default: 0
        },
        months : {
            type: Number,
            required: [true, 'Required'],
            default: 0
        }
    },
    purpose: {
        type: String,
        required : [true, 'Required']
    },
    details: {
        type: String,
        required: [false, 'Required']
    },
    jobDescription: {
        type: String,
        required: [false, 'Required']
    },
    positionRequirements: {
        type: String,
        required: [false, 'Required']
    },
    skills:{
        type: Array,
        required: [true, "Required"]
    },
    toolsOfTrade: [{
        // tool: {
        //     type: String,
        //     required : [true, 'Required']
        // },
        // availability: {
        //     type: String,
        //     required : [true, 'Required'],
        //     enum: ['Available', 'Unavailable']
        // }
        type: Array,
        required : [false, 'Required']
    }],
    approvalDHead: {
        approver: {
            type: Object,
            required : [true, 'Required']
        },
        approval: {
            type: String,
            required : [true, 'Required'],
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },
    approvalHRPartner: {
        approver: {
            type: Object,
            required : [true, 'Required']
        },
        approval: {
            type: String,
            required : [true, 'Required'],
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },
    approvalBUHead: {
        approver: {
            type: Object,
            required : [true, 'Required']
        },
        approval: {
            type: String,
            required : [true, 'Required'],
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },
    approvalCHRODDirector: {
        approver: {
            type: Object,
            required : [true, 'Required']
        },
        approval: {
            type: String,
            required : [true, 'Required'],
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },
    approvalCHRODHead: {
        approver: {
            type: Object,
            required : [true, 'Required']
        },
        approval: {
            type: String,
            required : [true, 'Required'],
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },

    listDate: {
        type : Date,
        required: [false, 'Required']
    },

    closeDate: {
        type : Date,
        required: [false, 'Required']
    },

    disapprovalReason: {
        type: String,
        required: [false, 'Required']
    }

    




});

module.exports = mongoose.model('personnelrequisitionforms', PRFSchema);
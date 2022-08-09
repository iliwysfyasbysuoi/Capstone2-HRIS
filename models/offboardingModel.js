const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const offboardingSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    }, 
    offboardingID: {
        type: Number,
        required: [true, 'Required']
    },
    clearanceApproval: {
        type: Boolean,
        required: [true, 'Required']
    },
    name: {
        type: String,
        required: [true, 'Required']
    },
    off_user_id:{
        // _id of the user that is offboarding
        type: Schema.Types.ObjectId,
        required: [true, 'Required']
    },
    position: {
        type: String,
        required: [true, 'Required']
    },
    separationLetter: {
        type: String,
        required: [false, 'Required']
    },
    businessUnit: {
        type: String,
        required: [true, 'Required']
    },
    natureOfSeparation: {
        type: String,
        required: [true, 'Required']
    },
    department: {
        type: String,
        required: [true, 'Required']
    },
    requestDate: {
        type: Date,
        required: [true, 'Required']
    },
    effectiveDate: {
        type: Date,
        required: [true, 'Required']
    },
    allDeptHeadSubmitted:{
        type: Boolean
    },
    status: {
        type: String,
        required: [true, 'Required']
    },
    updatedDate: {
        type: Date,
        required: [true, 'Required']
    },
    approvalHR: {
        approver: {
            type: Object,
        },
        approval: {
            type: String,
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },
    approvalBUHead: {
        approver: {
            type: Object,
        },
        approval: {
            type: String,
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },
    approvalCHRODDirector: {
        approver: {
            type: Object,
        },
        approval: {
            type: String,
            enum: ['Pending', 'Disapproved', 'Approved']
        }
    },
    notifStatus: {
        type: String,
        enum: ['Notified', 'Pending']
    },
    accountabilities: [
        {
            accountabilityList: [
                {
                    name: {
                        type: String,
                    },
                    status: {
                        type: String,
                    }
                }
            ],
            submitted: {
                type: String,
                enum: ['Pending', 'Submitted']
            },
            approver: {
                type: String,
            },
            dateSigned: {
                type: Date,
            },
            departmentName: {
                type: String,
            }
        }

    ],
    // accountabilityList: {
    //     CHROD: {
    //         accountabilityList: [
    //             {
    //                 name: {
    //                     type: String,
    //                 },
    //                 status: {
    //                     type: String,
    //                 }
    //             }
    //         ],
    //         submitted: {
    //             type: String,
    //             enum: ['Pending', 'Submitted']
    //         },
    //         approver: {
    //             type: String,
    //         },
    //         dateSigned: {
    //             type: Date,
    //         }
    //     },
    //     ICT: {
    //         accountabilityList: [
    //             {
    //                 name: {
    //                     type: String,
    //                 },
    //                 status: {
    //                     type: String,
    //                 }
    //             }
    //         ],
    //         submitted: {
    //             type: String,
    //             enum: ['Pending', 'Submitted']
    //         },
    //         approver: {
    //             type: String,
    //         },
    //         dateSigned: {
    //             type: Date,
    //         }
    //     },
    //     SCA: {
    //         accountabilityList: [
    //             {
    //                 name: {
    //                     type: String,
    //                 },
    //                 status: {
    //                     type: String,
    //                 }
    //             }
    //         ],
    //         submitted: {
    //             type: String,
    //             enum: ['Pending', 'Submitted']
    //         },
    //         approver: {
    //             type: String,
    //         },
    //         dateSigned: {
    //             type: Date,
    //         }
    //     }
    // },
    interview: {
        status: {
            type: String,
            enum: ['Pending', 'Completed']
        },
        date: {
            type: Date
        },
    },
    
    disapprovalReason: {
        type: String
    }
})

module.exports = mongoose.model('offboarding', offboardingSchema);

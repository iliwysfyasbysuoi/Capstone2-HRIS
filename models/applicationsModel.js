const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const applicationsSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },
    user: {
        // User Object
        type: Object,
        required: [true, 'Required']
    },
    personalInformation_id: {
        // PersonalInformation  _id reference
        type: Schema.Types.ObjectId,
        required: [true, 'Required']
    },
    requisition_id: {
        // PersonnelRequisitionForm requisitionID reference
        type: Number,
        required: [true, 'Required']
    },
    applicationDate: {
        type: Date,
        required: [true, 'Required']
    },
    openingApply: {
        type: String,
        required: [true, 'Required']
    },
    status: {
        // Pending, Approved, Disapproved, Employed, Transferred, Pre-Employment Requirements Pending, //Employee Action For Approval, Employee Action Fully Approved
        type: String,
        required: [true, 'Required'],
        default: "Pending"
    },


    initialInterviewSchedule: {
        type: Object,
        required: [false, 'Required'],
    },
    initialInterviewFeedback: {
        pbac: {
            type: Number,
        },
        pbac_comments: {
            type: String,
        },

        ic_skills: {
            type: Number,
        },
        ic_skills_comments: {
            type: String,
        },

        work_history: {
            type: Number,
        },
        work_history_comments: {
            type: String,
        },

        functional_skills: {
            type: Number,
        },
        functional_skills_comments: {
            type: String,
        },

        personality: {
            type: Number,
        },
        personality_comments: {
            type: String,
        },

        impression: {
            type: Number,
        },
        impression_comments: {
            type: String,
        },

        other_comments: {
            type: String,
        }

    },

    functionalInterviewSchedule: {
        type: Object,
        required: [false, 'Required'],
    },
    functionalInterviewFeedback: {
        practical_experience: {
            type: Number,
        },
        practical_experience_comments: {
            type: String,
        },

        functional_expertise: {
            type: Number,
        },
        functional_expertise_comments: {
            type: String,
        },

        management_skills: {
            type: Number,
        },
        management_skills_comments: {
            type: String,
        },

        response_resource: {
            type: Number,
        },
        response_resource_comments: {
            type: String,
        },

        self_management: {
            type: Number,
        },
        self_management_comments: {
            type: String,
        },

        impression: {
            type: Number,
        },
        impression_comments: {
            type: String,
        },

        other_comments: {
            type: String,
        }

        
    },
    

    finalInterviewSchedule: {
        type: Object,
        required: [false, 'Required'],
    },
    finalInterviewFeedback: {
        org_fit: {
            type: Number,
        },
        org_fit_comments: {
            type: String,
        },

        core_values: {
            type: Number,
        },
        core_values_comments: {
            type: String,
        },

        leadership: {
            type: Number,
        },
        leadership_comments: {
            type: String,
        },

        innovation: {
            type: Number,
        },
        innovation_comments: {
            type: String,
        },

        accountability: {
            type: Number,
        },
        accountability_comments: {
            type: String,
        },

        personal_effectiveness: {
            type: Number,
        },
        personal_effectiveness_comments: {
            type: String,
        },

        potential_growth: {
            type: Number,
        },
        potential_growth_comments: {
            type: String,
        },

        overall_impression: {
            type: Number,
        },
        overall_impression_comments: {
            type: String,
        },

        other_comments: {
            type: String,
        }

    },

    HRPartner_id :{
        type: Schema.Types.ObjectId,
        required: [true, 'Required']
    },

    


    approval1stInterview: {
        type: String,
        required : [false, 'Required'],
        enum: ['Pending', 'Interview Scheduled','Disapproved', 'Approved', 'Skipped', null],
        default: null
    },
    approval2ndInterview: {
        type: String,
        required : [false, 'Required'],
        enum: ['Pending', 'Interview Scheduled', 'Disapproved', 'Approved', 'Skipped', null],
        default: null
    },
    approval3rdInterview: {
        type: String,
        required : [false, 'Required'],
        enum: ['Pending', 'Interview Scheduled', 'Disapproved', 'Approved', 'Skipped', null],
        default: null
    },
    approvalFinal: {
        type: String,
        required : [false, 'Required'],
        enum: ['Pending', 'Interview Scheduled','Disapproved', 'Approved', null],
        default: null
    },

    DHead_id :{
        type: Schema.Types.ObjectId,
        required: [true, 'Required']
    },

    pre_employment_reqs: {
        job_offer_accepted: {
            type: Boolean,
            default: false
        },
        pre_employment_forms: {
            type: Boolean,
            default: false
        },
        pre_employment_medical: {
            type: Boolean,
            default: false
        },
        background_investigation:{
            type: Boolean,
            default: false
        }
    }






    



});

module.exports = mongoose.model('applications', applicationsSchema);
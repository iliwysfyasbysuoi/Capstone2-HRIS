const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const exitSurveySchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    offboardingId: {
        type: String,
        required: [true, 'Required']
    },
    otherReasons: {
        type: String,
        required: [true, 'Required']
    },
    employee: {
        type: Object, required: [true, 'Required']
    },
    forwardAddress: {
        type: String,
        required: [true, 'Required']
    },
    personalEmail: {
        type: String,
        required: [true, 'Required']
    },
    mobileNum: {
        type: String,
        required: [true, 'Required']
    },
    reasonLeave: [
        {
            type: String,
            required: [true, 'Required']
        }
    ],
    satiscationRoles: {
        type: String,
        required: [true, 'Required']
    },
    satiscationOpportunities: {
        type: String,
        required: [true, 'Required']
    },
    satiscationRecommendation: {
        type: String,
        required: [true, 'Required']
    },
    satiscationEnjoyment: {
        type: String,
        required: [true, 'Required']
    },
    satiscationTreatment: {
        type: String,
        required: [true, 'Required']
    },
    satiscationContribution: {
        type: String,
        required: [true, 'Required']
    },
    satiscationWorklikeBalance: {
        type: String,
        required: [true, 'Required']
    },
    satiscationTalents: {
        type: String,
        required: [true, 'Required']
    },
    satiscationManagerRelationship: {
        type: String,
        required: [true, 'Required']
    },
    satiscationTeamWork: {
        type: String,
        required: [true, 'Required']
    },
    satiscationTeamRelationship: {
        type: String,
        required: [true, 'Required']
    },
    companyPositive: {
        type: String,
        required: [true, 'Required']
    },
    companyNegative: {
        type: String,
        required: [true, 'Required']
    },
    returnFuture: {
        type: String,
        required: [true, 'Required']
    },
    generalComments: {
        type: String,
        required: [true, 'Required']
    },
    referenceId: {
        type: String,
        required: [true, 'Required']
    },
    submitDate:{
        type: Date,
        required: [true, 'Required']
    }
});

module.exports = mongoose.model('exitSurvey', exitSurveySchema);
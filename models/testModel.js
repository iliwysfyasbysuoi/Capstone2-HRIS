const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const testSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: null
    },
    description: {
        type : String,
        required: [false, 'Required']
    }



});

module.exports = mongoose.model('test-collection', testSchema);
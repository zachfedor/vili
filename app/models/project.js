/**
 * Project.js
 */

// Setup ==============
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema =============
var ProjectSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    unique_name: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    times: [{
        _id: Schema.Types.ObjectId,
        start: Date,
        end: Date,
        total: Number
    }]
});

// TODO: handle unique_name and user_id (if possible) on save through
// the model rather than on the controller in the api

// Finalize =============
module.exports = mongoose.model('Project', ProjectSchema);

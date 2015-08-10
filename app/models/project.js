/**
 * Time.js
 */

// Setup ==============
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema =============
var ProjectSchema = new Schema({
    user_id: {
        type: String,
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
        id: Schema.Types.ObjectId,
        start: Date,
        end: Date,
        total: Number
    }]
});

// Finalize =============
module.exports = mongoose.model('Project', ProjectSchema);

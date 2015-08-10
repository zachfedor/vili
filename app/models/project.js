/**
 * Time.js
 */

// Setup ==============
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema =============
var ProjectSchema = new Schema({
    user_id: String,
    name: String,
    times: [{
        id: Schema.Types.ObjectId,
        start: Date,
        end: Date,
        total: Number
    }]
});

// Finalize =============
module.exports = mongoose.model('Project', ProjectSchema);

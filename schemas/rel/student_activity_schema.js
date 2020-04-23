const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    extra_activity_id: {
        type: String
    },
    student_id: {
        type: String
    },
    joined_date: {
        type: Date
    },
    leave_date: {
        type: Date
    }
});

const compiledSchema = mongoose.model(constants.REL_STUDENT_ACTIVITY_COLLECTION_NAME, schema);
module.exports = compiledSchema;

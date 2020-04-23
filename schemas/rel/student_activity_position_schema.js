const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    student_id: {
        type: String
    },
    extra_activity_position_id: {
        type: String
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    is_active: {
        type: Date
    }
});

const compiledSchema = mongoose.model(constants.REL_STUDENT_ACTIVITY_POSITION_COLLECTION_NAME, schema);
module.exports = compiledSchema;

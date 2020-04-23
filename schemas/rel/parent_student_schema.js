const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    parent_id: {
        type: String
    },
    student_id: {
        type: String
    },
    relation_type_id: {
        type: String
    }
});

const compiledSchema = mongoose.model(constants.REL_PARENT_STUDENT_COLLECTION_NAME, schema);
module.exports = compiledSchema;

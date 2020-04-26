const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    subject: {
        type: String
    }
});

const compiledSchema = mongoose.model(constants.DF_SUBJECT_COLLECTION_NAME, schema);
module.exports = compiledSchema;

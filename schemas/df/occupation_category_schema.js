const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    occupation_category: {
        type: String
    }
});

const compiledSchema = mongoose.model(constants.DF_OCCUPATION_CATEGORY_COLLECTION_NAME, schema);
module.exports = compiledSchema;
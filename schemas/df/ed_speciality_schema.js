const mongoose = require("mongoose");
const constants = require("../../utils/constants");

const schema = new mongoose.Schema({
    speciality: {
        type: String
    },
    is_active: {
        type: String
    }
});

const compiledSchema = mongoose.model(constants.DF_ED_SPECIALITY_COLLECTION_NAME, schema);
module.exports = compiledSchema;

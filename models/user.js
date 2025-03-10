const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // Correct import

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
    // No need to manually add user and password fields,
    // passport-local-mongoose does it automatically
});

// Correct usage of the plugin
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

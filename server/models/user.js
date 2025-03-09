const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
        },
        password:{
            type: String,
        },
        role:{
            type: String,
            default:"user",
        },
        enabled:{
            type: Boolean,
            default: false,
        },
    },
    {timestamp: true }


);
module.exports=user = mongoose.model("user",UserSchema);

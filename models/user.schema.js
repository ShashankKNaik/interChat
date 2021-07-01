const mongoose = require("mongoose");
const schema = mongoose.Schema;

userSchema = new schema({
    email:{
        type:String,
        unique:true
    },
    name:String,
    fname:String,
    img:String,
    createdAt: {
		type: Date,
		default: Date.now
	}
})

user= mongoose.model('userdetails',userSchema);
module.exports = user;
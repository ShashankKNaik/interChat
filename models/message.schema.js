const mongoose = require("mongoose");
const schema = mongoose.Schema;

messageSchema = new schema({
    msg:String,
    from:String,
    to:String,
    sentAt: {
      type: Date,
      default: Date.now
	  }
})

message= mongoose.model('message',messageSchema);
module.exports = message;
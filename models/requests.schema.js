const mongoose = require("mongoose");
const schema = mongoose.Schema;

requestsSchema = new schema({
    from:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userdetails'
    },
    to:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userdetails'
    }
})

requests= mongoose.model('requests',requestsSchema);
module.exports = requests;
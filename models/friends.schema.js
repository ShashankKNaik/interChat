const mongoose = require("mongoose");
const schema = mongoose.Schema;

friendsSchema = new schema({
    a:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userdetails'
    },
    b:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userdetails'
    }
})

friends= mongoose.model('friends',friendsSchema);
module.exports = friends;
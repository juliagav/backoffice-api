const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: {
    type:String,
    select: false
  },
 // _id: '67e81491305cd6a9dff47ecf'
});
const User = mongoose.model('User', userSchema);

module.exports = User
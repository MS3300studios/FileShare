const mongoose = require("mongoose");
// const connectUri = "mongodb://127.0.0.1:27017/fileShare";
const connectUri = "mongodb+srv://mikolaj:mikolaj3300@cluster0.kkpzzji.mongodb.net/";

mongoose.connect( connectUri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

console.log("DB CONNECTED")

module.exports = mongoose;
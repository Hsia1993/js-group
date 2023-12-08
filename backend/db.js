const mongoose = require("mongoose");
// replace the uri with atlas connection string
const uri = undefined;
async function run() {
  return await mongoose.connect(uri);
}

module.exports = run;

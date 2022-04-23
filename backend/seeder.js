const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Poll = require('./models/Poll');
const Vote = require('./models/Vote');

// Connect to DB
const pemFilePath = path.join(__dirname, '/config/X509-cert.pem')
console.log(pemFilePath)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  tls: true,
  tlsCertificateKeyFile: pemFilePath
});

console.log("==-----==", process.env.MONGO_URI);
console.log("==+++++==", process.argv[2]);

// Read JSON files
const polls = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/polls.json`, 'utf-8')
);

const votes = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/votes.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Poll.create(polls);
    await Vote.create(votes);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Vote.deleteMany();
    await Poll.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}

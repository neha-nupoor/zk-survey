const mongoose = require('mongoose');
const path = require('path');

const pemFilePath = path.join(__dirname, '/X509-cert.pem')


const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    tls: true,
    tlsCertificateKeyFile: pemFilePath
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;

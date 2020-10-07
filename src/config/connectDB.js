import mongoose from 'mongoose';
import bluebird from 'bluebird';

const connectDB = () => {
  mongoose.Promise = bluebird;

  const URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  return mongoose.connect(URI, { useMongoClient: true });

  // const mongoUri =
  //   'mongodb+srv://admin:password@cluster0.livbm.mongodb.net/chat?retryWrites=true&w=majority';
  // mongoose.connect(mongoUri, {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useUnifiedTopology: true,
  // });
  // mongoose.connection.on('connected', () => {
  //   console.log('Connected to mongo instance');
  // });
  // mongoose.connection.on('error', (err) => {
  //   console.error('Error connecting to mongo', err);
  // });
};

module.exports = connectDB;

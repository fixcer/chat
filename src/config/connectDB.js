// import mongoose from 'mongoose';

// const connectDB = () => {
//   const mongoUri =
//     'mongodb+srv://admin:admin@cluster0.xwbcv.mongodb.net/chat?retryWrites=true&w=majority';
//   mongoose.connect(mongoUri, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   });
//   mongoose.connection.on('connected', () => {
//     console.log('Connected to mongo instance');
//   });
//   mongoose.connection.on('error', (err) => {
//     console.error('Error connecting to mongo', err);
//   });
// };

// module.exports = connectDB;

import mongoose from 'mongoose';
import bluebird from 'bluebird';

const connectDB = () => {
  mongoose.Promise = bluebird;

  const mongoUri = 'mongodb://localhost:27017/chat';

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
  });
};

module.exports = connectDB;

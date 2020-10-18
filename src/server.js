import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initialRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import configSession from './config/session';
import passport from 'passport';

const HOST = 'localhost';
const PORT = 8000;

// Initial app
const app = express();

// Connect to MongoDB
ConnectDB();

// Config session
configSession(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// Enable flash message
app.use(connectFlash());

// Config passport JS
app.use(passport.initialize());
app.use(passport.session());

// Initial all routes
initialRoutes(app);

app.listen(PORT, HOST, () => {
  console.log(`Hello Fixcer, i'm running at ${HOST}:${PORT}/`);
});

// import pem from 'pem';
// import https from 'https';

// pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
//   if (err) {
//     throw err;
//   }

//   // Initial app
//   const app = express();

//   // Connect to MongoDB
//   ConnectDB();

//   // Config session
//   configSession(app);

//   // Config view engine
//   configViewEngine(app);

//   // Enable post data for request
//   app.use(bodyParser.urlencoded({ extended: true }));

//   // Enable flash message
//   app.use(connectFlash());

//   // Config passport JS
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // Initial all routes
//   initialRoutes(app);

//   https
//     .createServer({ key: keys.serviceKey, cert: keys.certificate }, app)
//     .listen(PORT, HOST, () => {
//       console.log(`Hello Fixcer, i'm running at ${HOST}:${PORT}/`);
//     });
// });

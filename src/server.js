import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initialRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import Session from './config/session';
import passport from 'passport';
import http from 'http';
import socket from 'socket.io';
import initSockets from './sockets/index';
import cookieParser from 'cookie-parser';
import configSocketIO from './config/socketio';
import events from 'events';
import { app as configApp } from './config/app';

// Initial app
const app = express();

// Set max connection event listeners
events.EventEmitter.defaultMaxListeners = configApp.max_event_listeners;

// Init server with socket.io & express app
const server = http.createServer(app);
const io = socket(server);

// Connect to MongoDB
ConnectDB();

// Config session
Session.config(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// Enable flash message
app.use(connectFlash());

// Use cookie parser
app.use(cookieParser());

// Config passport JS
app.use(passport.initialize());
app.use(passport.session());

// Initial all routes
initialRoutes(app);

// Config for socket.io
configSocketIO(io, cookieParser, Session.sessionStore);

// Init all sockets
initSockets(io);

server.listen(configApp.PORT, configApp.HOST, () => {
  console.log(`Running at http://${configApp.HOST}:${configApp.PORT}`);
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

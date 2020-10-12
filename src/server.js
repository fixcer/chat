import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initialRoutes from './routes/web';
import bodyParser from 'body-parser';

// Initial app
const app = express();

// Connect to MongoDB
ConnectDB();

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// Initial all routes
initialRoutes(app);

// app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//   console.log(
//     `Hello Fixcer, i'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`
//   );
// });

const HOST = 'localhost';
const PORT = 8000;

app.listen(PORT, HOST, () => {
  console.log(`Hello Fixcer, i'm running at ${HOST}:${PORT}/`);
});

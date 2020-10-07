import express from 'express';
import ConnectDB from './config/connectDB';
import ContactModel from './models/ContactModel';

const app = express();

// Connect to MongoDB
ConnectDB();

const host = 'localhost';
const port = 8000;

app.get('/test', async (req, res) => {
  try {
    let item = {
      userId: '191098',
      contactId: '19101998',
    };

    let contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (err) {}
});

app.get('/', (req, res) => {
  res.send('<h1>Hello World!!</h1>');
});

app.listen(process.env.PORT, process.env.host, () => {
  console.log(`Hello Fixcer, i'm running at ${host}:${port}/`);
});

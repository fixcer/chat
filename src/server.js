import express from 'express';

const app = express();

const host = 'localhost';
const port = 8000;

app.get('/', (req, res) => {
  res.send('<h1>Hello World!!</h1>');
});

app.listen(port, host, () => {
  console.log(`Hello Fixcer, i'm running at ${host}:${port}/`);
});

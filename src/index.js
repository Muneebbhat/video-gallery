import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';

const app = express();
app.get('/', (req, res) => {
  res.send(`hello world`);
});
app.listen(process.env.PORT, error => {
  try {
    console.log(`server listening on ${process.env.PORT}`);
  } catch (error) {
    console.log(`server listening on ${error}`);
  }
});

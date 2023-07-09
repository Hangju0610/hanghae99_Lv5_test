const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const indexRouter = require('./src/routes/index');

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use('/api', indexRouter);

app.listen(process.env.PORT, () => {
  console.log('서버 작동');
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // for logging
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const app = express();
require('dotenv/config');

const api = process.env.API_URL;
const port = 3000;

//CORS
app.use(cors());
app.options("*",cors())

// Middleware
app.use(bodyParser.json())
app.use(morgan('tiny'));
app.use(authJwt())
app.use(errorHandler)

// Routers
const productsRouter = require('./routers/product');
const categoryRouter = require('./routers/categories');
const userRouter = require('./routers/users');

app.use(`${api}/products`,productsRouter);
app.use(`${api}/categories`,categoryRouter);
app.use(`${api}/users`,userRouter);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDB Connection is Ready!")
}).catch((err) => {
  console.error(err);
})

app.listen(port,() => {
  console.log(`${port} is listening`);
})
import express from "express";
const app = express();
import { create } from 'express-handlebars';
import AuthRouter from './routes/auth.js';
import ProductsRouter from './routes/products.js';
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";
import varMiddleware from "./middleware/var.js";
import kookieParser from "cookie-parser";
import userMiddlewere from "./middleware/user.js";
import hbsHelprs from './util/index.js';

import * as dotenv from 'dotenv';
dotenv.config();

const hbs = create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: hbsHelprs,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(kookieParser());
app.use(session({secret: 'Apple', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(varMiddleware);
app.use(userMiddlewere)

app.use(AuthRouter);
app.use(ProductsRouter);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true});

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => console.log(`Server is running port ${PORT}`));


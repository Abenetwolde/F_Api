
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { connectToDatabase } from '../config/db';
import user from "./routers/user"
import product from './routers/product';
import mongoose from 'mongoose';
import path from 'path';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('uploads'));


app.use('/api/user', user);
app.use('/api/product', product);
connectToDatabase()
 
app.listen(8000, () => {
  console.log('Server running on http://localhost:8080/');
});

 
mongoose.connection.on('error', (error: Error) => console.log(error));

// app.use('/', router());
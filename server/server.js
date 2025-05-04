import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebHooks } from './cotrollers/orderController.js';

dotenv.config();
const app=express();
const Port = process.env.PORT || 4000;

const allowedOrigins = ['http://localhost:5173']
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin : allowedOrigins, credentials : true}));
await connectCloudinary();

app.get('/', (req,res)=> (res.send('i am backend')))
app.use('/api/user' , userRouter);
app.use('/api/seller' , sellerRouter);
app.use('/api/product' , productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/stripe' , express.raw({type :'application/json'}), stripeWebHooks)

app.listen(Port, ()=>{
    console.log(`server is running on port: ${Port}`);
    connectDB();
})

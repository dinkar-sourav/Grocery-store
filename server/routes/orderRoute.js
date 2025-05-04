import express from 'express';
import authUser from '../middleware/authUser.js';
import { getAllOrders, getUserOrders, placeOrder, placeOrderStripe } from '../cotrollers/orderController.js';
import authSeller from '../middleware/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod' , authUser , placeOrder);
orderRouter.get('/user' , authUser , getUserOrders);
orderRouter.get('/seller' , authSeller , getAllOrders)
orderRouter.post('/stripe' , authUser , placeOrderStripe)

export default orderRouter;
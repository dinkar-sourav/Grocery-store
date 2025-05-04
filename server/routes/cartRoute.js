import express from 'express';
import mongoose from 'mongoose';
import authUser from '../middleware/authUser.js';
import { updatecart } from '../cotrollers/cartController.js';

const cartRouter = express.Router();
cartRouter.post('/update' , authUser , updatecart);

export default cartRouter;
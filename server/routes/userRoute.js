import express from 'express';
import { register,login, isAuth, logout } from '../cotrollers/userController.js';
import authUser from '../middleware/authUser.js';

const userRouter = express.Router();

userRouter.post('/register' , register);
userRouter.post('/login' , login);
userRouter.get('/is-auth',authUser ,isAuth);
userRouter.get('/logout' , authUser , logout);

export default userRouter;
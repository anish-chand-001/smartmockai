
import express from 'express'
import { verifyToken } from './../middlewares/verifyToken.js';
import { createOrder, verifyPayment } from '../controllers/payment.controller.js';

const paymentRouter = express.Router()

paymentRouter.post("/order",verifyToken,createOrder)
paymentRouter.post("/verify",verifyToken,verifyPayment)


export default paymentRouter;
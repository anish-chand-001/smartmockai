import razorpay from "../services/razorpay.service.js";
import Payment from "./../models/payment.model.js";
import User from "./../models/user.model.js"; // You need this to give the user credits
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;
    
    // Added planId to validation
    if (!amount || !credits || !planId) {
      return res.status(400).json({
        message: "Invalid plan data",
      });
    }

    const options = {
      amount: amount * 100, // Correctly converting to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // BUG FIX: The Razorpay SDK uses 'orders', not 'order'
    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.user.id, // Assumes you have auth middleware setting this
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.status(200).json(order);
  } catch (error) {
    // FIX: Updated error message (it previously said "failed to get currentUser")
    return res.status(500).json({
      message: `Failed to create order: ${error.message}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // 1. Verify Signature
    if (expectedSignature !== razorpay_signature) {
      // Optional: You could update the Payment status to "failed" here
      return res.status(400).json({ message: "Invalid Payment Signature" });
    }

    // 2. COMPLETION: Update the Payment record to "paid"
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      },
      { new: true } // Returns the updated document
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    await User.findByIdAndUpdate(payment.userId, {
      $inc: { credits: payment.credits }, 
    });

    // 4. Send success response to the frontend
    return res.status(200).json({ 
      success: true, 
      message: "Payment verified successfully" 
    });

  } catch (error) {
    return res.status(500).json({ 
      message: `Failed to verify payment: ${error.message}` 
    });
  }
};
import { razorpay } from "../config/razorpay.js";

export const handleCreateOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        msg: "amount not sent",
      });
    }
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    return res.status(200).json({
      order,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error ",
    });
  }
};

// /api/order/cod

import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import stripe from "stripe";

export const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!address || items.length == 0) {
      return res.json({
        success: false,
        message: "Invalid Data",
      });
    }
    // calculate amount
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02);
    await Order.create({
      userId: req.user_Id,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.json({
      success: true,
      message: "order placed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// PLACE ORDER USING STRIPE: /api/order/stripe

export const placeOrderStripe = async (req, res) => {
  try {
    const { items, address } = req.body;
    const { origin } = req.headers;
    if (!address || items.length == 0) {
      return res.json({
        success: false,
        message: "Invalid Data",
      });
    }
    // calculate amount
    let productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02);
    const order = await Order.create({
      userId: req.user_Id,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // stripe initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
        },
        quantity: item.quantity,
      };
    });

    // create session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user_Id,
      },
    });
    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// stripe webhook to verify payment action : /stripe
export const stripeWebHooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    res.status(400).send(`webook error : ${error.message}`);
  }

  // handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // getting session metadata
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const { orderId, userId } = session.data[0].metadata;
        await Order.findByIdAndUpdate(orderId , { isPaid:true});
        await User.findByIdAndUpdate(userId , {cartItems : {}});
        break;
      }
    case "payment_intent.payment_failed" : {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // getting session metadata
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        const { orderId } = session.data[0].metadata;
        await Order.findByIdAndDelete(orderId);
        break;
    }
    default:
        console.error(`Unhandled event type ${event.type}`);
         break;
  }
  res.json({
    received :true
  })
};

// Get orders by userId : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user_Id;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get all orders for seller /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

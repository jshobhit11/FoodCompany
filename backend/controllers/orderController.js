import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order for frontend
// const placeOrder = async (req, res) => {
//     const frontend_url="http://localhost:5173"
//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     const line_items = req.body.items.map((item) => {
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name

//         },
//         unit_amount:item.price*100*80
//       },
//       quantity:item.quantity
//     })
//   }
//   line_items.push({
//     price_data:{
//         currency:"inr",
//         product_data:{
//             name:"Delivery charges"
//         },
//         unit_amount:2*100*80
//     },
//     quantity:1
//   })
//   const session=await stripe.checkout.sessions.create({
//     line_items:line_items,
//     mode:"payment",
//     success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

//   })
//   res.json({sucess:true,session_url:session.url})

// }
//   catch (error) {}

// };

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // Create a new order
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();

    // Clear the user's cart after placing the order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create line items for the Stripe checkout session
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100 * 80), // Adjust the price as needed
      },
      quantity: item.quantity,
    }));

    // const headers = {
    //   "Content-type": "application/json",
    // };
    // Add delivery charges as a line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery charges",
        },
        unit_amount: Math.round(2 * 100 * 80), // Adjust the delivery charges as needed
      },
      quantity: 1,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      // payment_method_types: ["card"],
      mode: "payment",
      // headers: headers,
      // body: JSON.stringify(body),

      success_url: `${frontend_url}?success=true`,
      cancel_url: `${frontend_url}?canceled=true`,
    });

    // Respond with the session URL
    // console.log(session);
    // const result = stripe.redirectToCheckout({ sessionId: session.url });
    // res.redirect(303, session.url);
    res.json({ success: true, session_url: session.url });
    //res.json({ success: true, session_url: result });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ sucess: false, message: "Not paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ sucess: false, message: "error" });
  }
};

//user order for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

//Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };

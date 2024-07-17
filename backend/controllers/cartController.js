import userModel from "../models/userModel.js";

//add item to user cart
const addToCart = async (req, res) => {
  try {
    // Destructure userId and itemId from req.body
    const { userId, itemId } = req.body;

    // Find the user by ID
    let userData = await userModel.findById(userId);

    // Initialize the cart if it doesn't exist
    let cartData = userData.cartData || {};

    // Add item to cart or increment quantity
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    // Update the user's cart data in the database
    await userModel.findByIdAndUpdate(userId, {
      cartData,
    });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding to cart" });
  }
};

//remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Find the user by ID
    let userData = await userModel.findById(userId);

    // Initialize the cart if it doesn't exist
    let cartData = userData.cartData || {};

    // Decrement item quantity or remove it from the cart
    if (cartData[itemId]) {
      if (cartData[itemId] > 1) {
        cartData[itemId] -= 1;
      } else {
        delete cartData[itemId];
      }
    }

    // Update the user's cart data in the database
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing from cart" });
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    // Find the user by their ID, which was set in the request body by the auth middleware
    let userData = await userModel.findById(req.body.userId);

    // Retrieve the cart data from the user's document
    let cartData = userData.cartData;

    // Send the cart data in the response
    res.json({ success: true, cartData });
  } catch (error) {
    // Log any errors and send an error response
    console.log(error);
    res.json({ success: false, message: "Error retrieving cart data" });
  }
};

export { addToCart, removeFromCart, getCart };

// const addToCart = async (req, res) => {
//   try {
//     let userData = await userModel.findById(req.body.userId);
//     let cartData = await userData.cartData;
//     if (!cartData[req.body.itemId]) {
//       cartData[req.body.itemId] = 1;
//     } else {
//       cartData[req.body.itemId] += 1;
//     }
//     console.log(req.body.userId);
//     await userModel.findByIdAndUpdate(req.body.userId, {
//       cartData,
//     });
//     res.json({ success: true, message: "Added to cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "error" });
//   }
// };

//remove items from user cart
// const removeFromCart = async (req, res) => {
//   try {
//     let userData = await userModel.findById(req.body.userId);
//     let cartData = await userData.cartData;
//     if (cartData[req.body.id] > 0) {
//       cartData[req.body.itemId] -= 1;
//     }
//     await userModel.findByIdAndUpdate(req.body.id, { cartData });
//     res.json({ success: true, message: "removed from cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "error" });
//   }
// };

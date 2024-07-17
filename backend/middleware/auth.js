import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "Not authorized, please log in again",
    });
  }
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
    req.body.userId = token_decode.id; // Extract the user ID from the token and add it to the request body
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export default authMiddleware;

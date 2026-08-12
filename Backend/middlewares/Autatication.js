import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated. Please log in.",
        success: false,
        isAuthError: true,
      });
    }

    // Verify token
    try {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      if (!decode || !decode.userId) {
        return res.status(401).json({
          message: "Invalid token. Please log in again.",
          success: false,
          isAuthError: true,
        });
      }
      req.id = decode.userId;
      next();
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please log in again.",
          success: false,
          isAuthError: true,
        });
      }
      return res.status(401).json({
        message: "Invalid or malformed token. Please log in again.",
        success: false,
        isAuthError: true,
      });
    }
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      message: "Authentication server error",
      success: false,
    });
  }
};

export default isAuthenticated;
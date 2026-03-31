import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  console.log("🔍 Auth Middleware Check");
  console.log("📦 Cookies:", req.cookies);
  console.log("📋 Headers:", req.headers);
  
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers?.authorization;
  let token = cookieToken;

  console.log("🍪 Cookie token:", cookieToken ? "✅ Found" : "❌ Not found");
  console.log("🔐 Auth header:", authHeader ? "✅ Found" : "❌ Not found");

  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
    console.log("✅ Token extracted from Authorization header");
  }

  if (!token) {
    console.log("❌ No token found - returning 401");
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "AmanIsDeveloper"
    );
    console.log("✅ Token verified:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(403)
        .json({ status: false, message: "Forbidden: Invalid token" });
    } else {
      return res.status(500).json({ status: false, message: "Server error" });
    }
  }
};

export default authMiddleware;

const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("./errorHandler");

function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    throw new AuthenticationError("No authentication token provided");
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AuthenticationError("Authentication token has expired");
    } else if (err.name === "JsonWebTokenError") {
      throw new AuthenticationError("Invalid authentication token");
    } else {
      throw new AuthenticationError("Authentication failed");
    }
  }
}

module.exports = auth;

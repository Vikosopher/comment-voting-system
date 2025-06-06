const jwt = require("jsonwebtoken");

// Generate short-lived Access Token (15 min) — sent to frontend
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};


// Generate long-lived Refresh Token (7 days) — stored in HttpOnly cookie
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

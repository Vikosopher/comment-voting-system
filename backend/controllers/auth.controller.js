const {
  registerUser,
  loginUser,
  handleRefreshToken,
} = require("../services/auth.service");

const signup = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Signup successful",
      accessToken,
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(401).json({ message: err.message || "Login failed" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const { accessToken, user } = await handleRefreshToken(token);

    res.status(200).json({ accessToken, user });
  } catch (err) {
    res.status(401).json({ message: err.message || "Token refresh failed" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
}

module.exports = {
  signup,
  login,
  refreshToken,
  logout
};

import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  const userId = req.header("userId");
  if (!userId) return res.status(401).json({ message: "No userId provided" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default authMiddleware;

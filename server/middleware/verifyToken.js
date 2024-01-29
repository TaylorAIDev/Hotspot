const User = require('../models/User')
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
          console.log('error while verifying the token')
         return res.status(403).json({ status: "error", error: "Error while verifying the token" });
        }
        const existingUser = await User.findById(user.id).lean();
        if (!existingUser) {
          return res.status(401).json({ message: "User doesn't exists!" });
        }
        req.user = user;
        next();
      });
    } else {
      return res
        .status(401)
        .json({ status: "error", message: "Authentication failed!" });
    }
  };

module.exports = verifyToken
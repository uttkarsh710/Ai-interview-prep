import jwt from "jsonwebtoken";

/* Verify JWT token */
const verifyToken = (req, res, next) => {

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, isAdmin }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

};

/* Admin only middleware */
const verifyAdmin = (req, res, next) => {

  verifyToken(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Admin only" });
    }
    next();
  });

};

export { verifyToken, verifyAdmin };
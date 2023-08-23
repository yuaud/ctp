import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      /* status 403 = you don't have permission to access */
      return res.status(403).send("Access Denied.");
    }
    /* there is a space after the Bearer. Do not forget... */
    if (token.startsWith("Bearer ")) {
      /* separating the token from the header */
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    /* proceed to next step */
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

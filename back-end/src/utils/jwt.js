import jwt from "jsonwebtoken";

const KEY = process.env.SESSION_SECRET || "sdf548ijdsjf";
// KEY =

const setUser = (user, role, days) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      name: user.name || `${user.givenName} ${user.familyName}`,
      picture: user.picture,
      email: user.email,
      status: user.status,
      role: role,
    },
    KEY,
    {
      expiresIn: days ? `${days}d` : `2h`,
      algorithm: "HS512",
    }
  );
};

const getInfo = (token) => {
  return jwt.decode(token);
};

const getUser = (token, accessToken = KEY) => {
  return jwt.verify(token, accessToken, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return null; // Return null if verification fails
    } else if (err && err.name === "TokenExpiredError") {
      console.error("JWT expired:", err);
      return null; // Return null if token is expired
    }
    return decoded;
  });
};

export { setUser, getUser, getInfo };

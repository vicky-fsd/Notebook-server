const jwt = require("jsonwebtoken");

const fetchuser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }

  const [bearer, token] = authorizationHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).send({ error: "Invalid Authorization header format" });
  }

  try {
    const data = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;

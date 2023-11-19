const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient();

const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
    return;
  }

  // Check if user data is in the cache
  client.get(token, async (err, user) => {
    if (err) {
      console.error("Redis Error:", err);
    }

    if (user) {
      // If user data is found in the cache, use it
      req.user = JSON.parse(user);
      next();
    } else {
      try {
        // If user data is not in the cache, verify the token and store user data in the cache
        const data = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
        req.user = data.user;

        // Store user data in the cache with a TTL (time to live) of, for example, 1 hour
        client.setex(token, 3600, JSON.stringify(req.user));

        next();
      } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
      }
    }
  });
};

module.exports = fetchuser;

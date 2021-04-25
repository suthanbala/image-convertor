const uuid = require("uuid");
const jwt = require("jsonwebtoken");

// Holds all the sessions
const sessions = [];

/**
 * Creates a session for the current user and returns it
 * @returns accessToken
 */
function initiateSession() {
    const newSession = uuid();
    const user = {
      session: newSession
    };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h'});
    sessions.push(accessToken);
    return accessToken;
}

/**
 * Given the request object, return the Authorization token from the Header
 * @param {Request} req Request Object
 * @returns Access token
 */
function getAccessToken(req) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    return token;
}

/**
 * Authenticate the given user middleware
 */
function authenticateToken(req, res, next) {
  const token = getAccessToken(req);
  if (token === null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err || sessions.indexOf(token) === -1) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function logoutUser(token) {
    const sessionIndex = sessions.indexOf(token);
    sessions.splice(sessionIndex, 1);
}

module.exports = {
  authenticateToken,
  initiateSession,
  logoutUser,
  getAccessToken
};

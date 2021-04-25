const jwt = require("jsonwebtoken");
const {
  authenticateToken,
  initiateSession,
  logoutUser,
  getAccessToken
} = require("./middlewares/authenticator");
const upload = require("./middlewares/fileUploader");

module.exports = app => {
  app.get("/", (req, res) => {
    res.send("Got a GET request");
  });

  app.get("/validate-user", authenticateToken, (req, res) => {
    return res.json(req.user);
  });

  app.post("/init-session", (req, res) => {
    const accessToken = initiateSession();
    return res.json({ accessToken });
  });

  app.post("/upload", upload.single("file"), (req, res) => {
    console.log("POST Single file");
    res.send("uploaded");
  });

  app.delete("/destroy", authenticateToken, (req, res) => {
    const token = getAccessToken(req);
    logoutUser(token);
    res.json({
        status: 'success'
    })
  });
};

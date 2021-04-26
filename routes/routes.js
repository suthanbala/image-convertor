const path = require('path');
const {
  authenticateToken,
  initiateSession,
  logoutUser,
  getAccessToken
} = require("../middlewares/authenticator");
const { compressedPath } = require('../config/web-config');
const { getUserDirectory } = require('../utils/utils')
const { createStorage, processUploadedFile, archiveFolder } = require("../middlewares/fileUploader");

// Default upload path
const uploadPath = "./uploads";
const upload = createStorage(uploadPath);

module.exports = app => {
  app.get("/validate-user", authenticateToken, (req, res) => {
    return res.json(req.user);
  });

  app.get('/user-files', authenticateToken, (req, res) => {
    const relativePath = getUserDirectory(req);
    const userPath = path.resolve(compressedPath, relativePath);
    console.log(userPath); 
    res.json({status: 'loggedIn'})
  })

  app.post("/init-session", (req, res) => {
    const accessToken = initiateSession();
    return res.json({ accessToken });
  });

  app.get('/download-archive', authenticateToken, archiveFolder);

  
  // First upload the file, then move it to the user's session folder. Then run a command to convert it
  // Once the conversion is done, then remove the source file
  app.post("/upload", authenticateToken, upload.single("file"), processUploadedFile);

  app.delete("/destroy", authenticateToken, (req, res) => {
    const token = getAccessToken(req);
    logoutUser(token);
    res.json({
        status: 'success'
    })
  });
};

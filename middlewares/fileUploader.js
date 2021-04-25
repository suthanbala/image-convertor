const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); //here we specify the destination. in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    console.log(file); //log the file object info in console
    cb(null, file.originalname); //here we specify the file saving name. in this case.
    //i specified the original file name .you can modify this name to anything you want
  }
});
var upload = multer({ storage });

module.exports = upload;

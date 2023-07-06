const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check the file type and create a separate folder for profile pics
    if (file.fieldname === 'profilePic') {
      cb(null, './public/dp');
    } else {
      cb(null, './public/uploads/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = {
  upload,
};

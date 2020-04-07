const multer = require('multer');
const Boom = require('@hapi/boom');
const uid = require('uid');
const path = require('path');

const getUploader = destination => {
  const storage = multer.diskStorage({
    destination,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
        return cb(Boom.badRequest());
      }

      return cb(null, true);
    },
    filename: (req, file, cb) => {
      const randomFileName = uid();
      return cb(null, randomFileName + path.extname(file.originalname));
    }
  });

  const uploader = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // File Size: 2 MB
  });

  return uploader;
};

module.exports = {
  getUploader
};

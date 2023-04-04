
const multer = require('multer');
const path = require('path');

const  fileFilter =  (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else { 
        cb("Неизвестный формат изображения", false)
    }    
  
  }

const loader = multer({
    dest: path.join('./', 'tmp'), 
    limits: {fileSize: 2 * 1024 * 1924},
    fileFilter: fileFilter 
});

module.exports  = loader;
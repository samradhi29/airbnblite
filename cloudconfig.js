const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Cloudinary storage configuration with multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wandarlust_dev',  // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],  // Correct property name
    public_id: (req, file) => {
      // You can modify the public ID dynamically if needed
      return 'computed-filename-using-request';  // Example dynamic naming
    },
  },
});

module.exports = {
  cloudinary,
  storage
};

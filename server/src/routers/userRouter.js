const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getProfile,
  getTrainers,
  getClients,
} = require('../controllers/userProfileController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');
const upload = require('../middlewares/multer');

// ... existing code ...
router.get('/gettrainers', verifyAccessToken, getTrainers);
router.get('/getclients', verifyAccessToken, getClients);
router.get('/profile', verifyAccessToken, getProfile);
router.post('/profile', verifyAccessToken, upload.single('avatar'), updateProfile);

module.exports = router;

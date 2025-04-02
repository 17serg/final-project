const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/userProfileController');
const { verifyAccessToken } = require('../middlewares/verifyTokens');

// ... existing code ...

router.post('/profile', verifyAccessToken, updateProfile);

module.exports = router;

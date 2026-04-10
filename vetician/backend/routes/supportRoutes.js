const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

// Public routes
router.get('/contact', supportController.getContactDetails);
router.post('/enquiries', supportController.createEnquiry);
router.get('/enquiries/user/:userId', supportController.getUserEnquiries);

// Admin routes
router.get('/enquiries', supportController.getAllEnquiries);
router.patch('/enquiries/:id', supportController.updateEnquiryStatus);
router.delete('/enquiries/:id', supportController.deleteEnquiry);
router.put('/contact', supportController.updateContactDetails);

module.exports = router;

const express = require('express');
const router = express.Router();
const daycarePricingController = require('../controllers/daycarePricingController');

// Public routes
router.get('/plans', daycarePricingController.getAllPricingPlans);

// Admin routes
router.post('/plans', daycarePricingController.createPricingPlan);
router.put('/plans/:id', daycarePricingController.updatePricingPlan);
router.delete('/plans/:id', daycarePricingController.deletePricingPlan);

module.exports = router;

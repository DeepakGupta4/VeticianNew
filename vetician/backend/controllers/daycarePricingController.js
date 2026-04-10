const DaycarePricing = require('../models/DaycarePricing');

// Get all active pricing plans
exports.getAllPricingPlans = async (req, res) => {
  try {
    const plans = await DaycarePricing.find({ isActive: true }).sort({ order: 1 });
    
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pricing plans',
      error: error.message
    });
  }
};

// Create new pricing plan (Admin)
exports.createPricingPlan = async (req, res) => {
  try {
    const plan = new DaycarePricing(req.body);
    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Pricing plan created successfully',
      plan
    });
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pricing plan',
      error: error.message
    });
  }
};

// Update pricing plan (Admin)
exports.updatePricingPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await DaycarePricing.findByIdAndUpdate(id, req.body, { new: true });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Pricing plan updated successfully',
      plan
    });
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update pricing plan',
      error: error.message
    });
  }
};

// Delete pricing plan (Admin)
exports.deletePricingPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await DaycarePricing.findByIdAndDelete(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Pricing plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Pricing plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete pricing plan',
      error: error.message
    });
  }
};

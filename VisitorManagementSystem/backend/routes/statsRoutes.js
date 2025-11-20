const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Get statistics
router.get('/', async (req, res) => {
  try {
    // Visitors currently inside
    const visitorsInside = await Visitor.countDocuments({ isInside: true });
    
    // Total visitors registered
    const totalVisitors = await Visitor.countDocuments();
    
    // Visitors who have checked out
    const visitorsOutside = await Visitor.countDocuments({ isInside: false });
    
    // Today's check-ins
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCheckIns = await Visitor.countDocuments({
      checkInTime: { $gte: todayStart }
    });
    
    // Today's check-outs
    const todayCheckOuts = await Visitor.countDocuments({
      checkOutTime: { $gte: todayStart }
    });
    
    // Visitors with return consent
    const visitorsWithReturnConsent = await Visitor.countDocuments({
      hasReturnConsent: true,
      isInside: false,
      expectedReturnTime: { $gte: new Date() }
    });

    res.json({
      visitorsInside,
      visitorsOutside,
      totalVisitors,
      todayCheckIns,
      todayCheckOuts,
      visitorsWithReturnConsent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get visitors currently inside
router.get('/inside', async (req, res) => {
  try {
    const visitors = await Visitor.find({ isInside: true })
      .select('name phone email purpose hostName checkInTime')
      .sort({ checkInTime: -1 });
    res.json({ visitors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


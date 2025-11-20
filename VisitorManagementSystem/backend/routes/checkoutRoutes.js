const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Check-out visitor
router.post('/', async (req, res) => {
  try {
    const { qrCode, aadharLastFour, expectedReturnTime } = req.body;
    
    let visitor;
    if (qrCode) {
      visitor = await Visitor.findOne({ qrCode });
    } else if (aadharLastFour) {
      visitor = await Visitor.findOne({ aadharLastFour });
    } else {
      return res.status(400).json({ error: 'QR code or Aadhar last 4 digits required' });
    }

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    if (!visitor.isInside) {
      return res.status(400).json({ error: 'Visitor is not inside' });
    }

    visitor.isInside = false;
    visitor.checkOutTime = new Date();
    
    // Update the last visit record
    const lastVisit = visitor.visits[visitor.visits.length - 1];
    if (lastVisit) {
      lastVisit.checkOutTime = new Date();
      if (expectedReturnTime) {
        lastVisit.expectedReturnTime = new Date(expectedReturnTime);
        visitor.expectedReturnTime = new Date(expectedReturnTime);
        visitor.hasReturnConsent = true;
      }
    }

    await visitor.save();

    res.json({ 
      message: 'Check-out successful',
      visitor: {
        id: visitor._id,
        name: visitor.name,
        checkOutTime: visitor.checkOutTime,
        isInside: visitor.isInside,
        expectedReturnTime: visitor.expectedReturnTime,
        hasReturnConsent: visitor.hasReturnConsent
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


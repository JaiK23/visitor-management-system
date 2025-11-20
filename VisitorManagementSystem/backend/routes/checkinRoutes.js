const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Check-in visitor
router.post('/', async (req, res) => {
  try {
    const { qrCode, aadharLastFour } = req.body;
    
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

    if (visitor.isInside) {
      return res.status(400).json({ error: 'Visitor is already inside' });
    }

    visitor.isInside = true;
    visitor.checkInTime = new Date();
    visitor.visits.push({
      checkInTime: new Date()
    });

    await visitor.save();

    res.json({ 
      message: 'Check-in successful',
      visitor: {
        id: visitor._id,
        name: visitor.name,
        checkInTime: visitor.checkInTime,
        isInside: visitor.isInside
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


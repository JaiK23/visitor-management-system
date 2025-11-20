const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const QRCode = require('qrcode');

// Register a new visitor
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, aadharNumber, purpose, hostName, hostPhone } = req.body;
    
    if (!name || !phone || !aadharNumber || !purpose || !hostName || !hostPhone) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Extract last 4 digits of Aadhar
    const aadharLastFour = aadharNumber.slice(-4);
    
    // Generate unique QR code data
    const qrData = `${aadharNumber}-${Date.now()}`;
    
    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrData);

    const visitor = new Visitor({
      name,
      phone,
      email,
      aadharNumber,
      aadharLastFour,
      purpose,
      hostName,
      hostPhone,
      qrCode: qrData,
      qrCodeImage
    });

    await visitor.save();
    res.status(201).json({ 
      message: 'Visitor registered successfully',
      visitor: {
        id: visitor._id,
        name: visitor.name,
        aadharLastFour: visitor.aadharLastFour,
        qrCode: visitor.qrCode,
        qrCodeImage: visitor.qrCodeImage
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Visitor with this Aadhar number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get visitor by QR code or Aadhar last 4 digits
router.post('/verify', async (req, res) => {
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

    res.json({ visitor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json({ visitors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get visitor by ID
router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    res.json({ visitor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


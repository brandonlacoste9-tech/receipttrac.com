import express from 'express';
import multer from 'multer';
import { extractReceiptData } from '../services/gemini.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload and process receipt
router.post('/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Processing receipt: ${req.file.originalname}`);

    // In production, this would use Google Gemini Vision API
    // For now, return mock extracted data
    const extractedData = await extractReceiptData(req.file.buffer);

    res.json({
      id: Date.now(),
      filename: req.file.originalname,
      ...extractedData
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ 
      error: 'Failed to process receipt',
      message: error.message 
    });
  }
});

// Get all receipts
router.get('/', async (req, res) => {
  try {
    // In production, fetch from database
    const receipts = [
      {
        id: 1,
        vendor: 'ABC Restaurant',
        date: '2026-03-01',
        total: 87.50,
        category: 'Dining',
        confidence: 0.95
      },
      {
        id: 2,
        vendor: 'Office Depot',
        date: '2026-02-28',
        total: 234.99,
        category: 'Supplies',
        confidence: 0.98
      }
    ];

    res.json(receipts);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// Get single receipt by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, fetch from database
    const receipt = {
      id: parseInt(id),
      vendor: 'ABC Restaurant',
      date: '2026-03-01',
      total: 87.50,
      tax: 7.00,
      subtotal: 80.50,
      category: 'Dining',
      confidence: 0.95,
      lineItems: [
        { description: 'Appetizer', amount: 15.00 },
        { description: 'Main Course', amount: 45.50 },
        { description: 'Beverages', amount: 20.00 }
      ]
    };

    res.json(receipt);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
});

export default router;

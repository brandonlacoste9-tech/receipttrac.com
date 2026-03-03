const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ReceiptTrac API is running' });
});

// Receipt Upload & OCR Endpoint (Mocked)
app.post('/api/receipts/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Mock OCR processing - in production, this would call Gemini Vision API
    const mockReceiptData = {
      id: Date.now().toString(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedAt: new Date().toISOString(),
      status: 'processed',
      ocrData: {
        vendor: 'Sample Vendor Co.',
        total: (Math.random() * 500 + 50).toFixed(2),
        tax: (Math.random() * 50 + 5).toFixed(2),
        date: new Date().toLocaleDateString(),
        lineItems: [
          { description: 'Product A', amount: '29.99' },
          { description: 'Product B', amount: '45.50' },
          { description: 'Service Fee', amount: '12.00' }
        ],
        confidence: 0.95
      }
    };

    res.json({
      success: true,
      receipt: mockReceiptData,
      message: 'Receipt processed successfully (mocked)'
    });
  } catch (error) {
    console.error('Receipt upload error:', error);
    res.status(500).json({ error: 'Failed to process receipt' });
  }
});

// Get all receipts
app.get('/api/receipts', (req, res) => {
  // Mock data - in production would query database
  const mockReceipts = [
    {
      id: '1',
      vendor: 'Office Supplies Inc.',
      total: '245.67',
      date: '2026-03-01',
      status: 'processed'
    },
    {
      id: '2',
      vendor: 'Tech Store',
      total: '899.99',
      date: '2026-02-28',
      status: 'processed'
    }
  ];
  
  res.json({ receipts: mockReceipts });
});

// Predictive Budgeting Endpoint
app.get('/api/budget/predict', (req, res) => {
  // Mock predictive data - in production would use Gemini API
  const mockPrediction = {
    currentVelocity: 78,
    projectedEndMonth: 7000,
    variance: 24,
    dangerZone: true,
    insights: [
      'Spending velocity 24% above normal',
      'Projected to exceed budget by $1,200',
      'High frequency of discretionary purchases detected'
    ],
    recommendations: [
      'Reduce discretionary spending by 25%',
      'Review recurring subscriptions',
      'Implement approval workflow for purchases over $100'
    ]
  };
  
  res.json(mockPrediction);
});

// Executive Summary Endpoint (Gemini AI Integration - Mocked)
app.post('/api/insights/executive-summary', async (req, res) => {
  try {
    // Mock AI-generated summary - in production would call Gemini API
    const mockSummary = {
      verdict: 'CONCERNING',
      tone: 'ruthless',
      generatedAt: new Date().toISOString(),
      insights: [
        'Spending velocity at 78/100 - dangerously high trajectory',
        'Projected monthly burn rate: $7,000 (+24% vs forecast)',
        'Outstanding invoices represent 12% cash flow risk',
        'Discretionary spending up 34% - immediate action required',
        'Budget discipline: POOR - executive intervention needed'
      ],
      recommendation: 'Cut discretionary spending by 25% immediately. Review all subscriptions and recurring costs. Your financial trajectory is unsustainable at current burn rate.',
      dataPoints: {
        receiptsAnalyzed: 145,
        timeframeMonths: 6,
        confidenceScore: 0.89
      }
    };
    
    // Simulate API delay
    setTimeout(() => {
      res.json({
        success: true,
        summary: mockSummary
      });
    }, 1500);
  } catch (error) {
    console.error('Executive summary error:', error);
    res.status(500).json({ error: 'Failed to generate executive summary' });
  }
});

// Metrics Dashboard Data
app.get('/api/metrics/dashboard', (req, res) => {
  const mockMetrics = {
    netFlux: 24350,
    netFluxTrend: 12,
    spendingVelocity: 78,
    spendingVelocityTrend: 24,
    outstandingInvoices: 3200,
    outstandingInvoicesTrend: -8,
    invoiceCount: 3
  };
  
  res.json(mockMetrics);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 ReceiptTrac Backend Server running on port ${PORT}`);
  console.log(`🔴 Ferrari Red & Black Leather API ready`);
});

module.exports = app;

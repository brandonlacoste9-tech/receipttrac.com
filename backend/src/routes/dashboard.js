import express from 'express';

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', async (req, res) => {
  try {
    // In production, this would fetch from database
    // For now, return mock data
    const metrics = {
      netFlux: 32450,
      spendingVelocity: 2.3,
      outstandingInvoices: 5,
      cashReserves: 125800,
      timestamp: new Date().toISOString()
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get recent transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = [
      { 
        id: 1,
        vendor: 'Delta Airlines', 
        amount: -850, 
        date: '2026-03-02', 
        category: 'Travel',
        status: 'completed'
      },
      { 
        id: 2,
        vendor: 'AWS Services', 
        amount: -127, 
        date: '2026-03-01', 
        category: 'Software',
        status: 'completed'
      },
      { 
        id: 3,
        vendor: 'Client Payment', 
        amount: 5000, 
        date: '2026-02-28', 
        category: 'Income',
        status: 'completed'
      }
    ];

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;

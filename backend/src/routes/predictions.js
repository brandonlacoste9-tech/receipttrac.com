import express from 'express';

const router = express.Router();

// Get budget predictions
router.get('/budget', async (req, res) => {
  try {
    const today = new Date();
    const projections = [];
    
    // Generate mock projection data
    // Historical data (last 90 days)
    for (let i = -90; i < 0; i += 7) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      projections.push({
        date: date.toISOString().split('T')[0],
        actual: 18000 + Math.random() * 4000 - 2000,
        predicted: null,
        type: 'historical'
      });
    }

    // Future predictions (next 30 days)
    let baseSpend = 18000;
    for (let i = 0; i <= 30; i += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      baseSpend += (Math.random() * 200 - 50);
      
      projections.push({
        date: date.toISOString().split('T')[0],
        actual: null,
        predicted: baseSpend,
        upperBound: baseSpend * 1.15,
        lowerBound: baseSpend * 0.85,
        type: 'predicted'
      });
    }

    const alerts = [
      {
        id: 1,
        severity: 'danger',
        title: 'Dangerous Spending Spike Detected',
        message: 'Current velocity 32% above historical average. Projected to exceed monthly budget by $4,200 if trend continues.',
        recommendation: 'Implement immediate spending freeze on discretionary categories.',
        impact: -4200
      },
      {
        id: 2,
        severity: 'warning',
        title: 'Travel Category Trending High',
        message: 'Travel expenses up 45% vs 3-month average. End-of-month projection: $6,800 (budget: $5,000).',
        recommendation: 'Review upcoming travel bookings and optimize where possible.',
        impact: -1800
      },
      {
        id: 3,
        severity: 'info',
        title: 'Cash Flow Optimization Opportunity',
        message: 'Delaying 2 outstanding invoices by 5 days could improve month-end position by $2,100.',
        recommendation: 'Accelerate receivables collection by offering early payment discount.',
        impact: 2100
      }
    ];

    res.json({ projections, alerts });

  } catch (error) {
    console.error('Error generating predictions:', error);
    res.status(500).json({ error: 'Failed to generate predictions' });
  }
});

// Get spending velocity analysis
router.get('/velocity', async (req, res) => {
  try {
    const velocity = {
      current: 2.3,
      average: 1.74,
      trend: 'increasing',
      percentageChange: 32,
      forecast: {
        '7day': 2.4,
        '14day': 2.5,
        '30day': 2.6
      }
    };

    res.json(velocity);
  } catch (error) {
    console.error('Error calculating velocity:', error);
    res.status(500).json({ error: 'Failed to calculate velocity' });
  }
});

export default router;

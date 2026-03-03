import express from 'express';
import { generateExecutiveSummary } from '../services/gemini.js';

const router = express.Router();

// Generate executive summary
router.post('/executive-summary', async (req, res) => {
  try {
    const { metrics, spendingData, categoryData } = req.body;

    console.log('Generating executive summary...');

    // In production, this would use Google Gemini API
    const summary = await generateExecutiveSummary({
      metrics,
      spendingData,
      categoryData
    });

    res.json({ summary });

  } catch (error) {
    console.error('Error generating executive summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      message: error.message 
    });
  }
});

// Get spending insights
router.get('/spending', async (req, res) => {
  try {
    const insights = {
      topCategories: [
        { category: 'Travel', amount: 4200, percentage: 28 },
        { category: 'Software', amount: 3100, percentage: 21 },
        { category: 'Dining', amount: 2800, percentage: 19 }
      ],
      trends: [
        { 
          category: 'Travel',
          trend: 'increasing',
          change: 32,
          message: 'Travel expenses up 32% vs previous month'
        }
      ],
      recommendations: [
        'Consider negotiating better rates with frequent vendors',
        'Review software subscriptions for unused services',
        'Implement meal allowance policy for team dining'
      ]
    };

    res.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

export default router;

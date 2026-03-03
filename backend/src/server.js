import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard.js';
import receiptRoutes from './routes/receipts.js';
import insightsRoutes from './routes/insights.js';
import predictionsRoutes from './routes/predictions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/predictions', predictionsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ReceiptTrac API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ReceiptTrac API server running on port ${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
  console.log(`📄 Receipt API: http://localhost:${PORT}/api/receipts`);
  console.log(`💡 Insights API: http://localhost:${PORT}/api/insights`);
  console.log(`📈 Predictions API: http://localhost:${PORT}/api/predictions`);
});

export default app;

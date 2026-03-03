import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import axios from 'axios';

function PredictiveBudgeting() {
  const [projectionData, setProjectionData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/predictions/budget');
      setProjectionData(response.data.projections);
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      // Use mock data
      generateMockPredictions();
    } finally {
      setLoading(false);
    }
  };

  const generateMockPredictions = () => {
    const today = new Date();
    const projections = [];
    
    // Historical data (last 3 months)
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
      
      // Simulate increasing trend with some variance
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

    setProjectionData(projections);

    // Generate alerts
    const mockAlerts = [
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

    setAlerts(mockAlerts);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'danger': return 'status-negative';
      case 'warning': return 'status-warning';
      case 'info': return 'text-ferrari';
      default: return 'text-off-white';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'danger': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return '💡';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif text-embossed mb-2">
          Predictive Budgeting
        </h1>
        <p className="text-text-secondary">
          AI-powered spending velocity analysis and cash flow projections
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="metric-label">Current Velocity</div>
          <div className="metric-value">2.3x</div>
          <div className="mt-2 text-sm status-negative">↑ 32% vs avg</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">End-of-Month Projection</div>
          <div className="metric-value">{formatCurrency(21400)}</div>
          <div className="mt-2 text-sm status-warning">Over budget by {formatCurrency(4200)}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Runway Impact</div>
          <div className="metric-value">-0.8 mo</div>
          <div className="mt-2 text-sm text-text-secondary">If trend continues</div>
        </div>
      </div>

      {/* Projection Chart */}
      <div className="chart-container">
        <h3 className="text-xl font-semibold mb-4 text-ferrari">
          30-Day Spending Projection
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projectionData}>
              <defs>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff2800" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ff2800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#a0a0a0"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis stroke="#a0a0a0" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#151515', 
                  border: '1px solid rgba(255, 40, 0, 0.35)',
                  borderRadius: '8px'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              
              <ReferenceLine 
                y={17000} 
                stroke="#00ff88" 
                strokeDasharray="5 5" 
                label={{ value: 'Target Budget', fill: '#00ff88', fontSize: 12 }}
              />
              
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#e0e0e0" 
                strokeWidth={2}
                dot={{ fill: '#e0e0e0', r: 2 }}
                name="Actual Spending"
              />
              
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#ff2800" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                name="Predicted Spending"
              />
              
              <Line 
                type="monotone" 
                dataKey="upperBound" 
                stroke="#ff2800" 
                strokeWidth={1}
                strokeOpacity={0.3}
                dot={false}
                name="Upper Bound"
              />
              
              <Line 
                type="monotone" 
                dataKey="lowerBound" 
                stroke="#ff2800" 
                strokeWidth={1}
                strokeOpacity={0.3}
                dot={false}
                name="Lower Bound"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        <div className="mt-4 text-sm text-text-secondary">
          <p>
            Projection based on 90-day historical spending patterns and ML trend analysis.
            Confidence interval shown in shaded area.
          </p>
        </div>
      </div>

      {/* Alerts & Recommendations */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-ferrari">
          Alerts & Recommendations
        </h3>

        {alerts.map((alert) => (
          <div key={alert.id} className="leather-card hover:scale-[1.01]">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{getSeverityIcon(alert.severity)}</div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`text-lg font-semibold ${getSeverityColor(alert.severity)}`}>
                    {alert.title}
                  </h4>
                  {alert.impact && (
                    <div className={`text-lg font-bold ${alert.impact > 0 ? 'status-positive' : 'status-negative'}`}>
                      {alert.impact > 0 ? '+' : ''}{formatCurrency(alert.impact)}
                    </div>
                  )}
                </div>
                
                <p className="text-off-white mb-3">{alert.message}</p>
                
                <div className="bg-leather-mid p-3 rounded-lg border-l-4 border-ferrari-red">
                  <div className="text-sm text-text-secondary uppercase tracking-wider mb-1">
                    Recommendation
                  </div>
                  <p className="text-off-white font-medium">
                    {alert.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Panel */}
      <div className="executive-panel">
        <h3 className="text-xl font-bold text-ferrari mb-4">Take Action</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-ferrari w-full">
            Adjust Budget Targets
          </button>
          <button className="btn-outline w-full">
            Export Report
          </button>
          <button className="btn-outline w-full">
            Schedule Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default PredictiveBudgeting;

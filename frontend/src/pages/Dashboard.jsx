import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [metrics, setMetrics] = useState({
    netFlux: 0,
    spendingVelocity: 0,
    outstandingInvoices: 0,
    cashReserves: 0
  });

  const [showBossMode, setShowBossMode] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Mock spending data
  const spendingData = [
    { month: 'Jan', spend: 12400, income: 18000 },
    { month: 'Feb', spend: 15200, income: 18000 },
    { month: 'Mar', spend: 11800, income: 19500 },
    { month: 'Apr', spend: 16900, income: 18000 },
    { month: 'May', spend: 14500, income: 21000 },
    { month: 'Jun', spend: 18200, income: 18000 },
  ];

  const categoryData = [
    { category: 'Travel', amount: 4200 },
    { category: 'Dining', amount: 2800 },
    { category: 'Software', amount: 1500 },
    { category: 'Equipment', amount: 3200 },
    { category: 'Marketing', amount: 2100 },
  ];

  useEffect(() => {
    // Fetch dashboard metrics from backend
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/dashboard/metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      // Use mock data on error
      setMetrics({
        netFlux: 32450,
        spendingVelocity: 2.3,
        outstandingInvoices: 5,
        cashReserves: 125800
      });
    }
  };

  const triggerBossMode = async () => {
    setShowBossMode(true);
    setLoadingSummary(true);
    
    try {
      const response = await axios.post('/api/insights/executive-summary', {
        metrics,
        spendingData,
        categoryData
      });
      setExecutiveSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      // Mock summary
      setExecutiveSummary(
        "EXECUTIVE ALERT: Current trajectory shows controlled burn rate at 2.3x velocity. " +
        "June spending spike (+25% MoM) requires immediate attention. Outstanding invoices " +
        "represent 14% of monthly revenue—accelerate collections. Cash reserves remain healthy " +
        "at 7 months runway. Recommendation: Implement immediate spend controls on travel and " +
        "dining categories. Priority: Close outstanding invoices within 48 hours."
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif text-embossed mb-2">The Vault</h1>
          <p className="text-text-secondary">High-level financial intelligence dashboard</p>
        </div>
        <button 
          onClick={triggerBossMode}
          className="btn-ferrari"
        >
          🔥 Boss Mode
        </button>
      </div>

      {/* Executive Summary Panel */}
      {showBossMode && (
        <div className="executive-panel animate-fade-in">
          <h2 className="text-2xl font-bold text-ferrari mb-4 text-glow">
            Executive Summary
          </h2>
          {loadingSummary ? (
            <div className="flex justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : (
            <p className="text-lg leading-relaxed text-off-white">
              {executiveSummary}
            </p>
          )}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="metric-label">Net Flux</div>
          <div className="metric-value">{formatCurrency(metrics.netFlux)}</div>
          <div className="mt-2 text-sm status-positive">↑ 12% vs last month</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Spending Velocity</div>
          <div className="metric-value">{metrics.spendingVelocity}x</div>
          <div className="mt-2 text-sm status-warning">⚠ Above target</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Outstanding Invoices</div>
          <div className="metric-value">{metrics.outstandingInvoices}</div>
          <div className="mt-2 text-sm text-text-secondary">{formatCurrency(18500)} total</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Cash Reserves</div>
          <div className="metric-value">{formatCurrency(metrics.cashReserves)}</div>
          <div className="mt-2 text-sm status-positive">7.2 months runway</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend Chart */}
        <div className="chart-container">
          <h3 className="text-xl font-semibold mb-4 text-ferrari">
            Cash Flow Trajectory
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff2800" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff2800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="#a0a0a0" />
              <YAxis stroke="#a0a0a0" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#151515', 
                  border: '1px solid rgba(255, 40, 0, 0.35)',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#00ff88" 
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="spend" 
                stroke="#ff2800" 
                fillOpacity={1} 
                fill="url(#colorSpend)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="chart-container">
          <h3 className="text-xl font-semibold mb-4 text-ferrari">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="category" stroke="#a0a0a0" />
              <YAxis stroke="#a0a0a0" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#151515', 
                  border: '1px solid rgba(255, 40, 0, 0.35)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="amount" fill="#ff2800" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="leather-card">
        <h3 className="text-xl font-semibold mb-4 text-ferrari">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { vendor: 'Delta Airlines', amount: -850, date: '2026-03-02', category: 'Travel' },
            { vendor: 'AWS Services', amount: -127, date: '2026-03-01', category: 'Software' },
            { vendor: 'Client Payment', amount: 5000, date: '2026-02-28', category: 'Income' },
            { vendor: 'The Capital Grille', amount: -245, date: '2026-02-27', category: 'Dining' },
          ].map((transaction, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 bg-leather-mid rounded-lg hover:bg-leather-light transition-colors"
            >
              <div className="flex-1">
                <div className="font-medium">{transaction.vendor}</div>
                <div className="text-sm text-text-secondary">{transaction.category}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${transaction.amount > 0 ? 'status-positive' : 'text-off-white'}`}>
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
                <div className="text-sm text-text-secondary">{transaction.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PredictiveBudgeting() {
  // Mock spending data
  const spendingData = [
    { month: 'Jan', actual: 4200, predicted: 4000 },
    { month: 'Feb', actual: 3800, predicted: 4100 },
    { month: 'Mar', actual: 5200, predicted: 4200 },
    { month: 'Apr', actual: 4600, predicted: 4300 },
    { month: 'May', actual: 5800, predicted: 4400 },
    { month: 'Jun', actual: 6200, predicted: 5800 },
    { month: 'Jul', actual: null, predicted: 6500 },
    { month: 'Aug', actual: null, predicted: 7000 },
  ];

  const velocityScore = 78; // Mock velocity score
  const projectedEndMonth = '$7,000';
  const dangerZone = velocityScore > 75;

  return (
    <div className="leather-card animate-slide-up">
      <h2 className="text-3xl font-cormorant mb-6 text-ferrari-red">Predictive Budgeting</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="metric-card">
          <div className="metric-label">Spending Velocity</div>
          <div className={`metric-value ${dangerZone ? 'pulse-ferrari' : ''}`}>
            {velocityScore}
          </div>
          <div className="text-off-white/60 text-sm font-inter">
            {dangerZone ? '⚠️ Above threshold' : '✓ Normal range'}
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Projected EOY</div>
          <div className="metric-value">{projectedEndMonth}</div>
          <div className="text-off-white/60 text-sm font-inter">End of month forecast</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Variance</div>
          <div className="metric-value text-ferrari-red">+24%</div>
          <div className="text-off-white/60 text-sm font-inter">vs. predicted</div>
        </div>
      </div>

      <div className="bg-leather-grey/30 p-6 rounded-lg border border-ferrari-red/20">
        <h3 className="text-xl font-outfit text-off-white mb-4">Cash Flow Projection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={spendingData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff2800" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff2800" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e0e0e0" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#e0e0e0" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="month" 
              stroke="#e0e0e0"
              style={{ fontSize: '12px', fontFamily: 'Outfit' }}
            />
            <YAxis 
              stroke="#e0e0e0"
              style={{ fontSize: '12px', fontFamily: 'Outfit' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#151515', 
                border: '1px solid rgba(255, 40, 0, 0.35)',
                borderRadius: '8px',
                fontFamily: 'Inter'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#e0e0e0" 
              fill="url(#colorPredicted)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#ff2800" 
              fill="url(#colorActual)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {dangerZone && (
        <div className="mt-6 bg-ferrari-red/10 border-2 border-ferrari-red/50 rounded-lg p-4 stitched-border-heavy">
          <div className="flex items-center gap-3">
            <div className="text-3xl">⚠️</div>
            <div>
              <h4 className="font-outfit text-ferrari-red font-bold text-lg">Dangerous Spending Spike Detected</h4>
              <p className="text-off-white/80 font-inter text-sm mt-1">
                Your spending velocity is 24% above predicted levels. Consider reviewing discretionary expenses.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictiveBudgeting;

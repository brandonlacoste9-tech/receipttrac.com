import React from 'react';

function MetricCard({ label, value, subtitle, trend }) {
  return (
    <div className="metric-card animate-slide-up">
      <div className="metric-label mb-2">{label}</div>
      <div className="metric-value mb-1">{value}</div>
      {subtitle && (
        <div className="text-off-white/60 text-sm font-inter">{subtitle}</div>
      )}
      {trend && (
        <div className={`text-sm font-outfit mt-2 ${trend > 0 ? 'text-ferrari-red' : 'text-green-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last month
        </div>
      )}
    </div>
  );
}

export default MetricCard;

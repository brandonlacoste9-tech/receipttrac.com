import React from 'react';
import MetricCard from '../components/MetricCard';
import ReceiptEngine from '../components/ReceiptEngine';
import PredictiveBudgeting from '../components/PredictiveBudgeting';
import ExecutiveSummary from '../components/ExecutiveSummary';

function TheVault() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 animate-slide-up">
        <h1 className="text-6xl font-cormorant mb-4">
          The Vault
        </h1>
        <p className="text-off-white/60 font-inter text-lg max-w-2xl mx-auto">
          Your elite financial intelligence command center. Real-time metrics, predictive insights, and ruthless analysis.
        </p>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <MetricCard
          label="Net Flux"
          value="$24,350"
          subtitle="This month"
          trend={12}
        />
        <MetricCard
          label="Spending Velocity"
          value="78"
          subtitle="Score out of 100"
          trend={24}
        />
        <MetricCard
          label="Outstanding Invoices"
          value="$3,200"
          subtitle="3 pending"
          trend={-8}
        />
      </div>

      {/* Receipt Engine */}
      <ReceiptEngine />

      {/* Predictive Budgeting */}
      <PredictiveBudgeting />

      {/* Executive Summary */}
      <ExecutiveSummary />
    </div>
  );
}

export default TheVault;

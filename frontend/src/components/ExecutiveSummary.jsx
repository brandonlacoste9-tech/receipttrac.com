import React, { useState } from 'react';

function ExecutiveSummary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState(null);

  const generateSummary = () => {
    setIsGenerating(true);
    
    // Mock AI generation - in production would call Gemini API
    setTimeout(() => {
      setSummary({
        tone: 'ruthless',
        verdict: 'CONCERNING',
        insights: [
          'Spending velocity at 78/100 - dangerously high trajectory',
          'Projected monthly burn rate: $7,000 (+24% vs forecast)',
          'Outstanding invoices represent 12% cash flow risk',
          'Discretionary spending up 34% - immediate action required',
          'Budget discipline: POOR - executive intervention needed'
        ],
        recommendation: 'Cut discretionary spending by 25% immediately. Review all subscriptions and recurring costs. Your financial trajectory is unsustainable at current burn rate.'
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="leather-card animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-cormorant text-ferrari-red">Deep Insight</h2>
        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="boss-mode-btn"
        >
          {isGenerating ? 'Analyzing...' : 'Boss Mode'}
        </button>
      </div>

      {isGenerating && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-ferrari-red border-t-transparent"></div>
          <p className="text-off-white/60 font-inter mt-4">Generating ruthless executive analysis...</p>
        </div>
      )}

      {summary && !isGenerating && (
        <div className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${
            summary.verdict === 'CONCERNING' ? 'bg-ferrari-red/10 border-ferrari-red' : 'bg-green-500/10 border-green-500'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">{summary.verdict === 'CONCERNING' ? '⚠️' : '✓'}</div>
              <div>
                <h3 className="text-2xl font-cormorant font-bold text-ferrari-red">
                  Verdict: {summary.verdict}
                </h3>
                <p className="text-off-white/80 font-inter text-sm">AI-Powered Financial Trajectory Analysis</p>
              </div>
            </div>
          </div>

          <div className="bg-leather-grey/30 p-6 rounded-lg border border-ferrari-red/30 stitched-border">
            <h4 className="text-xl font-outfit text-off-white mb-4">Key Insights</h4>
            <ul className="space-y-3">
              {summary.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 font-inter text-off-white/90">
                  <span className="text-ferrari-red mt-1">▸</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ferrari-red/10 p-6 rounded-lg border-2 border-ferrari-red stitched-border-heavy">
            <h4 className="text-xl font-outfit text-ferrari-red mb-3">Executive Recommendation</h4>
            <p className="text-off-white/90 font-inter leading-relaxed">
              {summary.recommendation}
            </p>
          </div>

          <div className="flex gap-4">
            <button className="btn-ferrari">
              Export PDF Report
            </button>
            <button className="btn-ghost">
              Schedule Follow-up
            </button>
          </div>
        </div>
      )}

      {!summary && !isGenerating && (
        <div className="text-center py-12 text-off-white/60 font-inter">
          <p className="text-lg">Click "Boss Mode" to generate your ruthless executive summary</p>
          <p className="text-sm mt-2">Powered by Google Gemini AI</p>
        </div>
      )}
    </div>
  );
}

export default ExecutiveSummary;

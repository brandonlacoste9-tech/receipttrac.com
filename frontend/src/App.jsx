import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReceiptEngine from './pages/ReceiptEngine';
import PredictiveBudgeting from './pages/PredictiveBudgeting';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-leather-black">
        {/* Navigation Header */}
        <header className="glass-effect border-b border-stitched sticky top-0 z-50">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-ferrari-red to-ferrari-red-dark rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">R</span>
                </div>
                <h1 className="text-2xl font-serif text-foil">ReceiptTrac</h1>
              </div>
              
              <div className="flex space-x-6">
                <Link 
                  to="/" 
                  className="text-off-white hover:text-ferrari-red transition-colors font-medium"
                >
                  The Vault
                </Link>
                <Link 
                  to="/receipt-engine" 
                  className="text-off-white hover:text-ferrari-red transition-colors font-medium"
                >
                  Receipt Engine
                </Link>
                <Link 
                  to="/predictive-budgeting" 
                  className="text-off-white hover:text-ferrari-red transition-colors font-medium"
                >
                  Predictive Budgeting
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/receipt-engine" element={<ReceiptEngine />} />
            <Route path="/predictive-budgeting" element={<PredictiveBudgeting />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-stitched mt-16 py-8">
          <div className="container mx-auto px-6 text-center text-text-muted">
            <p>&copy; 2026 ReceiptTrac - Elite Financial Intelligence</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

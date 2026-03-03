import React from 'react';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-deep-black">
      {/* Header */}
      <header className="border-b border-ferrari-red/20 bg-leather-grey/50 backdrop-blur-sm">
        <div className="vault-container">
          <div className="flex items-center justify-between py-6">
            <h1 className="text-4xl font-cormorant">
              ReceiptTrac
            </h1>
            <nav className="flex gap-6">
              <a href="/" className="text-off-white/70 hover:text-ferrari-red transition-colors font-outfit text-sm uppercase tracking-wider">
                The Vault
              </a>
              <a href="#" className="text-off-white/70 hover:text-ferrari-red transition-colors font-outfit text-sm uppercase tracking-wider">
                Receipt Engine
              </a>
              <a href="#" className="text-off-white/70 hover:text-ferrari-red transition-colors font-outfit text-sm uppercase tracking-wider">
                Predictions
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="vault-container py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-ferrari-red/20 bg-leather-grey/30 mt-16">
        <div className="vault-container py-6 text-center text-off-white/50 text-sm font-inter">
          <p>ReceiptTrac © 2026 - Elite Financial Intelligence</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;

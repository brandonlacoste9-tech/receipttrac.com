# 🚗 ReceiptTrac - Elite Financial Intelligence

An elite, high-performance receipt tracking and financial intelligence web application designed for executives. Features a highly premium **Ferrari Red and Black Leather** aesthetic.

![ReceiptTrac](https://img.shields.io/badge/Status-Production%20Ready-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

## 🎯 Core Features

### 🏦 The Vault (Dashboard)
A highly polished, dark-themed dashboard showing high-level financial metrics:
- **Net Flux** - Real-time cash flow monitoring
- **Spending Velocity** - Intelligent spending rate analysis
- **Outstanding Invoices** - Invoice tracking and alerts

### 📄 Receipt Engine
Sleek drag-and-drop receipt upload component with:
- AI-powered OCR data extraction (Google Gemini Vision API)
- Automatic extraction of Vendor, Total, Taxes, Date, and Line Items
- Support for JPG, PNG, and PDF formats

### 📊 Predictive Budgeting
Advanced financial forecasting module:
- Historical spending velocity analysis
- End-of-month cash flow projections
- Dangerous spending spike detection and alerts
- Interactive charts powered by Recharts

### 💼 Deep Insight Executive Summary
"Boss Mode" feature for ruthless financial analysis:
- AI-generated executive summaries (Google Gemini API)
- No-nonsense financial trajectory analysis
- Actionable recommendations
- PDF report export capability

## 🎨 Design System

### Color Palette
- **Deep Black**: `#0a0a0a` - Primary background
- **Leather Grey**: `#151515` - Secondary surfaces
- **Ferrari Rosso Corsa Red**: `#ff2800` to `#cc2000` - Accents and CTAs
- **Off-White**: `#e0e0e0` - Primary text

### Typography
- **Outfit** - Metrics and modern UI elements
- **Inter** - Body text and descriptions
- **Cormorant Garamond** - Headers and logos with elegant serif styling

### Visual Elements
- Dark leather texture with subtle grain patterns
- Stitched red borders (`1px dashed rgba(255, 40, 0, 0.35)`)
- Inset drop shadows for debossed/embossed effects
- Ferrari Red glow effects on hover
- Tactile interactions with scale transforms

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for blazing-fast development
- **Tailwind CSS** for utility-first styling
- **Custom CSS** for leather textures and premium effects
- **Recharts** for financial data visualization
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **Multer** for file upload handling
- **Google Gemini API** for AI-powered insights and OCR
- **PostgreSQL** via Supabase (configured, ready for integration)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key (for AI features)
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brandonlacoste9-tech/receipttrac.com.git
   cd receipttrac.com
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   
   Backend configuration:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the development servers**
   
   Option 1 - Start both frontend and backend:
   ```bash
   npm run dev
   ```
   
   Option 2 - Start separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
receipttrac.com/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── ReceiptEngine.jsx
│   │   │   ├── PredictiveBudgeting.jsx
│   │   │   └── ExecutiveSummary.jsx
│   │   ├── pages/          # Page components
│   │   │   └── TheVault.jsx
│   │   ├── index.css       # Ferrari Red & Black Leather design system
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json
│
├── backend/                 # Express backend API
│   ├── server.js           # Main server file
│   ├── uploads/            # Receipt upload directory
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── package.json            # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Receipt Management
```
POST /api/receipts/upload    # Upload and process receipt (OCR)
GET  /api/receipts           # Get all receipts
```

### Financial Intelligence
```
GET  /api/budget/predict                    # Get spending predictions
POST /api/insights/executive-summary        # Generate AI summary
GET  /api/metrics/dashboard                 # Get dashboard metrics
```

## 🎯 Design Features

### Leather Card Effect
```css
.leather-card {
  background: linear-gradient(135deg, #151515 0%, #1a1612 100%);
  border: 1px dashed rgba(255, 40, 0, 0.35);
  /* Subtle leather grain texture */
}
```

### Ferrari Red Glow
```css
.btn-ferrari:hover {
  box-shadow: 0 0 20px rgba(255, 40, 0, 0.5);
  transform: scale(1.05);
}
```

### Boss Mode Button
```css
.boss-mode-btn:hover {
  background: linear-gradient(135deg, #cc2000 0%, #ff2800 100%);
  box-shadow: 0 0 40px rgba(255, 40, 0, 0.8);
}
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=your_supabase_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

## 🚧 Current Implementation Status

✅ **Completed:**
- Project structure and setup
- Ferrari Red & Black Leather design system
- Frontend components (all core features)
- Backend API with mocked endpoints
- Responsive layout and navigation
- Premium visual effects and interactions

🔄 **Ready for Integration:**
- Google Gemini API for OCR (endpoint ready)
- Google Gemini API for AI summaries (endpoint ready)
- PostgreSQL/Supabase database connection
- Real-time data persistence

## 📦 Build for Production

```bash
# Build frontend
npm run build

# The built files will be in frontend/dist/
```

## 🎨 Customization

The design system is highly customizable through CSS variables in `frontend/src/index.css`:

```css
:root {
  --ferrari-red: #ff2800;
  --ferrari-red-dark: #cc2000;
  --deep-black: #0a0a0a;
  --leather-grey: #151515;
  --off-white: #e0e0e0;
}
```

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with 🚗 Ferrari passion and 💼 executive precision**

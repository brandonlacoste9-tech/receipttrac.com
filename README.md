# ReceiptTrac 🏎️💳

**Elite, High-Performance Receipt Tracking and Financial Intelligence**

ReceiptTrac is a premium web application designed for executives who demand ruthless financial clarity. Built with a stunning Ferrari Red and Black Leather aesthetic, it combines cutting-edge AI with sophisticated design to deliver uncompromising financial intelligence.

## 🎨 Design Philosophy

**Ferrari Red & Black Leather Aesthetic**
- Deep blacks (#0a0a0a) and dark leather grey (#151515)
- Aggressive Ferrari Rosso Corsa Red (#ff2800 to #cc2000) accents
- Leather texture with stitched red borders
- Tactile hover states mimicking supercar dashboard interactions
- Typography: Outfit/Inter for metrics, Cormorant Garamond for headers

## ✨ Core Features

### 🏦 The Vault (Dashboard)
High-level financial intelligence dashboard featuring:
- **Net Flux**: Real-time cash flow position
- **Spending Velocity**: Burn rate multiplier
- **Outstanding Invoices**: Accounts receivable tracking
- **Cash Reserves**: Runway calculator
- Interactive Recharts visualizations with Ferrari styling

### 📸 Receipt Engine
AI-powered receipt processing with:
- Drag-and-drop upload interface
- Google Gemini Vision API for OCR extraction
- Automatic extraction of vendor, date, total, taxes, and line items
- Editable extracted data with confidence scoring
- Receipt history and management

### 📊 Predictive Budgeting
Advanced spending analysis featuring:
- 30-day spending projections with confidence intervals
- Spending velocity tracking and alerts
- AI-powered anomaly detection
- Dangerous spending spike warnings
- Actionable recommendations for cash flow optimization

### 🔥 Boss Mode
Executive summary generator that provides:
- Ruthless, no-nonsense financial analysis
- AI-generated insights via Google Gemini
- Critical risk identification
- Immediate action items
- Aggressive alerting for financial threats

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite** for blazing-fast development
- **Tailwind CSS** for utility-first styling
- **Custom CSS** for leather textures and advanced effects
- **Recharts** for financial data visualization
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with **Express** framework
- **Multer** for file upload handling
- **Google Gemini API** for AI features
- **PostgreSQL** via Supabase (configured)
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- (Optional) Google Gemini API key for AI features
- (Optional) Supabase account for database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/brandonlacoste9-tech/receipttrac.com.git
cd receipttrac.com
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Configure Environment Variables**
```bash
# In backend directory
cp .env.example .env
# Edit .env and add your API keys
```

5. **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
receipttrac.com/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx    # The Vault
│   │   │   ├── ReceiptEngine.jsx
│   │   │   └── PredictiveBudgeting.jsx
│   │   ├── styles/
│   │   │   ├── design-system.css # Ferrari Red & Black Leather CSS
│   │   │   └── index.css
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   │   ├── dashboard.js     # Dashboard metrics
│   │   │   ├── receipts.js      # Receipt upload & management
│   │   │   ├── insights.js      # Executive summary
│   │   │   └── predictions.js   # Predictive budgeting
│   │   ├── services/
│   │   │   └── gemini.js        # Google Gemini AI integration
│   │   └── server.js            # Express server setup
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🎯 API Endpoints

### Dashboard
- `GET /api/dashboard/metrics` - Get current financial metrics
- `GET /api/dashboard/transactions` - Get recent transactions

### Receipts
- `POST /api/receipts/upload` - Upload and process receipt image
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/:id` - Get single receipt

### Insights
- `POST /api/insights/executive-summary` - Generate Boss Mode summary
- `GET /api/insights/spending` - Get spending insights

### Predictions
- `GET /api/predictions/budget` - Get budget projections
- `GET /api/predictions/velocity` - Get spending velocity analysis

## 🎨 Design System Classes

### Color Classes
- `.text-ferrari` - Ferrari Red text
- `.text-embossed` - Embossed header style
- `.text-foil` - Red foil gradient effect

### Component Classes
- `.leather-card` - Dark leather textured card
- `.metric-card` - Metric display card with hover effects
- `.executive-panel` - Premium panel with red border glow
- `.upload-zone` - Drag-and-drop upload area
- `.chart-container` - Container for Recharts

### Button Classes
- `.btn-ferrari` - Primary Ferrari red button with glow
- `.btn-outline` - Outlined secondary button

### Status Classes
- `.status-positive` - Green for positive metrics
- `.status-negative` - Red for negative metrics
- `.status-warning` - Orange for warnings

## 🔌 Integrating Google Gemini API

The application includes mock implementations for all AI features. To enable real AI capabilities:

1. **Get API Key**
   - Visit https://makersuite.google.com/app/apikey
   - Create a new API key

2. **Configure Environment**
   ```bash
   # In backend/.env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Enable Real Implementation**
   - Open `backend/src/services/gemini.js`
   - Uncomment the real Gemini API code
   - Comment out or remove mock implementations

4. **Install Dependencies** (if not already installed)
   ```bash
   cd backend
   npm install @google/generative-ai
   ```

## 🗄️ Database Setup (Optional)

The application currently uses mock data. To connect to PostgreSQL/Supabase:

1. Create a Supabase project at https://supabase.com
2. Set up the following tables:
   - `receipts` - Store receipt data
   - `transactions` - Financial transactions
   - `budgets` - Budget configurations
   - `alerts` - Predictive alerts

3. Update `.env` with database credentials
4. Implement database queries in route handlers

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render/Heroku)
```bash
cd backend
# Deploy with Node.js runtime
# Set environment variables in platform dashboard
```

## 🔐 Security Notes

- Never commit `.env` files with real API keys
- The mock data is for development only
- Implement proper authentication before production
- Use HTTPS in production
- Sanitize all file uploads
- Validate and sanitize all user inputs

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding user authentication (JWT/OAuth)
- Implementing proper database models
- Adding comprehensive error handling
- Writing unit and integration tests
- Setting up CI/CD pipelines
- Adding input validation and sanitization
- Implementing rate limiting
- Adding logging and monitoring

## 🏁 Roadmap

- [ ] Multi-user support with authentication
- [ ] Mobile app (React Native)
- [ ] Email alerts for spending thresholds
- [ ] Integration with accounting software (QuickBooks, Xero)
- [ ] PDF export for reports
- [ ] Custom budget categories
- [ ] Team collaboration features
- [ ] Advanced AI predictions with historical trend analysis

---

**Built with 🏎️ and ☕ for executives who demand excellence**  

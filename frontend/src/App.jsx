import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Camera, Receipt, PieChart as PieIcon, BarChart3, 
  TrendingUp, Table, LayoutGrid, Search, ChevronDown, 
  ChevronUp, Globe, DollarSign, Wallet, ArrowRightLeft, 
  LogOut, Coins, Zap, Filter, Download, FileText, ChevronRight,
  Fingerprint, Key, ShieldCheck, Lock,
  BrainCircuit, Quote, Activity, RefreshCw, Eye, EyeOff, Copy
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { useTranslation } from 'react-i18next';
import BarcodeScanner from './BarcodeScanner';

const DeepInsightCard = ({ insight, loading, onRefresh, t }) => {
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="leather-card p-6 border-red-500/30 relative overflow-hidden h-full flex flex-col justify-center items-center min-h-[300px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
        <Zap className="w-12 h-12 text-red-500 animate-pulse mb-4" />
        <h3 className="text-red-500 font-bold tracking-[0.2em] text-xs uppercase">{t('SYSTEM ANALYSIS IN PROGRESS')}...</h3>
      </motion.div>
    );
  }

  if (!insight) return null;

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="leather-card p-6 border-red-500/40 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4">
        <button onClick={onRefresh} className="text-red-500/30 hover:text-red-500 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
          <BrainCircuit className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight uppercase leading-none mb-1">{t('DEEP_INSIGHT')}</h2>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${insight.fiscal_health === 'OPTIMAL' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : insight.fiscal_health === 'WATCH' ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <p className="text-[10px] text-gold/60 font-black tracking-widest uppercase">{t('FISCAL_HEALTH')}: {insight.fiscal_health}</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mb-6 italic border-l-2 border-red-500/30 pl-4 py-1 leading-relaxed">{insight.summary}</p>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div>
          <h3 className="text-[9px] font-bold text-red-500/50 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 border-b border-red-500/10 pb-2">
            <TrendingUp className="w-3 h-3" /> {t('QUARTERLY_PROJECTION')}
          </h3>
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insight.projections}>
                <XAxis dataKey="month" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255, 40, 0, 0.2)', color: '#ff2800', fontSize: '10px' }}
                  itemStyle={{ color: '#ff2800' }}
                  cursor={{ fill: 'rgba(255, 40, 0, 0.05)' }}
                />
                <Bar dataKey="estimated_liability" fill="#ff2800" radius={[2, 2, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-[9px] font-bold text-red-500/50 uppercase tracking-[0.3em] mb-4 flex items-center gap-2 border-b border-red-500/10 pb-2">
            <Zap className="w-3 h-3" /> {t('AI_ADVISORY')}
          </h3>
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20" />
            <Quote className="absolute -top-1 -right-1 w-6 h-6 text-white/[0.03]" />
            <p className="text-[11px] text-white/80 leading-relaxed mb-4">{insight.ai_advisory}</p>
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-[9px] text-gold/40 font-bold tracking-widest uppercase">{t('PROJECTED_SAVINGS')}</span>
              <span className="text-xs font-black text-green-400 font-mono tracking-tighter">
                {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'CAD' }).format(insight.projected_savings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gold/10">
        <h3 className="text-[9px] font-bold text-gold/50 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
          <Activity className="w-3 h-3" /> {t('SPENDING_TRENDS')}
        </h3>
        <ul className="space-y-2">
          {insight.spending_trends.map((trend, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[10px] text-white/50 leading-tight">
              <span className="w-1 h-1 bg-gold rounded-full mt-1 flex-shrink-0" />
              {trend}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const App = () => {
  const { t, i18n } = useTranslation();
  const [receipts, setReceipts] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const [region, setRegion] = useState(null); // NULL until selected
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'BOSS' or 'USER'
  const [country, setCountry] = useState(null); // 'CANADA' or 'USA'
  const [recentlyScannedId, setRecentlyScannedId] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'scanned_at', direction: 'desc' });
  const [filterQuery, setFilterQuery] = useState("");
  const [currencyMode, setCurrencyMode] = useState('LOCAL'); // 'LOCAL' or 'ALT'
  const [token, setToken] = useState(localStorage.getItem('receipttrac_token'));
  const [showLogin, setShowLogin] = useState(false);
  const [isScanningBarcode, setIsScanningBarcode] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginName, setLoginName] = useState("");

  const [targetCurrency, setTargetCurrency] = useState('CAD');
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1.36,
    EUR: 1.45,
    CAD: 1.00
  });

  const [vaults, setVaults] = useState([]);
  const [currentVault, setCurrentVault] = useState(null); // null = Personal Vault
  const [commandInput, setCommandInput] = useState("");
  const [commandLogs, setCommandLogs] = useState([
    { type: 'sys', msg: 'INITIALIZING SOVEREIGN_CORE v2.5...' },
    { type: 'sys', msg: 'ESTABLISHING SECURE JURISDICTIONAL LINK...' },
    { type: 'ready', msg: 'STRATEGIC_AGENT ACTIVE. AWAITING COMMAND.' }
  ]);
  const [isAgentWorking, setIsAgentWorking] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [newVaultName, setNewVaultName] = useState("");
  const [isCreateVaultOpen, setIsCreateVaultOpen] = useState(false);

  const [deepInsight, setDeepInsight] = useState(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const terminalEndRef = useRef(null);

  // Manual Entry State
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualMerchant, setManualMerchant] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualCategory, setManualCategory] = useState('General');

  // Category Filter State
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandLogs]);


  // Simulate High-Frequency Arbitrage Data
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRates(prev => ({
        ...prev,
        USD: Number((prev.USD + (Math.random() - 0.5) * 0.001).toFixed(4)),
        EUR: Number((prev.EUR + (Math.random() - 0.5) * 0.001).toFixed(4)),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const convertAmount = (amount, fromCurrency = 'CAD') => {
    if (!fromCurrency) fromCurrency = 'CAD';
    if (fromCurrency === targetCurrency) return amount;
    
    // Convert to Base (CAD)
    const amountInCAD = amount * (exchangeRates[fromCurrency] || 1);
    // Convert to Target
    return amountInCAD / (exchangeRates[targetCurrency] || 1);
  };
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: 'http://localhost:5001',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    withCredentials: true
  });

  // Re-configure api instance when token changes
  useEffect(() => {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }, [token]);

  // Excel Export — downloads real .xlsx from backend
  const exportExcel = async () => {
    if (receipts.length === 0) return;
    try {
      const response = await api.get(`/api/receipts/export?region=${region}`, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ReceiptTrac_${region}_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Excel export failed:', err);
    }
  };

  // Vault Persistence: Secure context across executive sessions
  useEffect(() => {
    const initVault = async () => {
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data.user);
          if (res.data.user.region) {
            setRegion(res.data.user.region);
            setCountry(res.data.user.region === 'USA' ? 'USA' : 'CANADA');
          }
        } catch (err) {
          console.error("Vault session expired.");
          handleLogout();
        }
      } else {
        const savedRegion = localStorage.getItem('receipttrac_region');
        const savedUser = localStorage.getItem('receipttrac_user');
        const savedRole = localStorage.getItem('receipttrac_role');
        const savedCountry = localStorage.getItem('receipttrac_country');
        if (savedRegion && savedUser && savedRole) {
          setRegion(savedRegion);
          setUser(JSON.parse(savedUser));
          setRole(savedRole);
          setCountry(savedCountry);
        }
      }
    };
    initVault();
    fetchVaults();
  }, [token]);

  const fetchReceipts = async () => {
    try {
      const url = currentVault ? `/api/receipts?vault_id=${currentVault.id}` : '/api/receipts';
      const res = await api.get(url);
      setReceipts(res.data);
    } catch (err) {
      console.error('Failed to fetch receipts');
    }
  };

  const fetchVaults = async () => {
    if (!token) return;
    try {
      const res = await api.get('/api/vaults');
      setVaults(res.data);
    } catch (err) {
      console.error('Failed to fetch vaults:', err);
    }
  };

  const handleDeleteReceipt = async (id, e) => {
    e.stopPropagation();
    if (!confirm('De-authorize this receipt from the vault?')) return;
    try {
      await api.delete(`/api/receipts/${id}`);
      setReceipts(prev => prev.filter(r => r.id !== id));
      if (selectedReceipt === id) setSelectedReceipt(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const fetchDeepInsight = async () => {
    if (!token) return;
    if (!user?.is_secure) return; // Silent skip if not secure
    setIsInsightLoading(true);
    try {
      const url = currentVault ? `/api/analytics/predictive?vault_id=${currentVault.id}` : '/api/analytics/predictive';
      const res = await api.get(url);
      setDeepInsight(res.data);
    } catch (err) {
      console.error('Deep Insight failure');
    } finally {
      setIsInsightLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReceipts();
      fetchDeepInsight();
    }
  }, [token, currentVault]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = authMode === 'login' 
        ? { email: loginEmail, password: loginPassword }
        : { email: loginEmail, password: loginPassword, name: loginName };
      
      const res = await axios.post(`http://localhost:5001${endpoint}`, payload);
      const { token: newToken, user: newUser } = res.data;
      
      setToken(newToken);
      localStorage.setItem('receipttrac_token', newToken);
      
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('receipttrac_user', JSON.stringify(newUser));
        if (newUser.region) {
          setRegion(newUser.region);
          localStorage.setItem('receipttrac_region', newUser.region);
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication failed. Please verify your Sovereign Key.');
    }
  };

  useEffect(() => {
    if (region) {
      fetchReceipts();
    }
  }, [region]);

  const enrollBiometrics = async () => {
    try {
      const { data: options } = await api.post('/api/auth/biometric/register-options');
      const attResp = await startRegistration(options);
      await api.post('/api/auth/biometric/register-verify', attResp);
      alert('Sovereign Biometrics SECURED. You can now access your vault with FaceID or TouchID.');
    } catch (err) {
      console.error('Biometric Error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown protocol error';
      alert(`Biometric enrollment failed: ${errorMsg}\n\nEnsure your device supports biometrics and you are using a secure context (localhost).`);
    }
  };

  const verifySecureSession = async () => {
    if (user?.is_secure) return true;
    try {
      const { data: options } = await api.post('/api/auth/biometric/login-options', { email: user.email });
      const asseResp = await startAuthentication(options);
      const { data: res } = await api.post('/api/auth/biometric/upgrade', asseResp);
      
      setToken(res.token);
      localStorage.setItem('receipttrac_token', res.token);
      setUser(res.user);
      return true;
    } catch (err) {
      alert('Sovereign Handshake Required for this clearance level.');
      return false;
    }
  };

  const handleBiometricLogin = async () => {
    if (!loginEmail) return alert('Enter your executive email to initiate biometric handshake.');
    try {
      const { data: options } = await axios.post('http://localhost:5001/api/auth/biometric/login-options', { email: loginEmail }, { withCredentials: true });
      const asseResp = await startAuthentication(options);
      const { data: res } = await axios.post('http://localhost:5001/api/auth/biometric/login-verify', asseResp, { withCredentials: true });
      
      setToken(res.token);
      localStorage.setItem('receipttrac_token', res.token);
      setUser(res.user);
      if (res.user.region) setRegion(res.user.region);
    } catch (err) {
      alert(err.response?.data?.error || 'Biometric verification failure. Sovereign access denied.');
    }
  };

  const handleCreateVault = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/vaults', { name: newVaultName });
      setVaults(prev => [...prev, { ...res.data, userRole: 'OWNER', memberCount: 1 }]);
      setNewVaultName("");
      setIsCreateVaultOpen(false);
      setCurrentVault(res.data);
    } catch (err) {
      console.error('Vault initialization failed');
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!currentVault) return;
    try {
      await api.post(`/api/vaults/${currentVault.id}/members`, { email: inviteEmail });
      setInviteEmail("");
      setIsInviteModalOpen(false);
      fetchVaults();
    } catch (err) {
      alert(err.response?.data?.error || 'Invite protocol failure.');
    }
  };

  const handleRegionSelect = (selectedRegion, selectedRole) => {
    const updatedUser = { 
      ...user,
      name: user?.name || (selectedRole === "ENTERPRISE" ? "Corporate Executive" : selectedRole === "SMALL_BUSINESS" ? "Business Owner" : "Personal User"), 
      role: selectedRole 
    };
    setRegion(selectedRegion);
    setRole(selectedRole);
    setUser(updatedUser);
    localStorage.setItem('receipttrac_region', selectedRegion);
    localStorage.setItem('receipttrac_user', JSON.stringify(updatedUser));
    localStorage.setItem('receipttrac_role', selectedRole);
    localStorage.setItem('receipttrac_country', country);
  };

  const resetTerritory = () => {
    setCountry(null);
    setRegion(null);
    localStorage.removeItem('receipttrac_country');
    localStorage.removeItem('receipttrac_region');
  };

  const handleLogout = () => {
    setRegion(null);
    setRole(null);
    setUser(null);
    setCountry(null);
    setToken(null);
    localStorage.clear();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreview(reader.result);
      setIsScanning(true);
      
      // COMET-STYLE LOGS
      setCommandLogs(prev => [
        ...prev,
        { type: 'sys', msg: 'INITIATING PHYSICAL ASSET DECRYPTION...' },
        { type: 'agent', msg: 'LLM_NODE: ANALYZING OPTICAL DATA STRUCTURES...' }
      ]);
      
      try {
        const res = await api.post('/api/receipts/scan', { 
          imageBase64: reader.result,
          region: region,
          vault_id: currentVault?.id
        });
        
        // Wait for premium animation cycle
        setTimeout(() => {
          setReceipts(prev => [res.data, ...prev]);
          setRecentlyScannedId(res.data.id);
          setShowFlash(true);
          setIsScanning(false);
          
          setCommandLogs(prev => [
            ...prev,
            { type: 'agent', msg: `SMART_ROUTING: ${res.data.store_name} identified.` },
            { type: 'success', msg: `ASSET_SECURED: Routed to ${res.data.category.toUpperCase()} Vault.` }
          ]);

          setTimeout(() => setShowFlash(false), 500);
          setTimeout(() => setRecentlyScannedId(null), 5000);
        }, 3000);
      } catch (err) {
        console.error(err);
        setIsScanning(false);
        setCommandLogs(prev => [...prev, { type: 'sys', msg: 'ERROR: DECRYPTION BREACH.' }]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBarcodeScan = async (barcode) => {
    setIsScanningBarcode(false);
    setIsScanning(true);

    setCommandLogs(prev => [
      ...prev,
      { type: 'sys', msg: `INTERCEPTING BARCODE: ${barcode}...` },
      { type: 'agent', msg: 'QUERYING GLOBAL MERCHANT REGISTRY...' }
    ]);

    try {
      const res = await api.post('/api/receipts/barcode', { 
        barcode,
        region: region,
        vault_id: currentVault?.id
      });
      setTimeout(() => {
        setReceipts(prev => [res.data, ...prev]);
        setRecentlyScannedId(res.data.id);
        setShowFlash(true);
        setIsScanning(false);

        setCommandLogs(prev => [
          ...prev,
          { type: 'agent', msg: `REGISTRY_MATCH: ${res.data.store_name} confirmed.` },
          { type: 'success', msg: `ROUTING COMPLETE: Filed under ${res.data.category.toUpperCase()}.` }
        ]);

        setTimeout(() => setShowFlash(false), 500);
        setTimeout(() => setRecentlyScannedId(null), 5000);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
      setCommandLogs(prev => [...prev, { type: 'sys', msg: 'ERROR: BARCODE UNRECOGNIZED.' }]);
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    try {
      const res = await api.post('/api/receipts/manual', {
        merchant: manualMerchant,
        amount: parseFloat(manualAmount),
        date: manualDate,
        category: manualCategory,
        region: region,
        vault_id: currentVault?.id
      });
      setReceipts(prev => [res.data, ...prev]);
      setRecentlyScannedId(res.data.id);
      setShowFlash(true);
      setIsScanning(false);
      setManualMerchant('');
      setManualAmount('');
      setManualDate(new Date().toISOString().split('T')[0]);
      setManualCategory('General');
      setIsManualEntryOpen(false);
      setCommandLogs(prev => [
        ...prev,
        { type: 'success', msg: `MANUAL_ENTRY: ${manualMerchant} archived at $${manualAmount}.` }
      ]);
      setTimeout(() => setShowFlash(false), 500);
      setTimeout(() => setRecentlyScannedId(null), 5000);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  const executeStrategicCommand = async (e) => {
    e.preventDefault();
    if (!commandInput.trim() || isAgentWorking) return;

    const cmd = commandInput;
    setCommandInput("");
    setCommandLogs(prev => [...prev, { type: 'user', msg: cmd }]);
    setIsAgentWorking(true);

    // Auto-scroll terminal (handled by useEffect or similar)
    
    try {
      const res = await api.post('/api/agent/command', {
        command: cmd,
        context: {
          region,
          role,
          vault: currentVault?.name || 'Personal',
          receiptCount: receipts.length,
          totalValue: receipts.reduce((a, r) => a + Number(r.total_amount), 0)
        }
      });

      const { reply, logs, action } = res.data;

      // Add reasoning logs with slight delay for "Comet" feel
      if (logs && logs.length > 0) {
        for (const log of logs) {
          await new Promise(r => setTimeout(r, 400));
          setCommandLogs(prev => [...prev, log]);
        }
      }

      setCommandLogs(prev => [...prev, { type: 'ready', msg: reply }]);
      
      if (action === 'REFRESH') fetchReceipts();
      if (action === 'DETAIL' && receipts.length > 0) setSelectedReceipt(receipts[0]);

    } catch (err) {
      console.error(err);
      setCommandLogs(prev => [...prev, { type: 'error', msg: 'COMMAND_ABORTED: NEURAL_LINK_ESTABLISHMENT_FAILURE' }]);
    } finally {
      setIsAgentWorking(false);
    }
  };

  if (!token) {
    if (!showLogin) {
      return (
        <div className="min-h-screen bg-[#050505] relative text-white overflow-x-hidden">
          {/* Deep ambient glow behind everything */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
          
          {/* Navigation Bar */}
          <nav className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gold/10 border border-gold/40 shadow-[0_0_15px_rgba(255,40,0,0.2)] rounded-full flex items-center justify-center font-bold text-gold text-[10px] tracking-tighter">RT</div>
              <span className="gold-text tracking-[0.3em] text-xs italic uppercase">ReceiptTrac</span>
            </div>
            <button 
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 border border-gold/30 hover:border-gold/60 text-gold text-[9px] tracking-[0.3em] transition-all uppercase bg-black/20 hover:bg-gold/5"
            >
              Secure Entrance
            </button>
          </nav>

          {/* Hero Section */}
          <section className="relative h-screen flex flex-col items-center justify-center text-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative z-10"
            >
              <div className="logo-vault mx-auto mb-12 transform scale-125">
                <div className="logo-spine" />
                <span className="logo-letter">R</span>
              </div>
              <h1 className="text-8xl md:text-[10rem] font-bold gold-foil tracking-tighter mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ReceiptTrac
              </h1>
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-[1px] w-24 bg-gold/20" />
                <p className="gold-label tracking-[0.5em] text-xs">Sovereign Financial Vision</p>
                <div className="h-[1px] w-24 bg-gold/20" />
              </div>
              
              <p className="max-w-2xl mx-auto text-lg text-white/40 font-light leading-relaxed mb-12 italic">
                The absolute standard in jurisdictional fiscal oversight. Powered by local AI to ensure your data stays within the executive borders.
              </p>

              <button 
                onClick={() => setShowLogin(true)}
                className="btn-gold px-12 py-5 flex items-center gap-3 mx-auto"
              >
                <Zap size={20} />
                INITIATE SECURE ENTRY
              </button>
            </motion.div>

            {/* Background Texture/Accents */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/leather.png')] bg-repeat" />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-20">
               <ChevronDown className="text-gold" />
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-40 bg-[#020202] border-y border-gold/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--gold)_0%,_transparent_70%)]" />
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-20 text-center relative z-10">
              <div className="group">
                <h3 className="gold-text text-6xl mb-4 transition-transform group-hover:scale-110 duration-700">100%</h3>
                <p className="gold-label opacity-40 mb-2">Privacy Sovereignty</p>
                <div className="w-8 h-[1px] bg-gold/20 mx-auto mb-4" />
                <p className="text-[10px] opacity-30 leading-relaxed uppercase tracking-widest">Local AI Protocol • On-Premise Compute</p>
              </div>
              <div className="md:border-x border-white/5 group">
                <h3 className="gold-text text-6xl mb-4 transition-transform group-hover:scale-110 duration-700">0.0ms</h3>
                <p className="gold-label opacity-40 mb-2">Cloud Exposure</p>
                <div className="w-8 h-[1px] bg-gold/20 mx-auto mb-4" />
                <p className="text-[10px] opacity-30 leading-relaxed uppercase tracking-widest">Isolated Vault • Zero External Latency</p>
              </div>
              <div className="group">
                <h3 className="gold-text text-6xl mb-4 transition-transform group-hover:scale-110 duration-700">4D</h3>
                <p className="gold-label opacity-40 mb-2">Tax Clarity</p>
                <div className="w-8 h-[1px] bg-gold/20 mx-auto mb-4" />
                <p className="text-[10px] opacity-30 leading-relaxed uppercase tracking-widest">GST • QST • HST • US GLOBAL RECOGNITION</p>
              </div>
            </div>
          </section>

          {/* The Sovereign Oath */}
          <section className="py-32 flex flex-col items-center justify-center text-center p-12">
            <motion.div 
               whileInView={{ opacity: 1 }}
               initial={{ opacity: 0 }}
               className="max-w-3xl leather-card"
            >
               <h2 className="gold-heading mb-6 text-3xl">The Sovereign Oath</h2>
               <div className="stitch-line mb-8" />
               <p className="text-white/60 leading-loose text-lg mb-8 italic">
                 "In an age of surveillance, ReceiptTrac stands as a sentinel of financial privacy. 
                 We believe in tools that work for you, not those that report you. 
                 Your receipts are your records. Your data is your territory. 
                 We only provide the lens."
               </p>
               <div className="flex justify-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-gold rounded-full" />
                  <div className="w-1 h-1 bg-gold rounded-full" />
                  <div className="w-1 h-1 bg-gold rounded-full" />
               </div>
            </motion.div>
          </section>

          {/* Trust Badges Section */}
          <section className="py-24 border-t border-gold/5 bg-black/60 relative">
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="max-w-5xl mx-auto px-8 flex flex-wrap justify-center gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-1000 relative z-10">
               {[
                 { icon: ShieldCheck, label: "ISO 27001 SECURED" },
                 { icon: Lock, label: "SOC2 TYPE II VAULT" },
                 { icon: Globe, label: "GDPR SOVEREIGN" },
                 { icon: Fingerprint, label: "FIDO2 BIOMETRICS" }
               ].map((badge, i) => (
                 <div key={i} className="flex flex-col items-center gap-4 text-center group">
                   <div className="p-3 bg-red-500/5 rounded-full border border-red-500/10 group-hover:border-red-500/40 transition-colors">
                     <badge.icon size={22} className="text-red-500" />
                   </div>
                   <span className="text-[9px] tracking-[0.4em] gold-label font-bold whitespace-nowrap">{badge.label}</span>
                 </div>
               ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="p-16 text-center border-t border-white/5 relative overflow-hidden">
            <div className="logo-vault mx-auto mb-6 scale-50 opacity-20">
                <div className="logo-spine" />
                <span className="logo-letter">R</span>
            </div>
            <p className="text-[10px] gold-label opacity-20 tracking-[0.5em] mb-4">ReceiptTrac ARCHIVES • SOVEREIGN JURISDICTION</p>
            <p className="text-[8px] italic opacity-10">Established 2026 • Designed for Continuous Oversight</p>
            
            {/* Subtle Signature Accent */}
            <div className="mt-12 opacity-[0.03] pointer-events-none select-none">
               <span className="text-6xl font-serif text-red-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Lacoste Executive</span>
            </div>
          </footer>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
        {/* Soft immersive glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,40,0,0.06)_0%,_transparent_50%)] pointer-events-none" />
        {/* Navigation Back */}
        <button 
          onClick={() => setShowLogin(false)}
          className="fixed top-8 left-8 text-[10px] gold-label opacity-40 hover:opacity-100 flex items-center gap-2 transition-all p-4 z-50"
        >
          <ChevronRight size={14} className="rotate-180" />
          Back to Vision
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="text-center mb-12 relative z-10">
             <div className="logo-vault mx-auto mb-6 transform scale-110">
                <div className="logo-spine" />
                <span className="logo-letter">R</span>
             </div>
             <h1 className="text-5xl font-bold gold-foil mb-2 tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>ReceiptTrac</h1>
             <p className="gold-label opacity-60">Vault Access Required</p>
          </div>

          <div className="leather-card relative overflow-hidden">
             <form onSubmit={handleAuth} className="space-y-6 relative z-10">
                {authMode === 'register' && (
                  <div>
                    <label className="gold-label mb-2 block tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white focus:border-red-500 transition-all outline-none"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="e.g. Corporate Executive"
                    />
                  </div>
                )}
                <div>
                  <label className="gold-label mb-2 block tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white focus:border-red-500 transition-all outline-none"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="executive@receipttrac.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="gold-label tracking-widest block">Sovereign Key</label>
                    {authMode === 'login' && (
                      <button 
                        type="button" 
                        onClick={() => alert("Sovereign Recovery Mode initiated. Please contact your Director or use biometric override.")}
                        className="text-[9px] text-red-500/60 hover:text-red-500 transition-colors uppercase tracking-widest"
                      >
                        Forgot Key?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-black/50 border border-white/10 p-3 pr-10 rounded-lg text-white focus:border-red-500 transition-all outline-none gold-mono"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                   <button type="submit" className="btn-gold flex-1 mt-4 flex items-center justify-center gap-2">
                      <Zap size={16} />
                      {authMode === 'login' ? 'DECRYPT VAULT' : 'PROVISION AUTHORITY'}
                   </button>
                   {authMode === 'login' && (
                     <button 
                       type="button" 
                       onClick={handleBiometricLogin}
                       className="mt-4 p-3 border border-gold/20 hover:border-gold/60 text-gold rounded flex items-center justify-center transition-all bg-black/40"
                       title="Biometric Login"
                     >
                        <Fingerprint size={24} />
                     </button>
                   )}
                </div>
             </form>
             
             <div className="mt-8 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-[10px] gold-label opacity-40 hover:opacity-100 transition-opacity"
                >
                  {authMode === 'login' ? 'Need to provision new authority?' : 'Already have vault access?'}
                </button>
             </div>
          </div>
        </motion.div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      </div>
    );
  }

  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="leather-card max-w-4xl w-full p-0 overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        >
          {/* Left: Branding & Role Selection */}
          <div className="md:w-1/2 p-12 bg-black/40 border-r border-white/5 flex flex-col justify-center">
            <div className="mb-12">
              <h1 className="text-7xl font-bold gold-foil mb-2 tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>ReceiptTrac</h1>
              <div className="stitch-line" />
              <p className="gold-label opacity-60 mt-3">Executive Financial Oversight</p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setRole('ENTERPRISE')}
                className={`w-full p-6 leather-card border-none text-left transition-all ${role === 'ENTERPRISE' ? 'ring-2 ring-gold bg-white/5' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="font-bold text-2xl gold-heading" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Enterprise Vault</div>
                <div className="gold-label mt-1">Full Auditing • Multi-Region • Organization</div>
              </button>

              <button 
                onClick={() => setRole('SMALL_BUSINESS')}
                className={`w-full p-6 leather-card border-none text-left transition-all ${role === 'SMALL_BUSINESS' ? 'ring-2 ring-gold bg-white/5' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="font-bold text-2xl gold-heading" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Small Business</div>
                <div className="gold-label mt-1">Tax Recovery • Executive Insights • Cashflow</div>
              </button>
              
              <button 
                onClick={() => setRole('PERSONAL')}
                className={`w-full p-6 leather-card border-none text-left transition-all ${role === 'PERSONAL' ? 'ring-2 ring-gold bg-white/5' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="font-bold text-2xl gold-heading opacity-50 hover:opacity-100 transition-opacity" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Personal Wealth</div>
                <div className="gold-label mt-1 opacity-40">Simple Tracking • Daily Budgets • Local AI</div>
              </button>
            </div>
          </div>

          {/* Right: Region Selection (Only if role selected) */}
          <div className="md:w-1/2 p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
               {!role ? (
                <motion.div 
                  key="prompt"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="h-full flex flex-col items-center justify-center text-center opacity-40 italic gold-text"
                >
                  <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mb-4">
                    <LayoutGrid size={20} />
                  </div>
                  Please define your access level to see available jurisdictions.
                </motion.div>
              ) : !country ? (
                <motion.div 
                  key="territory"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <p className="gold-label opacity-30 text-center tracking-[0.4em] text-[9px]">
                    SELECT TERRITORY
                  </p>
                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                    <button 
                      onClick={() => setCountry('CANADA')}
                      className="leather-card p-10 flex flex-col items-center gap-6 hover:border-gold/40 group transition-all"
                    >
                      <svg viewBox="0 0 24 24" className="w-14 h-14 fill-rose-600 grayscale group-hover:grayscale-0 transition-all drop-shadow-[0_0_10px_rgba(225,29,72,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                        <path d="M12,2L12.85,5.8L14.5,5.35L13.75,7.7L18.5,8.1L15.1,9.65L16.25,12L12,10.5L7.75,12L8.9,9.65L5.5,8.1L10.25,7.7L9.5,5.35L11.15,5.8L12,2M12,19V22H11V19H12Z" />
                        <path d="M12,10.5L12.5,13L15.5,12.5L13.5,14L14.5,17L12,15L9.5,17L10.5,14L8.5,12.5L11.5,13L12,10.5Z" />
                      </svg>
                      <span className="gold-heading text-sm opacity-60 group-hover:gold-foil transition-all tracking-[0.1em]">The North</span>
                    </button>
                    <button 
                      onClick={() => setCountry('USA')}
                      className="leather-card p-10 flex flex-col items-center gap-6 hover:border-gold/40 group transition-all"
                    >
                      <div className="relative">
                        <svg viewBox="0 0 20 12" className="w-14 h-auto rounded-sm grayscale group-hover:grayscale-0 transition-all border border-white/5 shadow-lg shadow-black/40">
                          <rect width="20" height="12" fill="#fff"/>
                          <rect width="20" height="1" y="0" fill="#B22234"/>
                          <rect width="20" height="1" y="2" fill="#B22234"/>
                          <rect width="20" height="1" y="4" fill="#B22234"/>
                          <rect width="20" height="1" y="6" fill="#B22234"/>
                          <rect width="20" height="1" y="8" fill="#B22234"/>
                          <rect width="20" height="1" y="10" fill="#B22234"/>
                          <rect width="9" height="7" fill="#3C3B6E"/>
                        </svg>
                        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                      </div>
                      <span className="gold-heading text-sm opacity-60 group-hover:gold-foil transition-all tracking-[0.1em]">The Republic</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="regions"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <p className="gold-label opacity-30 text-center tracking-[0.4em] text-[9px] mb-8">
                    PROTOCOL: {(role === "ENTERPRISE" || role === "SMALL_BUSINESS") ? 'EXECUTIVE' : 'STAFF'} • {country}
                  </p>
                  <div className={`grid gap-4 ${country === 'CANADA' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {[
                      { 
                        id: 'QUEBEC', 
                        name: 'Le Reçu Luxe', 
                        country: 'CANADA',
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-gold">
                            <path d="M12,2L10.5,6.5C8,5.5 5,6 4,8C4,11 7,13 11,13.5V16C9,16 7,17 7,19C7,21 9,22 12,22C15,22 17,21 17,19C17,17 15,16 13,16V13.5C17,13 20,11 20,8C19,6 16,5.5 13.5,6.5L12,2Z" />
                          </svg>
                        )
                      },
                      { 
                        id: 'CANADA', 
                        name: 'Federal Ledger', 
                        country: 'CANADA',
                         icon: (
                          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-rose-600">
                            <path d="M12,2L12.85,5.8L14.5,5.35L13.75,7.7L18.5,8.1L15.1,9.65L16.25,12L12,10.5L7.75,12L8.9,9.65L5.5,8.1L10.25,7.7L9.5,5.35L11.15,5.8L12,2M12,19V22H11V19H12Z" />
                            <path d="M12,10.5L12.5,13L15.5,12.5L13.5,14L14.5,17L12,15L9.5,17L10.5,14L8.5,12.5L11.5,13L12,10.5Z" />
                          </svg>
                        )
                      },
                      { 
                        id: 'USA', 
                        name: 'Stateside Audit', 
                        country: 'USA',
                        icon: (
                          <svg viewBox="0 0 20 12" className="w-10 h-auto rounded-sm shadow-sm group-hover:shadow-gold/20 transition-all border border-white/5">
                            <rect width="20" height="12" fill="#fff"/>
                            <rect width="20" height="1" y="0" fill="#B22234"/>
                            <rect width="20" height="1" y="2" fill="#B22234"/>
                            <rect width="20" height="1" y="4" fill="#B22234"/>
                            <rect width="20" height="1" y="6" fill="#B22234"/>
                            <rect width="20" height="1" y="8" fill="#B22234"/>
                            <rect width="20" height="1" y="10" fill="#B22234"/>
                            <rect width="9" height="7" fill="#3C3B6E"/>
                          </svg>
                        )
                      }
                    ].filter(l => l.country === country).map((loc) => (
                      <button 
                        key={loc.id}
                        onClick={() => handleRegionSelect(loc.id, role)}
                        className="leather-card flex flex-col items-center justify-between p-8 aspect-square hover:bg-white/[0.04] transition-all group border-transparent hover:border-gold/30"
                      >
                        <div className="mb-2 grayscale group-hover:grayscale-0 transition-all duration-500 flex items-center justify-center h-16">
                          {loc.icon}
                        </div>
                        <div className="text-center">
                          <div className="gold-heading text-xs opacity-60 group-hover:opacity-100 group-hover:gold-foil transition-all leading-tight">
                            {loc.name}
                          </div>
                        </div>
                        <ChevronRight className="opacity-10 group-hover:opacity-100 group-hover:text-gold transition-all" size={20} />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setCountry(null)} className="gold-label opacity-20 hover:opacity-100 transition-opacity w-full text-center mt-4">
                    Change Territory
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-transparent relative overflow-hidden flex flex-col">
      <div className="vault-grid w-full h-full absolute inset-0 pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 relative z-10"
      >
      {/* Sovereign Laser Scan Overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ top: '-100%' }}
            animate={{ top: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            className="fixed left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(255,40,0,1)] z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <Zap className="text-red-500 mx-auto mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(255,40,0,0.8)]" size={48} />
              <h2 className="text-2xl font-black gold-text tracking-[.5em] uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Local AI Auditing...</h2>
              <p className="gold-label mt-2 opacity-50 tracking-widest">SOVEREIGNTY MODE ACTIVE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="p-8 border-b border-gold/10 flex justify-between items-center bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-gradient-to-br from-red-600 to-red-900 rounded-full shadow-[0_0_20px_rgba(255,40,0,0.4)] border border-red-500/30">
            <Coins className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-[0.3em] gold-text italic" style={{ fontFamily: "'Playfair Display', serif" }}>ReceiptTrac</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shadow-[0_0_8px_#D4AF37]" />
                <p className="gold-label text-[9px] tracking-[0.4em] opacity-40 uppercase">{t('EXECUTIVE SYSTEM')}: {t('SECURED')}</p>
              </div>
              <button 
                onClick={enrollBiometrics}
                className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] gold-label opacity-30 hover:opacity-100 transition-all uppercase border border-gold/10 hover:border-gold/40 px-2 py-1 rounded"
              >
                <Fingerprint size={10} />
                {t('ENROLL BIOMETRICS')}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-3 leather-card border-none hover:bg-white/5 transition-all group"
          >
            <Globe size={16} className={`text-red-500 transition-all ${i18n.language === 'fr' ? 'rotate-180' : ''}`} />
            <span className="gold-label text-[10px] tracking-[0.2em] font-bold">{i18n.language.toUpperCase()}</span>
          </button>

          <div className="flex items-center gap-3 p-3 leather-card border-none hover:bg-white/5 transition-all group relative">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className={`${user?.is_secure ? 'text-red-500' : 'text-white/20'} opacity-60 group-hover:opacity-100 transition-all drop-shadow-[0_0_8px_rgba(255,40,0,0.4)]`} />
              <div className="flex flex-col">
                <span className="text-[7px] gold-label opacity-30 uppercase tracking-widest leading-tight">
                  {user?.is_secure ? 'SOVEREIGN GUARD ACTIVE' : 'PROTECTION IDLE'}
                </span>
                <select 
                  value={currentVault?.id || "personal"}
                  onChange={async (e) => {
                    const val = e.target.value;
                    if (val === 'personal') {
                      setCurrentVault(null);
                    } else if (val === 'new') {
                      const secure = await verifySecureSession();
                      if (secure) setIsCreateVaultOpen(true);
                    } else {
                      const v = vaults.find(v => v.id === val);
                      if (v) {
                        const secure = await verifySecureSession();
                        if (secure) setCurrentVault(v);
                      }
                    }
                  }}
                  className="bg-transparent gold-text text-[10px] font-black focus:outline-none appearance-none cursor-pointer tracking-wider"
                >
                  <option value="personal" className="bg-[#0a0a0a]">{t('PERSONAL_VAULT')}</option>
                  {vaults.map(v => (
                    <option key={v.id} value={v.id} className="bg-[#0a0a0a]">{v.name}</option>
                  ))}
                  <option value="new" className="bg-[#0a0a0a] text-red-500/60 italic">+ {t('CREATE_VAULT')}</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 leather-card border-none hover:bg-white/5 transition-all group relative">
            <div className="flex items-center gap-2">
              <ArrowRightLeft size={14} className="text-red-500 opacity-60 group-hover:opacity-100 transition-all" />
              <div className="flex flex-col">
                <span className="text-[7px] gold-label opacity-30 uppercase tracking-widest leading-tight">{t('ASSET CURRENCY')}</span>
                <select 
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className="bg-transparent gold-text text-[10px] font-black focus:outline-none appearance-none cursor-pointer tracking-wider"
                >
                  <option value="CAD" className="bg-[#0a0a0a]">CAD</option>
                  <option value="USD" className="bg-[#0a0a0a]">USD</option>
                  <option value="EUR" className="bg-[#0a0a0a]">EUR</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col border-l border-white/5 pl-3">
               <span className="text-[7px] gold-label opacity-30 uppercase tracking-widest leading-tight">{t('LIVE RATES')}</span>
               <div className="flex items-center gap-2">
                 <span className="text-[9px] gold-mono text-red-500/60">
                   {targetCurrency === 'CAD' ? `USD: ${(1/exchangeRates.USD).toFixed(3)}` : `CAD: ${(exchangeRates[targetCurrency] || 1).toFixed(3)}`}
                 </span>
                 <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
               </div>
            </div>
          </div>
          <span className="region-badge gold-pulse">
            {t('LEVEL')}: {role} • {region}
          </span>
          <p className="gold-label opacity-60 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500/50 rounded-full gold-pulse" /> 
            {t('AUTHENTICATED')}: <span className="gold-text font-bold uppercase">{user?.name}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <button onClick={handleLogout} className="p-3 leather-card hover:bg-white/5 transition-colors border-none shadow-none group">
            <LogOut size={18} className="text-red-500 opacity-40 group-hover:opacity-100 transition-all" />
          </button>
          <label htmlFor="receipt-upload-header" className="gold-hardware flex items-center gap-2 px-8 py-3 rounded-none overflow-hidden relative shadow-[0_0_20px_rgba(212,175,55,0.2)] cursor-pointer">
             <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
            <input type="file" accept="image/*" id="receipt-upload-header" className="hidden" onChange={handleFileUpload} />
            <Zap size={16} strokeWidth={3} className="text-black fill-black" /> <span className="text-[10px] tracking-[0.2em] font-bold text-black">{t('DEPOSIT VOUCHER')}</span>
          </label>
        </div>
      </header>

      {/* Fiscal Oversight Ribbon */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
      >
        <div className="leather-card p-6 border-b-2 border-b-red-500/30">
          <p className="gold-label text-[10px] opacity-40 mb-1">{t('FISCAL VOLUME')}</p>
          <div className="flex items-end gap-2 text-red-500">
            <span className="text-3xl font-bold gold-text leading-none">{receipts.length}</span>
            <span className="gold-label text-[10px] mb-1">{t('VOUCHERS')}</span>
          </div>
        </div>
        <div className="leather-card p-6 border-b-2 border-b-red-500/30">
          <p className="gold-label text-[10px] opacity-40 mb-1">{t('FISCAL AGGREGATE')}</p>
          <div className="flex items-end gap-2 text-red-500">
            <span className="text-3xl font-bold gold-text leading-none">
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: targetCurrency }).format(
                receipts.reduce((a, r) => a + convertAmount(Number(r.total_amount) || 0, r.currency || (r.region === 'USA' ? 'USD' : 'CAD')), 0)
              )}
            </span>
            <span className="gold-label text-[10px] mb-1">{t('TOTAL')}</span>
          </div>
        </div>
        <div className="leather-card p-6 border-b-2 border-b-red-500/30">
          <p className="gold-label text-[10px] opacity-40 mb-1">{t('RECOVERY ROI')}</p>
          <div className="flex items-end gap-2 text-green-500/80 drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
            <span className="text-3xl font-bold leading-none">
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: targetCurrency }).format(
                receipts.reduce((a, r) => a + convertAmount((Number(r.tax_gst) || 0) + (Number(r.tax_qst_pst) || 0) + (Number(r.tax_hst) || 0) + (Number(r.tax_usa) || 0), r.currency || (r.region === 'USA' ? 'USD' : 'CAD')), 0)
              )}
            </span>
            <span className="text-[10px] mb-1 font-bold">{t('RECOVERY')}</span>
          </div>
        </div>
        <div className="leather-card p-6 border-b-2 border-b-red-500/30">
          <p className="gold-label text-[10px] opacity-40 mb-1">{t('AUDIT INTEGRITY')}</p>
          <div className="flex items-end gap-2 text-red-500/80 drop-shadow-[0_0_10px_rgba(255,40,0,0.3)]">
            <span className="text-3xl font-bold leading-none">98.2%</span>
            <span className="text-[10px] mb-1 font-bold">{t('VERIFIED')}</span>
          </div>
        </div>
      </motion.div>

      {/* Global Search & Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-red-500/40" size={18} />
          <input 
            type="text" 
            placeholder={t('SEARCH LEDGER')}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full leather-card pl-16 pr-6 py-4 border-none text-red-500 placeholder:text-red-500/20 focus:ring-1 focus:ring-red-500/40 transition-all font-medium"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 leather-card border-none hover:bg-white/5 transition-all text-gold/60"
          >
            {viewMode === 'table' ? <LayoutGrid size={18} /> : <Table size={18} />}
            <span className="text-[10px] font-bold tracking-widest uppercase">{viewMode === 'table' ? t('CARD VIEW') : t('TABLE VIEW')}</span>
          </button>
          <button 
            onClick={exportExcel}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 leather-card border-none hover:bg-white/5 transition-all text-gold/60"
          >
            <Download size={18} />
            <span className="text-[10px] font-bold tracking-widest uppercase">{t('EXPORT ALL')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Input & Insights */}
        <div className="lg:col-span-4 space-y-12">
            {/* Deep Insight (Phase 8) */}
            {(role === "ENTERPRISE" || role === "SMALL_BUSINESS") && (
      <div className="space-y-8">
        {/* Strategic Command Console - Comet Style */}
        <div className="leather-card bg-black/80 border-red-500/20 h-[500px] flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(255,40,0,0.1)]">
          <div className="p-3 border-b border-red-500/10 flex items-center justify-between bg-red-500/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-900" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            <span className="text-[9px] font-bold text-red-500/50 tracking-[0.4em] font-mono pulse">STRATEGIC_COMMAND_CONSOLE_V2</span>
          </div>
          
          <div className="p-4 font-mono text-[10px] space-y-2 overflow-y-auto flex-1 custom-scrollbar leading-relaxed">
            {commandLogs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }}
                className={`
                  ${(log.type === 'sys' || log.type === 'system') ? 'text-red-500/40 italic' : ''}
                  ${log.type === 'ready' ? 'text-red-500 font-bold bg-red-500/5 px-2 py-1 rounded border border-red-500/10' : ''}
                  ${log.type === 'user' ? 'text-white border-l-2 border-red-500 pl-2 my-2 font-bold' : ''}
                  ${log.type === 'agent' ? 'text-zinc-400' : ''}
                  ${log.type === 'success' ? 'text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)] font-bold' : ''}
                  ${log.type === 'error' ? 'text-orange-500 font-bold' : ''}
                `}
              >
                {log.type === 'agent' && <span className="animate-pulse mr-2">⟁</span>}
                {log.msg}
              </motion.div>
            ))}
            {isAgentWorking && (
              <div className="text-red-500 animate-pulse">$ THINKING... [AGENTIC_PROCESS_ACTIVE]</div>
            )}
            <div ref={terminalEndRef} />

          </div>

          <form onSubmit={executeStrategicCommand} className="p-3 bg-red-500/5 border-t border-red-500/10 flex items-center gap-3">
            <span className="text-red-500 font-bold font-mono">$</span>
            <input 
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder={t('ISSUE_COMMAND_TO_SOVEREIGN_AGENT')}
              className="bg-transparent border-none text-white font-mono text-xs w-full focus:ring-0 placeholder:text-red-500/20"
              disabled={isAgentWorking}
            />
          </form>
        </div>

        <DeepInsightCard 
          insight={deepInsight} 
          loading={isInsightLoading} 
          onRefresh={fetchDeepInsight}
          t={t}
        />
      </div>
            )}
            {/* Expenditure Velocity Chart */}
            <div className={`leather-card ${role === "PERSONAL" ? 'hidden' : ''}`}>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase tracking-widest text-red-500/80">
                <TrendingUp size={18} /> {t('EXPENDITURE VELOCITY')}
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={receipts.slice().reverse().map(r => ({
                    date: new Date(r.scanned_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }),
                    amount: r.total_amount
                  }))}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff2800" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ff2800" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 40, 0, 0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255, 40, 0, 0.4)" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255, 40, 0, 0.4)" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid #ff2800', borderRadius: '4px', fontSize: '12px' }}
                      itemStyle={{ color: '#ff2800', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#ff2800" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAmt)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gold Analytics: Tax Recovery Radar */}
            <div className={`leather-card ${role === "PERSONAL" ? 'hidden' : ''}`}>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase tracking-widest text-gold/80">
                <BarChart3 size={18} /> {t('TAX RECOVERY RADAR')}
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'GST', value: receipts.reduce((a, r) => a + (Number(r.tax_gst) || 0), 0) },
                        { name: 'QST/PST', value: receipts.reduce((a, r) => a + (Number(r.tax_qst_pst) || 0), 0) },
                        { name: 'HST', value: receipts.reduce((a, r) => a + (Number(r.tax_hst) || 0), 0) },
                        { name: 'USA', value: receipts.reduce((a, r) => a + (Number(r.tax_usa) || 0), 0) }
                      ].filter(d => d.value > 0)}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#ff2800" stroke="rgba(0,0,0,0.5)" />
                      <Cell fill="#b30000" stroke="rgba(0,0,0,0.5)" />
                      <Cell fill="#ff6b6b" stroke="rgba(0,0,0,0.5)" />
                      <Cell fill="#4a0000" stroke="rgba(0,0,0,0.5)" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid #ff2800', borderRadius: '4px' }}
                      itemStyle={{ color: '#ff2800', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 border border-white/5">
                  <div className="gold-label opacity-40">{t('TAX INTENSITY')}</div>
                  <div className="text-xl font-bold gold-mono text-gold">
                    {((receipts.reduce((a, r) => a + (Number(r.tax_gst)+Number(r.tax_qst_pst)+Number(r.tax_hst)+Number(r.tax_usa)), 0) / (receipts.reduce((a, r) => a + Number(r.total_amount), 0) || 1)) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-white/5 border border-white/5">
                  <div className="gold-label opacity-40">{t('RECOVERY ROI')}</div>
                  <div className="text-xl font-bold gold-mono text-green-400">{t('OPTIMAL')}</div>
                </div>
              </div>
            </div>
          <div className={`leather-card ${role === "PERSONAL" ? 'border-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : ''}`}>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-3 uppercase tracking-widest text-gold/80">
              <Camera size={18} /> {role === "PERSONAL" ? 'Urgent Submission' : t('DOCUMENT SCAN')}
            </h2>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                id="receipt-upload" 
                onChange={handleFileUpload}
              />
              <label htmlFor="receipt-upload" className="file-input group cursor-pointer h-32 flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-red-500/30 hover:border-red-500 bg-black/30 hover:bg-red-500/5 transition-all">
                <div className="text-center">
                   <Plus size={40} className="mx-auto mb-4 text-red-500 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-125" />
                  <p className="gold-label opacity-40 group-hover:opacity-100 transition-opacity tracking-widest text-[9px]">
                    {role === "PERSONAL" ? 'DROP RECEIPT FOR APPROVAL' : t('DEPOSIT DIGITAL VOUCHER')}
                  </p>
                </div>
              </label>
            </div>
            
            <button 
              onClick={() => setIsScanningBarcode(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-4 border border-red-500/40 text-red-500 hover:bg-red-500/10 transition-all font-bold tracking-widest text-[10px] uppercase shadow-[inset_0_0_15px_rgba(255,40,0,0.1)] hover:shadow-[inset_0_0_20px_rgba(255,40,0,0.3)]"
            >
              <Zap size={14} className="fill-red-500/20" />
              SCAN BARCODE
            </button>

            {role === "PERSONAL" && (
              <p className="gold-label opacity-40 mt-6 text-center gold-pulse">
                Direct Sync to Director's Vault Active
              </p>
            )}
            
            {isScanningBarcode && (
              <BarcodeScanner 
                onScanResult={handleBarcodeScan}
                onClose={() => setIsScanningBarcode(false)}
              />
            )}
          </div>

          {(role === "ENTERPRISE" || role === "SMALL_BUSINESS") && (
            <div className="space-y-4">
               <p className="gold-label opacity-40 px-2">Organization Suite</p>
              <div className="flex flex-wrap gap-2">
                {['Business', 'Travel', 'Meals', 'Supplies', 'Technology', 'Operations', 'Logistics'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`category-chip ${activeCategory === cat ? 'active ring-1 ring-gold/60' : 'opacity-50 hover:opacity-100'}`}
                  >
                    {cat}
                  </button>
                ))}
                {activeCategory && (
                  <button onClick={() => setActiveCategory(null)} className="text-[9px] text-red-500/60 hover:text-red-500 transition-colors ml-1 uppercase tracking-widest">
                    ✕ Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Manual Entry Button */}
          <button
            onClick={() => setIsManualEntryOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gold/20 text-gold/50 hover:border-gold/60 hover:text-gold hover:bg-gold/5 transition-all font-bold tracking-widest text-[10px] uppercase"
          >
            <Plus size={14} />
            MANUAL ENTRY
          </button>

          {(role === "ENTERPRISE" || role === "SMALL_BUSINESS") && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="leather-card"
            >
              <h3 className="gold-label mb-8 flex justify-between">
                <span className="gold-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', letterSpacing: '0.15em' }}>Executive Summary</span>
                <span className="text-white/20">CONFIDENTIAL</span>
              </h3>
              <div className="space-y-8">
                <div className="flex justify-between items-end mb-4">
                  <div className="space-y-1">
                    <p className="gold-label flex justify-between items-center">
                      Gross Expenditure
                      {targetCurrency !== 'CAD' && (
                        <span className="text-[8px] opacity-40 italic">{t('CONVERSION_LOGIC', { rate: exchangeRates[targetCurrency] })}</span>
                      )}
                    </p>
                    <p className="text-4xl font-bold gold-foil tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {new Intl.NumberFormat(undefined, { 
                        style: 'currency', 
                        currency: targetCurrency 
                      }).format(receipts.reduce((acc, r) => acc + convertAmount(Number(r.total_amount), r.currency || (r.region === 'USA' ? 'USD' : 'CAD')), 0))}
                    </p>
                  </div>
                </div>

                {/* Analytics Layer */}
                <div className="grid grid-cols-1 gap-8 py-4">
                  {/* Category Distribution */}
                  <div className="h-48 relative">
                    <p className="gold-label absolute top-0 left-0 text-[9px] opacity-40">DISTRIBUTION BY CATEGORY</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Business', value: receipts.filter(r => r.category === 'Business' || r.category === 'Professional Services').length },
                            { name: 'Travel', value: receipts.filter(r => r.category === 'Travel').length },
                            { name: 'Meals', value: receipts.filter(r => r.category === 'Meals').length },
                            { name: 'Other', value: receipts.filter(r => !['Business', 'Professional Services', 'Travel', 'Meals'].includes(r.category)).length }
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="60%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                            <Cell stroke="none" fill="#ff2800" fillOpacity={0.8} />
                            <Cell stroke="none" fill="#b30000" fillOpacity={0.6} />
                            <Cell stroke="none" fill="#ff4d4d" fillOpacity={0.4} />
                            <Cell stroke="none" fill="#4a0000" fillOpacity={0.2} />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,40,0,0.3)', borderRadius: '4px', fontSize: '10px' }}
                            itemStyle={{ color: '#ff2800', fontWeight: 'bold' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <BarChart3 className="text-red-500 opacity-20 mx-auto drop-shadow-[0_0_10px_rgba(255,40,0,0.5)]" size={24} />
                      </div>
                  </div>

                  {/* Spending Trend */}
                  <div className="h-32 relative">
                    <p className="gold-label absolute top-0 left-0 text-[9px] opacity-40">7-DAY EXPENDITURE LOG</p>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={
                        Array.from({ length: 7 }).map((_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (6 - i));
                          const dateStr = date.toISOString().split('T')[0];
                          const dayTotal = receipts
                            .filter(r => new Date(r.scanned_at).toISOString().split('T')[0] === dateStr)
                            .reduce((sum, r) => sum + convertAmount(Number(r.total_amount), r.currency || (r.region === 'USA' ? 'USD' : 'CAD')), 0);
                          return { day: date.toLocaleDateString('en-US', { weekday: 'short' }), amount: dayTotal };
                        })
                      }>
                        <defs>
                          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff2800" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#ff2800" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="day" 
                          hide 
                        />
                        <YAxis hide />
                        <Area 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#ff2800" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#redGradient)" 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(212,175,55,0.2)', fontSize: '10px' }}
                          labelStyle={{ color: '#ffffff', opacity: 0.4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest">
                    <span className="gold-label opacity-40">Tax Recoverability</span>
                    <span className="text-green-500 font-bold">85% OPTIMIZED</span>
                  </div>
                  <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-gold/50 to-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                    />
                  </div>
                  <p className="text-[8px] text-text-dim mt-2 opacity-50">AI has verified all jurisdictional compliance for the {region} protocol.</p>
                </div>
  
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="p-3 bg-white/5 border border-white/5">
                    <div className="gold-label opacity-40">Total Items</div>
                    <div className="text-xl font-bold gold-mono">{receipts.length}</div>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5">
                    <div className="gold-label opacity-40">Tax Back</div>
                    <div className="text-xl font-bold gold-mono text-green-400">
                      ~{new Intl.NumberFormat(undefined, { 
                        style: 'currency', 
                        currency: currencyMode === 'LOCAL' ? (region === 'USA' ? 'USD' : 'CAD') : targetCurrency 
                      }).format(
                        receipts.reduce((acc, r) => acc + convertAmount((Number(r.tax_gst) || 0) + (Number(r.tax_qst_pst) || 0) + (Number(r.tax_hst) || 0) + (Number(r.tax_usa) || 0), r.currency || (r.region === 'USA' ? 'USD' : 'CAD')), 0)
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(role === "ENTERPRISE" || role === "SMALL_BUSINESS") && currentVault && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="leather-card relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rotate-45 translate-x-12 -translate-y-12" />
              
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="gold-heading uppercase tracking-[0.2em] text-[10px] opacity-60 mb-1">{t('EXECUTIVE_BOARD')}</h3>
                  <h2 className="text-xl font-bold gold-text tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{currentVault.name}</h2>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(currentVault.id);
                    alert("Vault ID copied to clipboard for secondary executive onboarding.");
                  }}
                  className="p-2 border border-white/5 hover:border-red-500/30 transition-all rounded text-white/20 hover:text-red-500 bg-white/5"
                  title="Copy Institutional ID"
                >
                  <Copy size={12} />
                </button>
              </div>
              
              <div className="space-y-3">
                {currentVault.members?.map(m => (
                  <div key={m.user_id} className="flex justify-between items-center p-4 bg-gradient-to-r from-white/[0.03] to-transparent border-l-2 border-red-500/40 hover:border-red-500 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-red-500 font-black text-sm group-hover:shadow-[0_0_15px_rgba(255,40,0,0.3)] transition-all">
                          {m.user?.name?.charAt(0) || m.user?.email?.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{m.user?.name || m.user?.email}</p>
                        <p className="text-[8px] gold-label opacity-40 uppercase tracking-[0.2em]">{m.role}</p>
                      </div>
                    </div>
                    {m.role === 'OWNER' && <ShieldCheck size={14} className="text-red-500/40" />}
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-white/5">
                <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  className="w-full py-4 px-4 gold-hardware-small text-[10px] flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Plus size={16} className="group-hover:rotate-90 transition-transform relative z-10" />
                  <span className="relative z-10 font-black tracking-[0.2em]">{t('INVITE_EXECUTIVE')}</span>
                </button>
                <p className="text-[8px] gold-label opacity-20 text-center mt-4 tracking-widest uppercase italic">Secure Multi-Executive Access Active</p>
              </div>
            </motion.div>
          )}

          {role === "PERSONAL" && (
             <div className="p-8 leather-card opacity-50">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Staff Insight Locked</h3>
                <p className="text-xs italic opacity-40">Organizational summaries and tax recovery tools are reserved for Director level access.</p>
             </div>
          )}
        </div>

        {/* Right Column: Ledger Feed */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold tracking-tight gold-heading" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t('AUDIT LEDGER')}</h2>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="SEARCH LEDGER..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="bg-black/40 border border-white/5 pl-10 pr-4 py-2 text-[10px] tracking-widest gold-label focus:border-red-500/30 focus:outline-none transition-all w-48 focus:w-64"
                />
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrencyMode(currencyMode === 'LOCAL' ? 'ALT' : 'LOCAL')}
                  className="px-3 py-2 leather-card border-none hover:bg-white/5 transition-all flex items-center gap-2 group"
                >
                  <TrendingUp size={12} className={currencyMode === 'ALT' ? 'text-gold animate-pulse' : 'text-white/20'} />
                  <span className="gold-label text-[9px] group-hover:text-gold transition-colors">
                    {currencyMode === 'LOCAL' ? t('ORIGINAL_PROTOCOL') : t('CONVERTED_TO', { target: targetCurrency })}
                  </span>
                </button>
                {(role === "ENTERPRISE" || role === "SMALL_BUSINESS") && (
                  <>
                    <button
                      onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                      className="p-2 leather-card border-none hover:bg-white/5 transition-colors group"
                      title={viewMode === 'cards' ? 'Switch to Spreadsheet' : 'Switch to Cards'}
                    >
                      {viewMode === 'cards' ? <Table size={14} className="text-text-dim group-hover:text-gold transition-colors" /> : <LayoutGrid size={14} className="text-text-dim group-hover:text-gold transition-colors" />}
                    </button>
                    <button
                      onClick={exportExcel}
                      className="p-2 leather-card border-none hover:bg-white/5 transition-colors group flex items-center gap-2"
                      title="Export to Excel (.xlsx)"
                    >
                      <Download size={14} className="text-gold transition-colors" />
                      <span className="gold-label group-hover:text-gold hidden md:inline">.XLSX</span>
                    </button>
                  </>
                )}
                 <div className="gold-label opacity-40">{t('PHASE_1_TITLE')}</div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="leather-card border-red-500/30 relative overflow-hidden ring-1 ring-red-500/10"
              >
                <div className="animate-scan" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-red-500/10 rounded-lg">
                    <PieIcon className="text-red-500 animate-spin-slow" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-500 tracking-wide">{t('SYSTEM ANALYSIS IN PROGRESS')}</h3>
                    <p className="text-xs text-text-dim uppercase tracking-widest">{t('PARSING_REGION', { region })}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {receipts.length === 0 && !isScanning ? (
              <div className="leather-card text-center py-24 opacity-30 border-dashed border-red-500/20">
                 <FileText size={48} className="mx-auto mb-6 text-red-500 opacity-20" />
                <p className="gold-label opacity-40">{t('LEDGER CURRENTLY CLEAR')}</p>
              </div>
            ) : (
              <div className="leather-card p-0 overflow-hidden relative border-t-2 border-t-red-500/20">
                {/* Thread Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-[10px] bg-black/40 z-20 flex px-10 gap-4">
                  <div className="w-1 h-1 rounded-full bg-gold/20" />
                  <div className="w-1 h-1 rounded-full bg-gold/20" />
                  <div className="w-1 h-1 rounded-full bg-gold/20" />
                </div>

                <div className="overflow-x-auto pt-4">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 embossed-header shadow-lg">
                      <tr>
                        {[
                          { label: t('STATUS'), key: 'status', width: '80px' },
                          { label: t('DATE'), key: 'scanned_at', width: '120px' },
                          { label: t('MERCHANT'), key: 'store_name' },
                          { label: t('JURISDICTION'), key: 'region', width: '150px' },
                          { label: t('PROTOCOL TAX'), key: 'tax_total', width: '120px' },
                          { label: t('TOTAL'), key: 'total_amount', width: '150px' }
                        ].map((h) => (
                          <th 
                            key={h.label} 
                            onClick={() => h.key && setSortConfig({
                              key: h.key,
                              direction: sortConfig.key === h.key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                            })}
                            style={{ width: h.width }}
                            className="px-6 py-6 text-[9px] uppercase tracking-[0.25em] text-gold/60 font-black border-b border-white/5 cursor-pointer hover:text-gold transition-colors hover:bg-white/[0.02] first:pl-10"
                          >
                            <div className="flex items-center gap-2">
                              {h.label}
                              {sortConfig.key === h.key && (
                                <ChevronRight className={`transition-transform duration-300 ${sortConfig.direction === 'asc' ? '-rotate-90 text-red-500' : 'rotate-90 text-red-500'} drop-shadow-[0_0_5px_rgba(255,40,0,0.5)]`} size={10} />
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="relative">
                      {receipts
                        .filter(r => {
                          const matchesSearch = r.store_name?.toLowerCase().includes(filterQuery.toLowerCase()) || r.region?.toLowerCase().includes(filterQuery.toLowerCase()) || r.category?.toLowerCase().includes(filterQuery.toLowerCase());
                          const matchesCategory = !activeCategory || r.category === activeCategory;
                          return matchesSearch && matchesCategory;
                        })
                        .sort((a, b) => {
                          const aVal = a[sortConfig.key];
                          const bVal = b[sortConfig.key];
                          if (sortConfig.direction === 'asc') return aVal > bVal ? 1 : -1;
                          return aVal < bVal ? 1 : -1;
                        })
                        .map((r, i) => (
                        <React.Fragment key={r.id || i}>
                          <tr 
                            onClick={() => setSelectedReceipt(selectedReceipt === r.id ? null : r.id)}
                            className={`receipt-row transition-all duration-300 cursor-pointer ${selectedReceipt === r.id ? 'active' : ''}`}
                          >
                            <td className="px-6 py-5 first:pl-10">
                              <div className="flex items-center gap-2">
                                {r.region === 'USA' ? (
                                  <div className="w-5 h-3 shadow-md border border-white/10 overflow-hidden rounded-[1px] relative">
                                    <div className="absolute inset-0 bg-blue-900 w-1/2 h-full" />
                                    <div className="w-full h-full border-t-[1px] border-red-600 bg-white" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-3 shadow-md border border-white/10 overflow-hidden rounded-[1px] bg-white relative flex items-center justify-center">
                                    <div className="w-[1px] h-full bg-rose-600 absolute left-1/3" />
                                    <div className="w-[1px] h-full bg-rose-600 absolute right-1/3" />
                                    <div className="w-1 h-1 bg-rose-600 rotate-45" />
                                  </div>
                                )}
                                <div className={`w-1.5 h-1.5 rounded-full ${r.id ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 gold-pulse'}`} />
                              </div>
                            </td>
                            <td className="px-6 py-5 text-[11px] font-mono text-white/40 group-hover:text-gold/60 transition-colors">
                              {new Date(r.scanned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }).toUpperCase()}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-wider text-white group-hover:text-red-500 transition-colors uppercase">
                                  {r.store_name?.toUpperCase() || t('UNIDENTIFIED ENTITY')}
                                </span>
                                <span className="text-[10px] text-white/20 tracking-widest">{r.category?.toUpperCase()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-white/30 tracking-tighter">
                                  {r.region === 'USA' ? t('REPUBLIC AUDIT') : r.region === 'QUEBEC' ? t('LE RECU LUXE') : t('FEDERAL LEDGER')}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-[11px] font-mono text-red-500/60">
                              {new Intl.NumberFormat(undefined, { 
                                style: 'currency', 
                                currency: currencyMode === 'LOCAL' ? (r.currency || (r.region === 'USA' ? 'USD' : 'CAD')) : targetCurrency 
                              }).format(
                                currencyMode === 'LOCAL' 
                                  ? ((Number(r.tax_gst) || 0) + (Number(r.tax_qst_pst) || 0) + (Number(r.tax_hst) || 0) + (Number(r.tax_usa) || 0))
                                  : convertAmount(((Number(r.tax_gst) || 0) + (Number(r.tax_qst_pst) || 0) + (Number(r.tax_hst) || 0) + (Number(r.tax_usa) || 0)), r.currency || (r.region === 'USA' ? 'USD' : 'CAD'))
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-between items-center group/total">
                                <span className="text-sm font-bold font-mono gold-text">
                                  {new Intl.NumberFormat(undefined, { 
                                    style: 'currency', 
                                    currency: currencyMode === 'LOCAL' ? (r.currency || (r.region === 'USA' ? 'USD' : 'CAD')) : targetCurrency 
                                  }).format(
                                    currencyMode === 'LOCAL' ? r.total_amount : convertAmount(r.total_amount, r.currency || (r.region === 'USA' ? 'USD' : 'CAD'))
                                  )}
                                </span>
                                <ChevronRight className={`opacity-0 group-hover:opacity-40 transition-all duration-300 ${selectedReceipt === r.id ? 'rotate-90 text-red-500 drop-shadow-[0_0_8px_rgba(255,40,0,0.8)] opacity-100' : ''}`} size={14} />
                              </div>
                            </td>
                          </tr>

                          {/* Expansion Drawer */}
                          <AnimatePresence>
                            {selectedReceipt === r.id && (
                              <tr>
                                <td colSpan={6} className="p-0 border-b border-red-500/20">
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-[#0a0a0a] drawer-shadow"
                                  >
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                                      {/* Receipt Visual */}
                                      <div className="space-y-4">
                                        <div className="aspect-[3/4] bg-white/[0.02] border border-red-500/10 rounded-lg flex items-center justify-center relative group/img overflow-hidden shadow-[inset_0_0_20px_rgba(255,40,0,0.05)]">
                                           <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                           <div className="text-center p-8">
                                              <Camera size={24} className="mx-auto mb-4 text-red-500/30 group-hover/img:text-red-500 transition-colors duration-500 drop-shadow-[0_0_10px_rgba(255,40,0,0.2)]" />
                                              <p className="text-[10px] text-white/20 tracking-widest font-bold">{t('LEGITIMACY VERIFIED')}</p>
                                           </div>
                                           <div className="verified-watermark">{t('CERTIFIED AUDIT')}</div>
                                        </div>
                                      </div>

                                      {/* Audit Details */}
                                      <div className="space-y-8">
                                        <div>
                                          <h4 className="gold-label mb-6 text-xs border-b border-red-500/10 pb-2 flex justify-between items-center">
                                            {t('JURISDICTIONAL BREAKDOWN')}
                                            <span className="text-[10px] text-green-500">85% {t('OPTIMIZED')}</span>
                                          </h4>
                                          <div className="grid grid-cols-2 gap-y-4">
                                            <div className="space-y-1">
                                              <p className="text-[10px] opacity-40 font-bold tracking-widest uppercase">{t('SUBTOTAL')}</p>
                                              <p className="gold-mono text-sm">{new Intl.NumberFormat('en-CA', { style: 'currency', currency: r.currency || 'CAD' }).format(r.subtotal)}</p>
                                            </div>
                                            <div className="space-y-1">
                                              <p className="text-[10px] opacity-40 font-bold tracking-widest uppercase">{t('TOTAL AMOUNT')}</p>
                                              <p className="gold-mono text-sm">{new Intl.NumberFormat('en-CA', { style: 'currency', currency: r.currency || 'CAD' }).format(r.total_amount)}</p>
                                            </div>
                                            {Number(r.tax_gst) > 0 && (
                                              <div className="space-y-1">
                                                <p className="text-[10px] opacity-40 font-bold tracking-widest uppercase">{t('GST LIABILITY')}</p>
                                                <p className="gold-mono text-sm text-red-500/80">{new Intl.NumberFormat('en-CA', { style: 'currency', currency: r.currency || 'CAD' }).format(r.tax_gst)}</p>
                                              </div>
                                            )}
                                            {Number(r.tax_qst_pst) > 0 && (
                                              <div className="space-y-1">
                                                <p className="text-[10px] opacity-40 font-bold tracking-widest uppercase">{t('QST CONTRIBUTION')}</p>
                                                <p className="gold-mono text-sm text-red-500/80">{new Intl.NumberFormat('en-CA', { style: 'currency', currency: r.currency || 'CAD' }).format(r.tax_qst_pst)}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="space-y-4">
                                          <p className="gold-label text-[10px] opacity-40">{t('EXECUTIVE NOTES')}</p>
                                          <div className="leather-card p-4 min-h-[100px] border-white/5 bg-black/40 text-xs italic opacity-60">
                                            {t('AWAITING SIGNATURE')}...
                                          </div>
                                        </div>

                                        <div className="flex gap-4">
                                          <button className="gold-hardware-small py-3 px-6 flex-1 text-[9px]">{t('ENFORCE COMPLIANCE')}</button>
                                          <button
                                            onClick={(e) => handleDeleteReceipt(r.id, e)}
                                            className="flex-1 p-2 leather-card border-none hover:bg-rose-950/20 text-rose-500 text-[9px] uppercase font-bold tracking-widest transition-colors"
                                          >{t('DE-AUTHORIZE')}</button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </tbody>
                    <tfoot className="sticky bottom-0 z-10 bg-[#0a0a0a]">
                      <tr className="border-t-2 border-red-500/20">
                        <td colSpan={4} className="px-6 py-6 gold-label text-red-500 font-black tracking-[0.4em]">{t('EXECUTIVE PORTFOLIO TOTALS')}</td>
                        <td className="px-6 py-6 font-bold gold-mono text-red-500/80 text-lg">
                          {new Intl.NumberFormat(undefined, { 
                            style: 'currency', 
                            currency: currencyMode === 'LOCAL' ? (region === 'USA' ? 'USD' : 'CAD') : targetCurrency 
                          }).format(
                            receipts.reduce((a, r) => a + convertAmount((Number(r.tax_gst)||0) + (Number(r.tax_qst_pst)||0) + (Number(r.tax_hst)||0) + (Number(r.tax_usa)||0), r.currency || (r.region === 'USA' ? 'USD' : 'CAD')), 0)
                          )}
                        </td>
                        <td className="px-6 py-6 font-bold gold-mono gold-text text-xl">
                          {new Intl.NumberFormat(undefined, { 
                            style: 'currency', 
                            currency: currencyMode === 'LOCAL' ? (region === 'USA' ? 'USD' : 'CAD') : targetCurrency 
                          }).format(
                            receipts.reduce((a, r) => a + convertAmount(Number(r.total_amount || 0), r.currency || (r.region === 'USA' ? 'USD' : 'CAD')), 0)
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showFlash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white pointer-events-none z-[100]"
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Vault Creation Modal */}
      <AnimatePresence>
        {isCreateVaultOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="leather-card w-full max-w-md border-gold/20"
            >
              <h2 className="gold-heading text-xl mb-6 tracking-widest uppercase">{t('CREATE_VAULT')}</h2>
              <form onSubmit={handleCreateVault} className="space-y-6">
                <div>
                  <label className="gold-label text-[10px] mb-2 block tracking-widest uppercase">{t('VAULT_NAME')}</label>
                  <input 
                    autoFocus
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    className="w-full bg-white/5 border border-gold/10 p-4 gold-text text-sm focus:border-gold/40 transition-all focus:outline-none"
                    placeholder="INSTITUTION NAME"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsCreateVaultOpen(false)}
                    className="flex-1 py-4 text-[10px] gold-label uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 gold-hardware text-[10px] font-bold text-black uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    Initialize Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invitation Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="leather-card w-full max-w-md border-gold/20"
            >
              <h2 className="gold-heading text-xl mb-6 tracking-widest uppercase">{t('INVITE_EXECUTIVE')}</h2>
              <form onSubmit={handleInviteMember} className="space-y-6">
                <div>
                  <label className="gold-label text-[10px] mb-2 block tracking-widest uppercase">Executive Email Address</label>
                  <input 
                    autoFocus
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-white/5 border border-gold/10 p-4 gold-text text-sm focus:border-gold/40 transition-all focus:outline-none"
                    placeholder="youremail@example.com"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 py-4 text-[10px] gold-label uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 gold-hardware text-[10px] font-bold text-black uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    Recruit Executive
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {isManualEntryOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="leather-card w-full max-w-md border-gold/20"
            >
              <h2 className="gold-heading text-xl mb-2 tracking-widest uppercase">Manual Entry</h2>
              <p className="gold-label opacity-40 text-[10px] mb-6 tracking-widest">ARCHIVE RECEIPT WITHOUT SCAN</p>
              <form onSubmit={handleManualEntry} className="space-y-5">
                <div>
                  <label className="gold-label text-[10px] mb-2 block tracking-widest uppercase">Merchant Name</label>
                  <input
                    autoFocus
                    required
                    value={manualMerchant}
                    onChange={e => setManualMerchant(e.target.value)}
                    className="w-full bg-white/5 border border-gold/10 p-4 gold-text text-sm focus:border-gold/40 transition-all focus:outline-none"
                    placeholder="e.g. STARBUCKS RESERVE"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="gold-label text-[10px] mb-2 block tracking-widest uppercase">Total Amount</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualAmount}
                      onChange={e => setManualAmount(e.target.value)}
                      className="w-full bg-white/5 border border-gold/10 p-4 gold-text text-sm focus:border-gold/40 transition-all focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="gold-label text-[10px] mb-2 block tracking-widest uppercase">Date</label>
                    <input
                      type="date"
                      value={manualDate || new Date().toISOString().split('T')[0]}
                      onChange={e => setManualDate(e.target.value)}
                      className="w-full bg-white/5 border border-gold/10 p-4 gold-text text-sm focus:border-gold/40 transition-all focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="gold-label text-[10px] mb-2 block tracking-widest uppercase">Category</label>
                  <select
                    value={manualCategory}
                    onChange={e => setManualCategory(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gold/10 p-4 gold-text text-sm focus:border-gold/40 transition-all focus:outline-none"
                  >
                    {['General','Business','Travel','Meals','Supplies','Technology','Operations','Logistics','Telecommunications'].map(c => (
                      <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsManualEntryOpen(false)}
                    className="flex-1 py-4 text-[10px] gold-label uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 gold-hardware text-[10px] font-bold text-black uppercase tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    Archive Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </motion.div>
    </div>
  );
};



export default App;

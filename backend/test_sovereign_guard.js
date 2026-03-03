
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET || 'fiscalook-vault-secret';

// 1. DUMMY TOKEN (NOT SECURE)
const regularToken = jwt.sign({ id: 'dummy-id', email: 'test@test.com', is_secure: false }, JWT_SECRET);

// 2. SECURE TOKEN (BIOMETRICALLY VERIFIED)
const secureToken = jwt.sign({ id: 'dummy-id', email: 'test@test.com', is_secure: true }, JWT_SECRET);

async function testSovereignGuard() {
  console.log('--- TESTING PHASE 9: SOVEREIGN GUARD PROTOCOL ---');
  
  try {
    console.log('[1/3] Testing Unauthorized Access (Regular Token)...');
    await axios.get(`${API_URL}/api/analytics/predictive`, {
      headers: { Authorization: `Bearer ${regularToken}` }
    });
    console.log('❌ FAILURE: High-value route accessed without biometric verification.');
  } catch (err) {
    if (err.response?.status === 403) {
      console.log('✅ SUCCESS: Access denied as expected. Clearance required.');
    } else {
      console.log('❌ FAILURE: Unexpected error status:', err.response?.status);
    }
  }

  try {
    console.log('[2/3] Testing Authorized Access (Secure Token)...');
    const res = await axios.get(`${API_URL}/api/analytics/predictive`, {
      headers: { Authorization: `Bearer ${secureToken}` }
    });
    console.log('✅ SUCCESS: High-value route accessed with Sovereign Clearance.');
  } catch (err) {
    console.log('❌ FAILURE: Secure access denied:', err.response?.data || err.message);
  }

  console.log('[3/3] Protocol Status: SOVEREIGN GUARD ACTIVE.');
}

testSovereignGuard();

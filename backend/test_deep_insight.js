
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET || 'fiscalook-vault-secret';

// Simulate a Director with a valid UUID from the registry
const REAL_USER_ID = 'd78d09b9-5984-4a8b-ab32-dddf1207f3d3';
const directorToken = jwt.sign({ id: REAL_USER_ID, email: 'director@test.com', is_secure: true }, JWT_SECRET);

async function testDeepInsight() {
  console.log('--- TESTING PHASE 8: DEEP INSIGHT PROTOCOL ---');
  try {
    const res = await axios.get(`${API_URL}/api/analytics/predictive`, {
      headers: { Authorization: `Bearer ${directorToken}` }
    });
    console.log('Deep Insight Received:', JSON.stringify(res.data, null, 2));
    if (res.data.summary) {
      console.log('✅ PROTOCOL SUCCESSFUL: AI Reasoning Engine is online.');
    } else {
      console.log('❌ PROTOCOL FAILURE: Missing AI summary.');
    }
  } catch (err) {
    console.error('Deep Insight Test Failed:', err);
  }
}

testDeepInsight();

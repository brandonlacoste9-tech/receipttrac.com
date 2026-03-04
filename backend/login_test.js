import axios from 'axios';

async function login() {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'agent@receipttrac.com',
      password: 'password123'
    });
    console.log('Login Success:', res.data);
    const token = res.data.token;
    
    // Test a protected route
    const meRes = await axios.get('http://localhost:5001/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Auth Me Success:', meRes.data);
  } catch (err) {
    console.error('Login Failed:', err.response?.data || err.message);
  }
}

login();

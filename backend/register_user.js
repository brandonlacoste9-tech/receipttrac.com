import axios from 'axios';

async function register() {
  try {
    const res = await axios.post('http://localhost:5001/api/auth/register', {
      email: 'agent@receipttrac.com',
      password: 'password123',
      name: 'Agent Antigravity'
    });
    console.log('Registration Success:', res.data);
  } catch (err) {
    console.error('Registration Failed:', err.response?.data || err.message);
  }
}

register();

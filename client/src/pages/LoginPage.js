import { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    axios.post('https://order-tracking-app-asw1.onrender.com/api/login', { username, password })

      .then(res => {
        localStorage.setItem('token', res.data.token);
        window.location.href = '/o/success';
      })
      .catch(() => {
        alert('Invalid credentials');
      });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '300px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Order Tracking Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', border: 'none', color: 'white', borderRadius: '4px' }}
        >
          Login
        </button>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#555' }}>Login as User Name</p>
      </div>
    </div>
  );
}

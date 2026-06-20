import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5' },
  form: { display: 'flex', flexDirection: 'column', width: '350px', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', backgroundColor: 'white' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  input: { marginBottom: '15px', padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '12px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' },
  linkContainer: { marginTop: '20px', textAlign: 'center', color: '#555' },
  link: { color: '#007bff', textDecoration: 'none' }
};

function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // use context to update user state

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!/\.(edu|ac\.uk)$/.test(email)) {
      alert("Please use a valid university email (.edu, .ac.uk)");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        fullName,
        email,
        password,
      });

      const userData = { ...response.data.user, token: response.data.token };

      // Save user & token in localStorage
      localStorage.setItem('echohive_user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);

      // Update context
      login(userData);

      alert('Account created successfully!');
      navigate('/'); // redirect to home after signup
    } catch (error) {
      console.error("Signup error:", error.response?.data);
      alert(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create Your Account</h2>
        <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={styles.input} required />
        <input type="email" placeholder="University Email (.edu, .ac.uk)" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} minLength="6" required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} required />
        <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
      <div style={styles.linkContainer}>
        Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
      </div>
    </div>
  );
}

export default SignupPage;


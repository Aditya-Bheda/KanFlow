import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    return (
        <div className="auth-container">
            {/* Background Animations */}
            <div className="floating-notes-container">
                <div className="floating-note"></div>
                <div className="floating-note"></div>
                <div className="floating-note"></div>
                <div className="floating-note"></div>
                <div className="floating-note"></div>
                <div className="floating-note"></div>
            </div>

            <div className="auth-card">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Create Account</h2>
                    {error && <div className="error-message" style={{color: 'var(--danger)'}}>{error}</div>}
                    <div>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary">Sign Up</button>
                    <p style={{textAlign: 'center', margin: '15px 0', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                        or
                    </p>
                    <p style={{textAlign: 'center', fontSize: '0.9rem'}}>
                        Already have an account? <Link to="/login" style={{fontWeight: 600}}>Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;

import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
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
                    <h2>Welcome to KanFlow</h2>
                    {error && <div className="error-message" style={{color: 'var(--danger)'}}>{error}</div>}
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-primary">Log In</button>
                    <p style={{textAlign: 'center', margin: '15px 0', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                        or
                    </p>
                    <p style={{textAlign: 'center', fontSize: '0.9rem'}}>
                        Don't have an account? <Link to="/register" style={{fontWeight: 600}}>Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

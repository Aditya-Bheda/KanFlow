import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, KanbanSquare } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Navigate to dashboard with search query if user is on another page
        // or just update query if already on dashboard
        navigate(`/dashboard?search=${encodeURIComponent(query)}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Extract initials for profile icon
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <KanbanSquare size={26} className="logo-icon" color="var(--primary-color)"/>
                    <span style={{letterSpacing: '0.5px', fontWeight: 'bold'}}>KanFlow</span>
                </Link>
                {user && (
                    <div className="navbar-quick-links">
                        <Link to="/dashboard" className="nav-btn-minimal">Boards</Link>
                    </div>
                )}
            </div>

            {user && (
                <div className="navbar-center">
                    <div className="search-container">
                        <Search size={16} className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search boards..." 
                            className="search-input" 
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            )}

            <div className="navbar-right">
                {user ? (
                    <div className="profile-dropdown-container" ref={dropdownRef}>
                        <div 
                            className="profile-icon" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {getInitials(user.username)}
                        </div>
                        
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <span className="dropdown-title">Account</span>
                                    <span className="dropdown-email">{user.email}</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link to="/activity" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Lists</Link>
                                <Link to="/activity" className="dropdown-item" onClick={() => setDropdownOpen(false)}>My Cards</Link>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item text-danger" onClick={handleLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="nav-btn">Log in</Link>
                        <Link to="/register" className="nav-btn btn-primary">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

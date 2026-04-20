import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is in local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Set default auth header for all axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/api/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
    };

    const register = async (username, email, password) => {
        const response = await axios.post('/api/auth/register', { username, email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

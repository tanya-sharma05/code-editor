import React, { useState } from 'react'
import Logo from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
                { email, password }
            );

            localStorage.setItem('userInfo', JSON.stringify(data));

            toast.success('Login successful!');
            navigate('/dashboard');
        } 
        catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-form-wrapper">
                <div className="auth-form-logo-container">
                    <Logo />
                </div>
                <h4 className="mainLabel">Login to your Account</h4>
                <form onSubmit={handleLogin} className="auth-input-group">
                    <input
                        type="email"
                        className="inputBox"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="inputBox"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn joinBtn">
                        Login
                    </button>
                    <p className="auth-form-footer">
                        Don't have an account?&nbsp;
                        <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
import React, { useState } from 'react'
import Logo from '../components/Logo'
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
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
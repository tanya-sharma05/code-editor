import React, { useState } from 'react';
import Logo from "../components/Logo";
import {Link} from "react-router-dom";

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-form-wrapper">
                <div className="auth-form-logo-container">
                    <Logo />
                </div>
                <h4 className="mainLabel">Create an Account</h4>
                <form onSubmit={handleRegister} className="auth-input-group">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                        Register
                    </button>
                    <p className="auth-form-footer">
                        Already have an account?&nbsp;
                        <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage;

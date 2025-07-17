// src/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData.email, formData.password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="email" placeholder="E-mail" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
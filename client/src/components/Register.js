import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';

const Register = (props) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        successMessage: null,
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const auth = useAuth()

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrorMessage("")
        try {
            const payload = {
                name: formData.username,
                email: formData.email,
                password: formData.password
            }
            await auth.signupAction(payload);
            return;
        }catch(err) {
            alert(err)
        }
    };

    const redirectToLogin = () => {
        navigate('/login')
    }

    return (
        <div className="card col-12 col-lg-3 login-card mt-2 hv-center d-flex align-items-center" style={{ borderColor: 'lightblue' }}>
            <h2 className="card-header mt-5">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Register</button>
            </form>
            <div className="alert alert-success mt-2" style={{display: formData.successMessage ? 'block' : 'none' }} role="alert">
                {formData.successMessage}
            </div>
            <div className="mt-3 mb-5">
                <span>Already have an account? </span>
                <span className="loginText btn btn-primary" onClick={redirectToLogin}>Login here</span> 
            </div>
            <div className="mt-3" >
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Register;
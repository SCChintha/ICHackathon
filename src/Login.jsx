//proj updated
import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const roles = [
  { value: '', label: '-- Select Role --' },
  { value: 'admin', label: 'Admin' },
  { value: 'educator', label: 'Educator' },
  { value: 'citizen', label: 'Citizen' },
  { value: 'legal_expert', label: 'Legal Expert' }
];

class LoginInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signup: false,
            signupData: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
                role: ""
            },
            loginData: {
                email: "",
                password: "",
                role: ""
            },
            errData: {},
            apiError: "",
            apiSuccess: ""
        };
    }

    handleSignUpInput = (e) => {
        this.setState({
            signupData: {
                ...this.state.signupData,
                [e.target.name]: e.target.value
            }
        });
    };

    handleLoginInput = (e) => {
        this.setState({
            loginData: {
                ...this.state.loginData,
                [e.target.name]: e.target.value
            }
        });
    };

    validateSignup = () => {
        const { signupData } = this.state;
        const err = {};
        if (!signupData.role) err.role = "Role is required";
        if (!signupData.firstName.trim()) err.firstName = "First Name is required";
        if (!signupData.lastName.trim()) err.lastName = "Last Name is required";
        if (!signupData.email.trim()) err.email = "Email ID is required";
        if (!signupData.phone.trim()) err.phone = "Phone Number is required";
        if (signupData.password.length < 8) err.password = "Password must have at least 8 characters";
        if (signupData.confirmPassword !== signupData.password) err.confirmPassword = "Passwords do not match";

        this.setState({ errData: err });
        return Object.keys(err).length === 0;
    };

    registerUser = (e) => {
        e.preventDefault();
        if (!this.validateSignup()) return;
        const { signupData } = this.state;

        fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: signupData.firstName,
                lastName: signupData.lastName,
                email: signupData.email,
                phone: signupData.phone,
                password: signupData.password,
                role: signupData.role
            })
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.message || 'Registration failed');
                }
                this.setState({
                    signup: false,
                    signupData: {
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        password: "",
                        confirmPassword: "",
                        role: ""
                    },
                    errData: {},
                    apiError: "",
                    apiSuccess: data.message || 'Registered successfully. You can now login.'
                });
            })
            .catch((err) => {
                this.setState({ apiError: err.message || 'Registration failed', apiSuccess: "" });
            });
    };

    handleLogin = (e) => {
        e.preventDefault();
        const { email, password, role } = this.state.loginData;
        if (!email || !password || !role) {
            alert("Please fill in role, email and password to login.");
            return;
        }
        fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.message || 'Login failed');
                }
                this.setState({ apiError: "", apiSuccess: data.message || 'Login successful' });
                if (this.props.onLoginSuccess) {
                    this.props.onLoginSuccess(data.user);
                } else {
                    // default: navigate to dashboard
                    this.props.navigate('/dashboard');
                }
            })
            .catch((err) => {
                this.setState({ apiError: err.message || 'Login failed', apiSuccess: "" });
            });
    };

    render() {
        const { signup, signupData, loginData, errData, apiError, apiSuccess } = this.state;
        return (
            <div className='login login-full-bg'>
                <button
                    type="button"
                    className="back-home-button"
                    onClick={() => this.props.navigate("/")}
                >
                    4 Back to Home
                </button>
                <div className='rightpanel login-card-right'>
                    <form className='card' onSubmit={this.handleLogin}>
                        <h2>Login</h2>
                        {apiError && <div className="error" style={{ marginBottom: '8px' }}>{apiError}</div>}
                        {apiSuccess && <div className="success" style={{ marginBottom: '8px', color: '#138808' }}>{apiSuccess}</div>}
                        <label htmlFor="loginRole">Role</label>
                        <select
                            id="loginRole"
                            name="role"
                            value={loginData.role}
                            onChange={this.handleLoginInput}
                            aria-required="true"
                        >
                            {roles.map(r => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                        <label htmlFor="loginEmail">Email</label>
                        <input
                            type='text'
                            id="loginEmail"
                            name="email"
                            placeholder='Email'
                            value={loginData.email}
                            onChange={this.handleLoginInput}
                            aria-label="Email"
                        />
                        <label htmlFor="loginPassword">Password</label>
                        <input
                            type='password'
                            id="loginPassword"
                            name="password"
                            placeholder='Password'
                            value={loginData.password}
                            onChange={this.handleLoginInput}
                            aria-label="Password"
                        />
                        <button type="submit">Login</button>
                        <p>
                            Don't have an account?{" "}
                            <span
                                role="button"
                                tabIndex={0}
                                style={{ color: "#138808", cursor: "pointer", textDecoration: "underline" }}
                                onClick={() => this.setState({ signup: true })}
                                onKeyPress={e => { if (e.key === 'Enter') this.setState({ signup: true }); }}
                            >
                                Sign Up
                            </span>
                        </p>
                    </form>
                </div>

                {signup &&
                    <div className='overlay' role="dialog" aria-modal="true">
                        <form className='signup' onSubmit={this.registerUser}>
                            <button type="button" className='close' onClick={() => this.setState({ signup: false })} aria-label="Close Sign Up">X</button>
                            <h2>Create an account</h2>
                            <label htmlFor="signupRole">Role *</label>
                            <select
                                id="signupRole"
                                name="role"
                                value={signupData.role}
                                onChange={this.handleSignUpInput}
                                aria-required="true"
                                style={!errData.role ? {} : { border: "1px solid red" }}
                            >
                                {roles.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                            {errData.role && <div className="error">{errData.role}</div>}

                            <label htmlFor="firstName">First Name *</label>
                            <input
                                type='text'
                                id='firstName'
                                name='firstName'
                                placeholder='First Name'
                                value={signupData.firstName}
                                onChange={this.handleSignUpInput}
                                autoComplete='off'
                                style={!errData.firstName ? {} : { border: "1px solid red" }}
                                aria-required="true"
                            />
                            {errData.firstName && <div className="error">{errData.firstName}</div>}

                            <label htmlFor="lastName">Last Name *</label>
                            <input
                                type='text'
                                id='lastName'
                                name='lastName'
                                placeholder='Last Name'
                                value={signupData.lastName}
                                onChange={this.handleSignUpInput}
                                autoComplete='off'
                                style={!errData.lastName ? {} : { border: "1px solid red" }}
                                aria-required="true"
                            />
                            {errData.lastName && <div className="error">{errData.lastName}</div>}

                            <label htmlFor="email">Email ID *</label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                placeholder='Email ID'
                                value={signupData.email}
                                onChange={this.handleSignUpInput}
                                autoComplete='off'
                                style={!errData.email ? {} : { border: "1px solid red" }}
                                aria-required="true"
                            />
                            {errData.email && <div className="error">{errData.email}</div>}

                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type='text'
                                id='phone'
                                name='phone'
                                placeholder='Phone Number'
                                value={signupData.phone}
                                onChange={this.handleSignUpInput}
                                autoComplete='off'
                                style={!errData.phone ? {} : { border: "1px solid red" }}
                                aria-required="true"
                            />
                            {errData.phone && <div className="error">{errData.phone}</div>}

                            <label htmlFor="password">Password *</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                placeholder='Password (min 8 characters)'
                                value={signupData.password}
                                onChange={this.handleSignUpInput}
                                style={!errData.password ? {} : { border: "1px solid red" }}
                                aria-required="true"
                            />
                            {errData.password && <div className="error">{errData.password}</div>}

                            <label htmlFor="confirmPassword">Confirm Password *</label>
                            <input
                                type='password'
                                id='confirmPassword'
                                name='confirmPassword'
                                placeholder='Confirm Password'
                                value={signupData.confirmPassword}
                                onChange={this.handleSignUpInput}
                                style={!errData.confirmPassword ? {} : { border: "1px solid red" }}
                                aria-required="true"
                            />
                            {errData.confirmPassword && <div className="error">{errData.confirmPassword}</div>}

                            <button type="submit" className='regButton' aria-label="Register">Register</button>
                        </form>
                    </div>
                }
            </div>
        );
    }
}

function Login(props) {
    const navigate = useNavigate();
    return <LoginInner {...props} navigate={navigate} />;
}

export default Login;
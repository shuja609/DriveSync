import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    username: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log('Form submitted:', formData);
  };

  const handleSocialLogin = (provider) => {
    // Handle social login logic
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="register">
      <div className="container">
        <h2>Create an Account</h2>
        <form className="register__form" onSubmit={handleSubmit}>
          <div className="register__form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register__form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register__form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register__form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register__form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="register__form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register__form-button">Register</button>
        </form>

        <div className="register__social-login">
          <p>Or register with:</p>
          <button onClick={() => handleSocialLogin('Google')} className="social-button google">Google</button>
          <button onClick={() => handleSocialLogin('Facebook')} className="social-button facebook">Facebook</button>
          <button onClick={() => handleSocialLogin('Twitter')} className="social-button twitter">Twitter</button>
        </div>
      </div>
    </div>
  );
};

export default Register; 
import React from 'react';
import RegisterForm from './RegisterForm';
import SocialLoginButtons from './SocialLoginButtons';
import './RegisterPage.css';

const RegisterPage = () => {
  const handleFormSubmit = (formData) => {
    // Handle form submission, e.g., send data to backend
    console.log('Form submitted:', formData);
  };

  const handleSocialLogin = (provider) => {
    // Handle social login logic
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="register-page">
      <div className="container">
        <h2>Create an Account</h2>
        <RegisterForm onSubmit={handleFormSubmit} />
        <SocialLoginButtons onSocialLogin={handleSocialLogin} />
      </div>
    </div>
  );
};

export default RegisterPage; 
import React, { useState } from 'react';
import './RegisterForm.css';

const RegisterForm = ({ onSubmit }) => {
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
    onSubmit(formData);
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'username'].map((field) => (
        <div key={field} className="register-form__group">
          <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            type={field === 'password' ? 'password' : 'text'}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit" className="register-form__button">Register</button>
    </form>
  );
};

export default RegisterForm; 
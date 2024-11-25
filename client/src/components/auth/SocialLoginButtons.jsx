import React from 'react';
import './SocialLoginButtons.css';

const SocialLoginButtons = ({ onSocialLogin }) => {
  return (
    <div className="social-login">
      <p>Or register with:</p>
      {['Google', 'Facebook', 'Twitter'].map((provider) => (
        <button
          key={provider}
          onClick={() => onSocialLogin(provider)}
          className={`social-button ${provider.toLowerCase()}`}
        >
          {provider}
        </button>
      ))}
      
    </div>
  );
};

export default SocialLoginButtons; 
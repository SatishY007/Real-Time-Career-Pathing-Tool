
import React, { useState } from 'react';
import { EmailIcon, PasswordIcon, UserIcon } from './Icons';

const AuthForm = ({ type, onSubmit, fields, validate }) => {
  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach(f => initial[f.name] = '');
    return initial;
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // Live validation feedback
    const fieldError = validate({ ...values, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: fieldError[e.target.name] }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  const getIcon = (name) => {
    if (name === 'email') return <EmailIcon style={{ marginRight: 8 }} />;
    if (name === 'password' || name === 'confirmPassword') return <PasswordIcon style={{ marginRight: 8 }} />;
    if (name === 'name') return <UserIcon style={{ marginRight: 8 }} />;
    return null;
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#3730a3', fontWeight: 700, letterSpacing: 1 }}>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
      {fields.map(field => (
        <div key={field.name} style={{ marginBottom: 20 }}>
          <label htmlFor={field.name} style={{ display: 'block', marginBottom: 6, color: '#22223b', fontWeight: 500, fontSize: 15, letterSpacing: 0.5 }}>{field.label}</label>
          <div style={{ display: 'flex', alignItems: 'center', border: errors[field.name] ? '1.5px solid #e63946' : '1px solid #d1d5db', borderRadius: 8, padding: '6px 12px', background: '#f9fafb', boxShadow: errors[field.name] ? '0 0 0 2px #e63946' : 'none' }}>
            {getIcon(field.name)}
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={values[field.name]}
              onChange={handleChange}
              autoComplete={field.autoComplete || 'off'}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16, color: '#22223b', padding: '4px 0' }}
            />
          </div>
          {errors[field.name] && (
            <div style={{ color: '#e63946', fontSize: 13, marginTop: 4, fontWeight: 500 }}>{errors[field.name]}</div>
          )}
        </div>
      ))}
      <button type="submit" style={{ width: '100%', padding: '12px 0', background: 'linear-gradient(90deg, #3730a3 0%, #4f8cff 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 17, marginTop: 12, cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.08)' }}>
        {type === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;


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
    <form onSubmit={handleSubmit} noValidate>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
      {fields.map(field => (
        <div key={field.name} style={{ marginBottom: 16 }}>
          <label htmlFor={field.name} style={{ display: 'block', marginBottom: 4 }}>{field.label}</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: 6, padding: '4px 8px', background: '#f9fafb' }}>
            {getIcon(field.name)}
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={values[field.name]}
              onChange={handleChange}
              autoComplete={field.autoComplete || 'off'}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15 }}
            />
          </div>
          {errors[field.name] && (
            <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{errors[field.name]}</div>
          )}
        </div>
      ))}
      <button type="submit" style={{ width: '100%', padding: '10px 0', background: '#3730a3', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>
        {type === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;

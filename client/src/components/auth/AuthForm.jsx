

import React, { useState } from 'react';
import { EmailIcon, PasswordIcon, UserIcon } from './Icons';
import styles from './AuthForm.module.css';

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
    <form onSubmit={handleSubmit} noValidate className={styles.formContainer}>
      <h2 className={styles.formTitle}>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
      {fields.map(field => (
        <div key={field.name} className={styles.inputGroup}>
          <label htmlFor={field.name} className={styles.label}>{field.label}</label>
          <div className={styles.inputWrapper}>
            {getIcon(field.name)}
            <input
              type={field.type}
              name={field.name}
              id={field.name}
              value={values[field.name]}
              onChange={handleChange}
              autoComplete={field.autoComplete || 'off'}
              className={styles.input}
            />
          </div>
          {errors[field.name] && (
            <div className={styles.error}>{errors[field.name]}</div>
          )}
        </div>
      ))}
      <button type="submit" className={styles.submitBtn}>
        {type === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;

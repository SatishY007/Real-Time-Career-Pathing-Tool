import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";
import { apiPost } from '../../api';

export default function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!values.email) errs.email = "Email required";
    if (!values.password) errs.password = "Password required";
    return errs;
  };

  const handleChange = e => {
    if (status.message) setStatus({ type: '', message: '' });
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        console.log('Attempting login with:', values);
        const res = await apiPost('/api/auth/login', {
          email: values.email,
          password: values.password
        });
        console.log('Login API response:', res);
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        setLoading(false);
        setStatus({ type: 'success', message: 'Login successful' });
        setTimeout(() => navigate('/dashboard'), 650);
      } catch (err) {
        setLoading(false);
        setStatus({ type: 'error', message: err?.message || 'Login failed' });
        console.error('Login API error:', err);
      }
    }
  };

  return (
    <div className={styles.authPage}>
      {/* Animated employee pathing SVG background */}
      <div className={styles.employeePathBg}>
        {/* Path/arrow shapes for career pathing theme */}
        <svg className={styles.employeePathIcon} style={{left: '10vw', top: '12vh', width: 60, height: 60, animationDelay: '0s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 8 56 56" stroke="#00bcd4" strokeWidth="6" fill="none"/><circle cx="32" cy="8" r="6" fill="#ffd600"/></svg>
        <svg className={styles.employeePathIcon} style={{left: '70vw', top: '20vh', width: 48, height: 48, animationDelay: '2s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 24 56 56" stroke="#8bc34a" strokeWidth="6" fill="none"/><rect x="26" y="18" width="12" height="12" rx="3" fill="#00bcd4"/></svg>
        <svg className={styles.employeePathIcon} style={{left: '40vw', top: '70vh', width: 54, height: 54, animationDelay: '1s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 40 56 56" stroke="#ff7043" strokeWidth="6" fill="none"/><polygon points="32,36 38,48 26,48" fill="#ffd600"/></svg>
        <svg className={styles.employeePathIcon} style={{left: '80vw', top: '80vh', width: 36, height: 36, animationDelay: '3s'}} viewBox="0 0 64 64"><path d="M32 56 Q48 32 56 56" stroke="#3f51b5" strokeWidth="6" fill="none"/><circle cx="48" cy="32" r="6" fill="#8bc34a"/></svg>
        <svg className={styles.employeePathIcon} style={{left: '20vw', top: '80vh', width: 40, height: 40, animationDelay: '4s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 48 56 56" stroke="#00bcd4" strokeWidth="6" fill="none"/><rect x="30" y="40" width="8" height="8" rx="2" fill="#ff7043"/></svg>
      </div>
      <div className={styles.formContainer + ' ' + styles.loginContainer}>
        <h2 className={styles.formTitle}>Login</h2>
        <form onSubmit={handleSubmit} noValidate>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="email"
              name="email"
              id="email"
              autoComplete="username"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          {errors.password && <div className={styles.error}>{errors.password}</div>}
        </div>
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {status.message && (
          <div
            className={status.type === 'success' ? styles.success : styles.error}
            role="alert"
          >
            {status.message}
          </div>
        )}

        <div className={styles.footerRow}>
          <span className={styles.footerText}>Don't have an account?</span>
          <button type="button" className={styles.footerLinkBtn} onClick={() => navigate('/register')}>
            Sign Up
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

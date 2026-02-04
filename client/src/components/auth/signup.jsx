import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthForm.module.css";
import { apiPost } from '../../api';

export default function Signup() {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!values.name) errs.name = "Name required";
    if (!values.email) errs.email = "Email required";
    if (!values.password) errs.password = "Password required";
    if (!values.confirmPassword) errs.confirmPassword = "Confirm password";
    if (values.password && values.confirmPassword && values.password !== values.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await apiPost('/api/auth/signup', {
          name: values.name,
          email: values.email,
          password: values.password,
          skills: [] // You can pass actual skills if available
        });
        setLoading(false);
        navigate('/login');
      } catch (err) {
        setLoading(false);
        setErrors({ api: err.message });
      }
    }
  };

  return (
    <>
      {/* Animated employee pathing SVG background */}
      <div className="employee-path-bg">
        {/* Path/arrow shapes for career pathing theme */}
        <svg className="employee-path-icon" style={{left: '10vw', top: '12vh', width: 60, height: 60, animationDelay: '0s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 8 56 56" stroke="#00bcd4" strokeWidth="6" fill="none"/><circle cx="32" cy="8" r="6" fill="#ffd600"/></svg>
        <svg className="employee-path-icon" style={{left: '70vw', top: '20vh', width: 48, height: 48, animationDelay: '2s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 24 56 56" stroke="#8bc34a" strokeWidth="6" fill="none"/><rect x="26" y="18" width="12" height="12" rx="3" fill="#00bcd4"/></svg>
        <svg className="employee-path-icon" style={{left: '40vw', top: '70vh', width: 54, height: 54, animationDelay: '1s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 40 56 56" stroke="#ff7043" strokeWidth="6" fill="none"/><polygon points="32,36 38,48 26,48" fill="#ffd600"/></svg>
        <svg className="employee-path-icon" style={{left: '80vw', top: '80vh', width: 36, height: 36, animationDelay: '3s'}} viewBox="0 0 64 64"><path d="M32 56 Q48 32 56 56" stroke="#3f51b5" strokeWidth="6" fill="none"/><circle cx="48" cy="32" r="6" fill="#8bc34a"/></svg>
        <svg className="employee-path-icon" style={{left: '20vw', top: '80vh', width: 40, height: 40, animationDelay: '4s'}} viewBox="0 0 64 64"><path d="M8 56 Q32 48 56 56" stroke="#00bcd4" strokeWidth="6" fill="none"/><rect x="30" y="40" width="8" height="8" rx="2" fill="#ff7043"/></svg>
      </div>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Sign Up</h2>
        <form onSubmit={handleSubmit} noValidate>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Name</label>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>
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
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>
          {errors.password && <div className={styles.error}>{errors.password}</div>}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
          </div>
          {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
        </div>
        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      {errors.api && <div className={styles.error}>{errors.api}</div>}
      <div style={{ display: 'block', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 12 }}>
        <span style={{ color: '#22223b', fontSize: 15 }}>Already have an account?</span>
        <button
          type="button"
          style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
      </div>
    </>
  );
}


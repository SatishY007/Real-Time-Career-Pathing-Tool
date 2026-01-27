import React from "react";

import AuthForm from "./AuthForm";
import AuthNav from "./AuthNav";

const validateLogin = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Invalid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
};

const loginFields = [
  { name: "email", label: "Email", type: "email", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
];

const handleLogin = (values) => {
  // TODO: Implement login logic (API call)
  alert("Login submitted: " + JSON.stringify(values));
};

export default function LoginPage() {
  return (
    <div className="auth-bg">
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: '#fff',
        padding: 36,
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.14)',
        border: '1px solid #e0e7ff',
      }}>
        <AuthForm
          type="login"
          fields={loginFields}
          validate={validateLogin}
          onSubmit={handleLogin}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18, paddingRight: 4 }}>
          <AuthNav type="login" />
        </div>
      </div>
    </div>
  );
}
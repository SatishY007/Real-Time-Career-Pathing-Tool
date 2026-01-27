import React from "react";

import AuthForm from "./AuthForm";
import AuthNav from "./AuthNav";

const validateSignup = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Name is required";
  }
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
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

const signupFields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password", autoComplete: "new-password" },
];

const handleSignup = (values) => {
  // TODO: Implement signup logic (API call)
  alert("Signup submitted: " + JSON.stringify(values));
};

export default function SignupPage() {
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
          type="signup"
          fields={signupFields}
          validate={validateSignup}
          onSubmit={handleSignup}
        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 18, gap: 8 }}>
          <span style={{ color: '#22223b', fontSize: 15 }}>Already have an account?</span>
          <AuthNav type="signup" />
        </div>
      </div>
    </div>
  );
}

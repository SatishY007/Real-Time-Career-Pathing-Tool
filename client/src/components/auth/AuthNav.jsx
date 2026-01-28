import React from "react";
import { Link } from "react-router-dom";

export default function AuthNav({ type }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      {type === "login" ? (
        <>
          <span>Don't have an account? </span>
          <Link to="/signup">Sign Up</Link>
        </>
      ) : (
        <>
          <span>Already have an account?</span>
          <Link to="/">Login</Link>
        </>
      )}
    </div>
  );
}

import React from "react";

export function EmailIcon(props) {
  return (
    <svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <rect width={20} height={20} rx={4} fill="#e0e7ff" />
      <path d="M5 7l5 4 5-4" stroke="#3730a3" strokeWidth={1.5} fill="none" />
      <rect x={5} y={7} width={10} height={6} rx={2} stroke="#3730a3" strokeWidth={1.5} fill="none" />
    </svg>
  );
}

export function PasswordIcon(props) {
  return (
    <svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <rect width={20} height={20} rx={4} fill="#e0e7ff" />
      <circle cx={10} cy={11} r={2} stroke="#3730a3" strokeWidth={1.5} fill="none" />
      <rect x={6} y={9} width={8} height={5} rx={2} stroke="#3730a3" strokeWidth={1.5} fill="none" />
      <path d="M8 9V7a2 2 0 1 1 4 0v2" stroke="#3730a3" strokeWidth={1.5} fill="none" />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <rect width={20} height={20} rx={4} fill="#e0e7ff" />
      <circle cx={10} cy={8} r={3} stroke="#3730a3" strokeWidth={1.5} fill="none" />
      <path d="M5 15c0-2.5 3-4 5-4s5 1.5 5 4" stroke="#3730a3" strokeWidth={1.5} fill="none" />
    </svg>
  );
}


import React, { useEffect, useState } from 'react';
import styles from './SalaryTrends.module.css';
import { apiGet } from '../api';

const SalaryTrends = ({ techStack }) => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!techStack) return;
    setLoading(true);
    setError(null);
    apiGet(`/api/salary/trends?techStack=${encodeURIComponent(techStack)}`)
      .then(data => {
        setSalary(data && data.mean ? data.mean : null);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch salary trends');
        setLoading(false);
      });
  }, [techStack]);

  if (!techStack) return <div className={styles.placeholder}>Enter a tech stack to see salary trends.</div>;
  if (loading) return <div className={styles.placeholder}>Loading salary trends…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!salary) return <div className={styles.placeholder}>No salary data found for this tech stack.</div>;

  return (
    <div className={styles.salaryInfo}>
      <span className={styles.label}>Average Salary:</span>
      <span className={styles.value}>${salary.toLocaleString()}</span>
      <span className={styles.year}>/year (US)</span>
    </div>
  );
};

export default SalaryTrends;

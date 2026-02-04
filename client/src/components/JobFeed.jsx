
import React, { useEffect, useState } from 'react';
import styles from './JobFeed.module.css';
import { apiGet } from '../api';

const JobFeed = ({ role }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) return;
    setLoading(true);
    setError(null);
    apiGet(`/api/jobs/live?role=${encodeURIComponent(role)}`)
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch jobs');
        setLoading(false);
      });
  }, [role]);

  if (!role) return <div className={styles.placeholder}>Enter a target role to see jobs.</div>;
  if (loading) return <div className={styles.placeholder}>Loading jobs…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!jobs.length) return <div className={styles.placeholder}>No jobs found for this role.</div>;

  return (
    <ul className={styles.jobList}>
      {jobs.slice(0, 8).map(job => (
        <li key={job.id} className={styles.jobItem}>
          <a href={job.redirect_url} target="_blank" rel="noopener noreferrer">
            <strong>{job.title}</strong>
          </a>
          <div className={styles.company}>{job.company?.display_name}</div>
          <div className={styles.location}>{job.location?.display_name}</div>
        </li>
      ))}
    </ul>
  );
};

export default JobFeed;

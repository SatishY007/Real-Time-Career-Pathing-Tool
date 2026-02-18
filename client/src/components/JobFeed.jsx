import React, { useEffect, useState } from 'react';
import styles from './JobFeed.module.css';
import { apiGet } from '../api';

/**
 * JobFeed (Client)
 * ----------------
 * Fetches live job listings from `GET /api/jobs/live?role=...` whenever the
 * `role` prop changes (typically built from the skill tags on the dashboard).
 */

const JobFeed = ({ role }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dismissJob = (jobId) => {
    // Local-only dismissal (doesn't persist). Keeps demo UX snappy.
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  useEffect(() => {
    // Avoid fetching when there's no role/query.
    if (!role) return;
    setLoading(true);
    setError(null);
    apiGet(`/api/jobs/live?role=${encodeURIComponent(role)}`)
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch jobs');
        setLoading(false);
      });
  }, [role]);

  if (!role) return <div className={styles.placeholder}>Enter a target role to see jobs.</div>;
  if (loading) return <div className={styles.placeholder}>Loading jobs…</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!jobs.length) return <div className={styles.placeholder}>No jobs found for this role.</div>;

  return (
    <ul className={styles.jobList}>
      {jobs.map(job => (
        <li key={job.id} className={styles.jobItem}>
          <button
            type="button"
            className={styles.dismissBtn}
            aria-label="Dismiss job"
            title="Not interested"
            onClick={(e) => {
              // Prevent the click from opening the job link.
              e.preventDefault();
              e.stopPropagation();
              dismissJob(job.id);
            }}
          >
            ×
          </button>
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

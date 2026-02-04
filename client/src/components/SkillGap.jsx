
import React, { useState } from 'react';
import styles from './SkillGap.module.css';
import { apiPost } from '../api';

const SkillGap = ({ skills, targetRole }) => {
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeGap = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost('/api/skill-gap/analyze', { targetRole });
      setMissingSkills(data.missingSkills || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.skillGapContainer}>
      <button className={styles.analyzeBtn} onClick={analyzeGap} disabled={loading || !targetRole}>
        {loading ? 'Analyzing...' : 'Analyze Skill Gap'}
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {missingSkills.length > 0 && (
        <div className={styles.result}>
          <strong>Missing Skills for {targetRole}:</strong>
          <ul>
            {missingSkills.map(skill => <li key={skill}>{skill}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SkillGap;

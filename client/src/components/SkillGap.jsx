import React, { useState } from 'react';
import styles from './SkillGap.module.css';
import { apiPost } from '../api';

/**
 * SkillGap (Client)
 * -----------------
 * Calls the protected backend endpoint `POST /api/skill-gap/analyze`.
 *
 * Input:
 * - `skills`: array of user-entered skill tags
 * - `targetRole`: role/keyword string used for analysis
 *
 * Output:
 * - Renders the backend-calculated `missingSkills` list.
 */

const SkillGap = ({ skills, targetRole }) => {
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeGap = async () => {
    // Button click handler: triggers analysis and updates UI state.
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost('/api/skill-gap/analyze', { targetRole, skills });
      setMissingSkills(data.missingSkills || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.skillGapContainer}>
      {/* Disable if no role/query provided or request in-flight */}
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

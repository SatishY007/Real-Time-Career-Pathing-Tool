import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import SkillTagInput from './SkillTagInput';
import SkillRadarChart from './SkillRadarChart';
import JobFeed from './JobFeed';
import SalaryTrends from './SalaryTrends';
import SkillGap from './SkillGap';

/**
 * Dashboard (Client)
 * ------------------
 * Main authenticated screen. Users can:
 * - Enter skills (tags)
 * - Run skill-gap analysis for a target role
 * - View a visual radar chart (roadmap)
 * - See salary trends and live job feed
 *
 * Authentication model:
 * - JWT token is stored in localStorage after login.
 * - If token is missing, the user is redirected to `/login`.
 */

const Dashboard = () => {
  // In-memory skill list (tag input). Used to build a search query for API calls.
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  // Converts skill tags into a single query string for APIs.
  const skillQuery = skills.length ? skills.join(' ') : '';

  useEffect(() => {
    // Lightweight guard: if no token exists, assume user is not authenticated.
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Dashboard: No token found in localStorage, redirecting to login.');
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      console.log('Dashboard: Token found in localStorage:', token);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear session and return to login.
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  // Main dashboard container: wraps all sections
  return (
    <div className={styles.dashboardContainer}>
      {/* Header: shows dashboard title and logout button */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Skill-Graph Career Pathing Dashboard</h1>
          {/* Logout button clears token and redirects to login */}
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main dashboard sections */}
      <div className={styles.sections}>
        {/* Skill input section: lets user add skills and see skill gap analysis */}
        <section className={styles.skillInputSection}>
          <h2>Skill Input</h2>
          {/* SkillTagInput: interactive tag input for user skills */}
          <SkillTagInput skills={skills} setSkills={setSkills} />
          {/* SkillGap: shows missing skills for a target role based on input */}
          <SkillGap skills={skills} targetRole={skillQuery} />
        </section>
        {/* Career roadmap section: visualizes skills and salary trends */}
        <section className={styles.roadmapSection}>
          <h2>Career Roadmap Visualizer</h2>
          <div className={`${styles.surfaceCard} ${styles.surfaceCardCentered}`}>
            <div className={styles.roadmapBody}>
              {/* SkillRadarChart: radar chart comparing user skills to target skills */}
              <div className={styles.chartWrap}>
                <SkillRadarChart
                  labels={skills.length ? skills : ['Skill A', 'Skill B', 'Skill C', 'Skill D', 'Skill E']}
                  userSkills={skills.length ? skills.map(() => Math.floor(Math.random() * 8) + 2) : [6, 7, 5, 8, 4]}
                  targetSkills={skills.length ? skills.map(() => 10) : [10, 10, 10, 10, 10]}
                />
              </div>
              {/* SalaryTrends: shows salary data for the selected tech stack */}
              <div className={styles.salaryWrap}>
                <SalaryTrends techStack={skillQuery} />
              </div>
            </div>
          </div>
        </section>
        {/* Job feed section: displays live job postings for the selected role */}
        <section className={styles.jobFeedSection}>
          <h2>Live Job Feed</h2>
          <div className={styles.surfaceCard}>
            <JobFeed role={skillQuery} />
          </div>
        </section>
      </div>
    {/* End dashboard container */}
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import SkillTagInput from './SkillTagInput';
import SkillRadarChart from './SkillRadarChart';
import JobFeed from './JobFeed';
import SalaryTrends from './SalaryTrends';
import SkillGap from './SkillGap';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const skillQuery = skills.length ? skills.join(' ') : '';

  useEffect(() => {
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
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Skill-Graph Career Pathing Dashboard</h1>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.sections}>
        <section className={styles.skillInputSection}>
          <h2>Skill Input</h2>
          <SkillTagInput skills={skills} setSkills={setSkills} />
          <SkillGap skills={skills} targetRole={skillQuery} />
        </section>
        <section className={styles.roadmapSection}>
          <h2>Career Roadmap Visualizer</h2>
          <div className={`${styles.surfaceCard} ${styles.surfaceCardCentered}`}>
            <div className={styles.roadmapBody}>
              <div className={styles.chartWrap}>
                <SkillRadarChart
                  labels={skills.length ? skills : ['Skill A', 'Skill B', 'Skill C', 'Skill D', 'Skill E']}
                  userSkills={skills.length ? skills.map(() => Math.floor(Math.random() * 8) + 2) : [6, 7, 5, 8, 4]}
                  targetSkills={skills.length ? skills.map(() => 10) : [10, 10, 10, 10, 10]}
                />
              </div>
              <div className={styles.salaryWrap}>
                <SalaryTrends techStack={skillQuery} />
              </div>
            </div>
          </div>
        </section>
        <section className={styles.jobFeedSection}>
          <h2>Live Job Feed</h2>
          <div className={styles.surfaceCard}>
            <JobFeed role={skillQuery} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

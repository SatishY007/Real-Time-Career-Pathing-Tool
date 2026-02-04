
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

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Skill-Graph Career Pathing Dashboard</h1>
      <div className={styles.sections}>
        <section className={styles.skillInputSection}>
          <h2>Skill Input</h2>
          <SkillTagInput skills={skills} setSkills={setSkills} />
          <SkillGap skills={skills} targetRole={skills[0] || ''} />
        </section>
        <section className={styles.roadmapSection}>
          <h2>Career Roadmap Visualizer</h2>
          <div style={{width: '100%', minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa', borderRadius: 12, border: '1px solid #e0e6ed', color: '#3a4d63', fontSize: 18, padding: 16, flexDirection: 'column'}}>
            <SkillRadarChart
              labels={skills.length ? skills : ['Skill A', 'Skill B', 'Skill C', 'Skill D', 'Skill E']}
              userSkills={skills.length ? skills.map(() => Math.floor(Math.random() * 8) + 2) : [6, 7, 5, 8, 4]}
              targetSkills={skills.length ? skills.map(() => 10) : [10, 10, 10, 10, 10]}
            />
            <SalaryTrends techStack={skills[0] || ''} />
          </div>
        </section>
        <section className={styles.jobFeedSection}>
          <h2>Live Job Feed</h2>
          <div style={{width: '100%', minHeight: 180, background: '#f5f7fa', borderRadius: 12, border: '1px solid #e0e6ed', padding: 12}}>
            <JobFeed role={skills[0] || ''} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

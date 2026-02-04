import React, { useState } from 'react';
import styles from './SkillTagInput.module.css';

const SkillTagInput = ({ skills, setSkills }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => setInput(e.target.value);

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newSkill = input.trim();
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && skills.length) {
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (idx) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.tags}>
        {skills.map((skill, idx) => (
          <span key={skill} className={styles.tag}>
            {skill}
            <button type="button" className={styles.removeBtn} onClick={() => removeSkill(idx)}>
              ×
            </button>
          </span>
        ))}
        <input
          className={styles.input}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
        />
      </div>
    </div>
  );
};

export default SkillTagInput;

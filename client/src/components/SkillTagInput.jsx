import React, { useState } from 'react';
import styles from './SkillTagInput.module.css';

/**
 * SkillTagInput (Client)
 * ----------------------
 * Lightweight tag input for capturing a list of skills.
 * - Enter / comma adds a tag
 * - Backspace on empty input removes last tag
 * - Clicking × removes a specific tag
 */

const SkillTagInput = ({ skills, setSkills }) => {
  // Current text inside the input field (not yet committed as a tag).
  const [input, setInput] = useState('');

  const handleInputChange = (e) => setInput(e.target.value);

  const handleKeyDown = (e) => {
    // Commit tag on Enter or comma.
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      const newSkill = input.trim();
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setInput('');
    }
    // Remove last tag when input is empty.
    if (e.key === 'Backspace' && !input && skills.length) {
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (idx) => {
    // Remove by index.
    setSkills(skills.filter((_, i) => i !== idx));
  };

  return (
    <div>
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
    </div>
  );
};

export default SkillTagInput;

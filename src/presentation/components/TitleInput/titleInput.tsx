import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { taskStore } from '../../../stores/taskStore';
import { useTranslation } from 'react-i18next';
import styles from './titleInput.module.css';

export const TitleInput = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();
  const [title, setTitle] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    taskStore.setTitle(title);
    setIsEditing(false);
  };

  useEffect(() => {
    setTitle(taskStore.title);
  }, [taskStore.title]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{t('projectReport')}</div>
      {isEditing ? (
        <input
          className={styles.input}
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <button className={styles.display} onClick={handleEditClick}>
          {title}
        </button>
      )}
    </div>
  );
});

import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { taskStore } from '../../../stores/taskStore';
import styles from './rateInput.module.css';
import { useTranslation } from 'react-i18next';

export const RateInput = observer(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [rate, setRate] = useState(taskStore.currencyValueOfHours.toString());
  const { t } = useTranslation();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = e.target.value;
    if (/^\d*\.?\d*$/.test(newRate)) {
      setRate(newRate);
    }
  };

  const handleBlur = () => {
    const value = parseFloat(rate);
    if (!isNaN(value)) {
      taskStore.setCurrencyValueOfHours(value);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    setRate(taskStore.currencyValueOfHours.toString());
  }, [taskStore.currencyValueOfHours]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{t('yourRate')}</div>
      {isEditing ? (
        <input
          className={styles.input}
          value={rate}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <button className={styles.display} onClick={handleEditClick}>
          {taskStore.currencyValueOfHours} {taskStore.currency === 'usd' && '$'}
          {taskStore.currency === 'eur' && '€'}
          {taskStore.currency === 'rub' && '₽'} / {t('hour')}
        </button>
      )}
    </div>
  );
});

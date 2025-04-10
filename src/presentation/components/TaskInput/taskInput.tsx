import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './taskInput.module.css';
import { taskStore } from '../../../stores/taskStore';
import { Play, Pause, Check } from 'lucide-react';

interface TaskProps {
  task: {
    id: string;
    name: string;
    time: number;
    currencyValue: number;
    isFinished: boolean;
  };
}

export const TaskInput = observer(({ task }: TaskProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(task.time);
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [nameValue, setNameValue] = useState(task.name);

  const startTimer = () => {
    if (!isTimerRunning && !task.isFinished) {
      setIsTimerRunning(true);
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      setIsTimerRunning(false);
    }
  };

  const handleEditClick = () => {
    if (!task.isFinished) {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(e.target.value);
  };

  const handleBlur = () => {
    taskStore.updateTaskName(task.id, nameValue);
    setIsEditing(false);
  };

  const handleFinish = () => {
    pauseTimer();
    taskStore.finishTask(task.id); // обновим статус в сторе
  };
  const handleDeleted = () => {
    pauseTimer();
    taskStore.deleteTask(task.id); // удалить статус в сторе
  };

  useEffect(() => {
    taskStore.updateTaskTime(task.id, timeElapsed);
  }, [timeElapsed]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <button className={styles.finishButton} onClick={handleDeleted}>
          X
        </button>
        <div className={styles.wrapper}>
          {isEditing && !task.isFinished ? (
            <input
              type='text'
              value={nameValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={styles.input}
              autoFocus
            />
          ) : (
            <span className={styles.name}>{nameValue}</span>
          )}
          {!task.isFinished && (
            <button onClick={handleEditClick} className={styles.icon}>
              ✏️
            </button>
          )}
        </div>
      </div>

      <div className={styles.timer}>
        <span>
          {String(Math.floor(timeElapsed / 3600)).padStart(2, '0')}:
          {String(Math.floor((timeElapsed % 3600) / 60)).padStart(2, '0')}:
          {String(timeElapsed % 60).padStart(2, '0')}
        </span>

        <div className={styles.timerControls}>
          {!task.isFinished && (
            <>
              {!isTimerRunning ? (
                <button onClick={startTimer} className={styles.timerButton}>
                  <Play size={20} />
                </button>
              ) : (
                <button onClick={pauseTimer} className={styles.timerButton}>
                  <Pause size={20} />
                </button>
              )}
            </>
          )}
          {!task.isFinished && (
            <button onClick={handleFinish} className={styles.finishButton}>
              <Check size={20} />
            </button>
          )}
          {task.isFinished && (
            <span className={styles.finishedLabel}>
              <Check size={20} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

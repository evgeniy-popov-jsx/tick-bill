import { observer } from 'mobx-react-lite';
import { TaskInput } from '../../components/TaskInput';
import { taskStore } from '../../../stores/taskStore';
import { RateInput } from '../../components/RateInput';
import { TitleInput } from '../../components/TitleInput';
import { BadgeDollarSign, BadgeEuro, BadgeRussianRuble } from 'lucide-react';
import styles from './Home.module.css';
import { useTranslation } from 'react-i18next';

export const Home = observer(() => {
  const { t, i18n } = useTranslation();

  const handleAddTask = () => {
    taskStore.addTask(t('newTaskTitle'));
  };

  const handleLanguageChange = (language: 'en' | 'ru') => {
    taskStore.setLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logo}>TickBill</div>
        <div className={styles.buttons}>
          <button
            className={`${styles.btnLanguage} ${
              taskStore.language === 'en' ? styles.active : ''
            }`}
            onClick={() => handleLanguageChange('en')}
          >
            en
          </button>
          <button
            className={`${styles.btnLanguage} ${
              taskStore.language === 'ru' ? styles.active : ''
            }`}
            onClick={() => handleLanguageChange('ru')}
          >
            ru
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.description}>
          <span>
            {t('projectDescription')}{' '}
            <a href='https://boosty.to/evgeniy_popov' target='_blank'>
              {t('boostyLink')}
            </a>{' '}
            {t('gratitudeMessage')}
          </span>
        </div>

        <div className={styles.changeCoin}>
          <div className={styles.taskName}>{t('chooseCurrency')}</div>
          <div className={styles.wrapper}>
            <div className={styles.option}>
              <input
                type='radio'
                name='currency'
                value='usd'
                checked={taskStore.currency === 'usd'}
                onChange={() => taskStore.setCurrency('usd')}
                className={styles.input}
              />
              <div className={styles.btn}>
                <span className={styles.span}>$</span>
              </div>
            </div>

            <div className={styles.option}>
              <input
                type='radio'
                name='currency'
                value='eur'
                checked={taskStore.currency === 'eur'}
                onChange={() => taskStore.setCurrency('eur')}
                className={styles.input}
              />
              <div className={styles.btn}>
                <span className={styles.span}>€</span>
              </div>
            </div>

            <div className={styles.option}>
              <input
                type='radio'
                name='currency'
                value='rub'
                checked={taskStore.currency === 'rub'}
                onChange={() => taskStore.setCurrency('rub')}
                className={styles.input}
              />
              <div className={styles.btn}>
                <span className={styles.span}>₽</span>
              </div>
            </div>
          </div>
          <RateInput></RateInput>
        </div>

        <TitleInput></TitleInput>

        <div className={styles.taskManager}>
          <div className={styles.taskName}>{t('yourTasks')}</div>
          <div className={styles.tasks}>
            {taskStore.tasks.map((task) => (
              <TaskInput key={task.id} task={task} />
            ))}
          </div>
          <button className={styles.addedTask} onClick={handleAddTask}>
            {t('newTaskTitle')}
          </button>
        </div>

        <div className={styles.priceEnd}>
          <button
            className={styles.addedTask}
            onClick={() => taskStore.generatePDFReport()}
          >
            {t('generateReport')}
          </button>
          <div className={styles.endContainer}>
            <span>
              {t('earnedAmount')} {taskStore.currencyValue}
            </span>
            <div className={styles.coinWrapper}>
              <div className={styles.pixelCoin}>
                {taskStore.currency === 'usd' && <BadgeDollarSign size={20} />}
                {taskStore.currency === 'eur' && <BadgeEuro size={20} />}
                {taskStore.currency === 'rub' && <BadgeRussianRuble size={20} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

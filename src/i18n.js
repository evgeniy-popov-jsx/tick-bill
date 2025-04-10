import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: {
        projectDescription:
          'Наш проект абсолютно бесплатный, и пользоваться им может каждый! 🎮 Мы рады, что ты с нами! Если тебе нравится моя работа и ты хочешь поддержать её развитие (или просто угостить автора кофем ☕),',
        boostyLink: 'заглядывай на Boosty!',
        gratitudeMessage: 'Я буду благодарен за любую поддержку! 🏆💖',
        chooseCurrency: 'Выберите валюту:',
        yourRate: 'Ваша ставка:',
        projectReport: 'Отчёт для проекта:',
        yourTasks: 'Ваши задачи:',
        addNewTask: 'Добавить задачу',
        generateReport: 'Сформировать отчёт',
        earnedAmount: 'Вы заработали:',
        projectTitle: 'Мой проект',
        newTaskTitle: 'Новая задача',
        hour: 'час',
      },
    },
    en: {
      translation: {
        projectDescription:
          'Our project is completely free and anyone can use it! 🎮 We are happy to have you with us! If you like my work and want to support its development (or simply treat the author to a coffee ☕),',
        boostyLink: 'check out Boosty!',
        gratitudeMessage: 'I will be grateful for any support! 🏆💖',
        chooseCurrency: 'Choose your currency:',
        yourRate: 'Your rate:',
        projectReport: 'Project report:',
        yourTasks: 'Your tasks:',
        addNewTask: 'Add new task',
        generateReport: 'Generate report',
        earnedAmount: 'You earned:',
        projectTitle: 'My project',
        newTaskTitle: 'New task',
        hour: 'hour',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

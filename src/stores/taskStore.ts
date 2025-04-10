import { autorun, makeAutoObservable } from 'mobx';
import { jsPDF } from 'jspdf';
import i18n from 'i18next';

type Currency = 'eur' | 'usd' | 'rub';
type Language = 'ru' | 'en';

interface Task {
  id: string;
  name: string;
  time: number;
  currencyValue: number;
  isFinished: boolean;
}

class TaskStore {
  title = '';
  currency: Currency = 'eur';
  currencyValueOfHours: number = 0;
  tasks: Task[] = [];
  language: Language = 'en';

  constructor() {
    this.loadFromStorage();
    makeAutoObservable(this);
    autorun(() => {
      this.saveToStorage();
    });
  }

  setLanguage(language: Language) {
    this.language = language;
    i18n.changeLanguage(language);
  }

  getTranslation(key: string): string {
    return i18n.t(key);
  }

  get currencyValue(): number {
    const currencyPerSecond = this.currencyValueOfHours / 3600;
    const totalSeconds = this.tasks.reduce((sum, task) => sum + task.time, 0);
    return +(totalSeconds * currencyPerSecond).toFixed(2);
  }

  addTask(name: string) {
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      time: 0,
      currencyValue: 0,
      isFinished: false,
    };
    this.tasks.push(newTask);
  }

  setCurrencyValueOfHours(value: number) {
    if (this.currencyValueOfHours !== value) {
      this.currencyValueOfHours = value;
    }
  }

  updateTaskTime(id: string, time: number) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.time = time;
    }
  }

  updateTaskValue(id: string, value: number) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.currencyValue = value;
    }
  }

  updateTaskName(id: string, value: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.name = value;
    }
  }

  setTitle(title: string) {
    this.title = title;
  }

  setCurrency(currency: Currency) {
    this.currency = currency;
  }

  finishTask(id: string) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.isFinished = true;
    }
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  saveToStorage() {
    localStorage.setItem('tickbill_data', JSON.stringify(this));
  }

  loadFromStorage() {
    const data = localStorage.getItem('tickbill_data');
    if (data) {
      const parsed = JSON.parse(data);
      this.title = parsed.title;
      this.currency = parsed.currency || 'eur';
      this.tasks = parsed.tasks || [];
      this.currencyValueOfHours = parsed.currencyValueOfHours || 0;
    }
  }

  reset() {
    this.title = '';
    this.currency = 'eur';
    this.tasks = [];
    this.currencyValueOfHours = 0;
  }

  getTotalTimeFormatted(): string {
    const totalSeconds = this.tasks.reduce((sum, task) => sum + task.time, 0);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let formattedTime = '';

    if (days > 0) {
      formattedTime += `${days}d `;
    }
    if (hours > 0 || days > 0) {
      formattedTime += `${hours}h `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      formattedTime += `${minutes} min`;
    }

    return formattedTime || '0min';
  }

  convertTimeToHHMMSS(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Добавляем ведущие нули при необходимости
    const hh = hours < 10 ? '0' + hours : String(hours);
    const mm = minutes < 10 ? '0' + minutes : String(minutes);
    const ss = remainingSeconds < 10 ? '0' + remainingSeconds : String(remainingSeconds);

    return `${hh}:${mm}:${ss}`;
  }

  generatePDFReport() {
    const doc = new jsPDF();

    // Подключаем шрифт
    doc.addFont('fonts/rawline.ttf', 'rawline', 'normal');
    doc.setFont('rawline');

    // Получаем текущий язык
    const language = i18n.language;

    // Добавление заголовка
    this.addHeader(doc);

    // Добавляем таблицу в зависимости от языка
    const startY = 40; // Начальная Y позиция для первого блока
    const footerY =
      language === 'ru' ? this.addTableRU(doc, startY) : this.addTableEU(doc, startY); // Получаем Y для футера

    // Добавление итоговой суммы, если есть задачи
    if (this.tasks.length > 0) {
      doc.setFontSize(12);
      // Линия под заголовком
      doc.setLineWidth(0.5);
      doc.line(20, footerY, 190, footerY);

      const totalTimeText =
        language === 'ru'
          ? `Общее время: ${this.getTotalTimeFormatted()}`
          : `Total time: ${this.getTotalTimeFormatted()}`;
      const totalCostText =
        language === 'ru'
          ? `Общая стоимость: ${this.currencyValue} ${this.currency}`
          : `Total cost: ${this.currencyValue} ${this.currency}`;

      doc.text(totalTimeText, 20, footerY + 10);
      doc.text(totalCostText, 20, footerY + 16);
    }

    // Динамический футер
    this.addFooter(doc, footerY + 30);

    // Скачивание PDF
    doc.save(`${this.title}-report.pdf`);
  }

  // ЕС-стиль отчёта
  addTableEU(doc: jsPDF, startY: number): number {
    let y = startY;
    doc.setFontSize(14);
    doc.text('Tasks', 105, y, { align: 'center' });

    y += 5;
    this.tasks.forEach((task) => {
      // Проверка на выход за пределы страницы
      if (y > 270) {
        doc.addPage(); // Добавляем новую страницу
        y = 20; // Сброс Y на начало новой страницы
      }

      doc.setFontSize(12);
      doc.text(`${task.name}`, 20, y);
      const formattedTime = this.convertTimeToHHMMSS(task.time);
      doc.text(` | ${formattedTime}`, 169, y);
      y += 5;
    });

    return y; // Возвращаем координату для футера
  }

  // RU-стиль отчёта
  addTableRU(doc: jsPDF, startY: number): number {
    let y = startY;
    doc.setFontSize(16);
    doc.text('Задачи', 105, y, { align: 'center' });

    y += 10;
    this.tasks.forEach((task) => {
      // Проверка на выход за пределы страницы
      if (y > 270) {
        doc.addPage(); // Добавляем новую страницу
        y = 20; // Сброс Y на начало новой страницы
      }

      doc.setFontSize(12);
      doc.text(`${task.name}`, 20, y);
      const formattedTime = this.convertTimeToHHMMSS(task.time);
      doc.text(` | ${formattedTime}`, 169, y);
      y += 7;
    });

    return y; // Возвращаем координату для футера
  }

  // Заголовок отчёта с красивым оформлением
  addHeader(doc: jsPDF) {
    doc.setFontSize(18);
    doc.setFont('rawline');
    const headerText =
      i18n.language === 'ru'
        ? `${this.title} - Отчёт о задачах`
        : `${this.title} - Task Report`;
    doc.text(headerText, 105, 20, { align: 'center' });

    // Линия под заголовком
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
  }

  // Динамический футер
  addFooter(doc: jsPDF, y: number) {
    const footerText =
      i18n.language === 'ru'
        ? 'Данный отчёт был сгенерирован c помощью сервиса TickBill'
        : 'This report was generated by TickBill service';

    doc.setFontSize(10);
    doc.text(footerText, 20, y);
  }
}

export const taskStore = new TaskStore();

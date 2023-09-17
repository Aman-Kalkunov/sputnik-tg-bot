const getScheduleDate = (targetDayId, isWeightliftin) => {
  const today = new Date();
  const currentDay = today.getDay();
  let targetDay = currentDay === 0 ? targetDayId : targetDayId - currentDay;
  if (isWeightliftin && currentDay === 6) {
    targetDay = targetDayId + 1;
  }
  const targetDate = new Date(today.setDate(today.getDate() + targetDay));
  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();

  return `${day < 10 ? `0${day}` : day}.${
    month < 10 ? `0${month}` : month
  }.${year}`;
};

const getAvailableDays = (days, isWeightlifti) => {
  const today = new Date().getDay();
  if (today === 6 && isWeightlifti) {
    return days;
  }
  if (today !== 0) {
    return days.filter((day) => day.id >= today);
  }
  return days;
};

const days = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
const allTime = [
  ["7:00", "8:00"],
  ["9:00", "10:00"],
  ["11:00", "12:00"],
  ["13:00", "14:00"],
  ["15:00"],
  ["18:00", "19:00"],
  ["20:00"],
];

const infoOptions = [
  [
    { text: "О нас", callback_data: "about" },
    { text: "Расписание", callback_data: "timetable" },
  ],
  [
    { text: "Стоимость занятий", callback_data: "price" },
    { text: "Первая тренировка", callback_data: "firstTime" },
  ],
  [
    { text: "Акции", callback_data: "promotions" },
    { text: "Контакты", callback_data: "contacts" },
  ],
  [{ text: "Задать вопрос", callback_data: "question" }],
];
const workoutType = [
  [{ text: "Кроссфит", callback_data: "crossfit" }],
  [{ text: "Тяжелая атлетика", callback_data: "weightlifting" }],
  [{ text: "Stretching", callback_data: "stretching" }],
  [{ text: "Пробная бесплатная тренировка", callback_data: "free" }],
];

const workoutTypeOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: workoutType,
  }),
};

const infoCommandOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: infoOptions,
  }),
};

const weightliftingTime = ["17:00"];

const stretchingTime = [[{ text: "9:00", callback_data: `scheduleTime~9:00` }]];

const stretchingNightTime = [
  [{ text: "19:00", callback_data: `scheduleTime~19:00` }],
];

const scheduleAllDay = [
  { id: 1, day: days[1], date: `${getScheduleDate(1)}` },
  { id: 2, day: days[2], date: `${getScheduleDate(2)}` },
  { id: 3, day: days[3], date: `${getScheduleDate(3)}` },
  { id: 4, day: days[4], date: `${getScheduleDate(4)}` },
  { id: 5, day: days[5], date: `${getScheduleDate(5)}` },
  { id: 6, day: days[6], date: `${getScheduleDate(6)}` },
];

const stretchingDay = [
  { id: 2, day: days[2], date: `${getScheduleDate(2)}` },
  { id: 6, day: days[6], date: `${getScheduleDate(6)}` },
];

const weightliftingDay = [
  { id: 1, day: days[1], date: `${getScheduleDate(1, true)}` },
  { id: 3, day: days[3], date: `${getScheduleDate(3, true)}` },
  { id: 5, day: days[5], date: `${getScheduleDate(5, true)}` },
];

const scheduleAllDayOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: getAvailableDays(scheduleAllDay).map((day) => {
      return [
        {
          text: `${day.day} ${day.date}`,
          callback_data: `scheduleDay:${day.id}`,
        },
      ];
    }),
  }),
};

const stretchingDayOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: getAvailableDays(stretchingDay).map((day) => {
      return [
        {
          text: `${day.day} ${day.date}`,
          callback_data: `scheduleDay:${day.id}`,
        },
      ];
    }),
  }),
};

const weightliftingDayOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: getAvailableDays(weightliftingDay, true).map((day) => {
      return [
        {
          text: `${day.day} ${day.date}`,
          callback_data: `scheduleDay:${day.id}`,
        },
      ];
    }),
  }),
};

const timeOptions = () => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: allTime.map((row) => {
        return row.map((time) => {
          return {
            text: time,
            callback_data: `scheduleTime~${time}`,
          };
        });
      }),
    }),
  };
};

const stretchingTimeOptions = (nightTime) => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: nightTime ? stretchingNightTime : stretchingTime,
    }),
  };
};

const weightliftingTimeOptions = () => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: weightliftingTime.map((time) => {
        return [
          {
            text: time,
            callback_data: `scheduleTime~${time}`,
          },
        ];
      }),
    }),
  };
};

module.exports = {
  infoCommandOptions,
  workoutTypeOptions,
  scheduleAllDayOptions,
  weightliftingDayOptions,
  stretchingDayOptions,
  timeOptions,
  weightliftingTimeOptions,
  stretchingTimeOptions,
  days,
};

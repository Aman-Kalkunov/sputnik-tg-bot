const TelegramApi = require("node-telegram-bot-api");
const adminId = 1991291074;
const token = "6580839606:AAFH19wqumqjaULUFP2Q2eXAvBT6LqEcHHA";
const {
  startText,
  promotionsText,
  firstTimeText,
  priceText,
  contactsText,
  questionText,
  workoutNames,
} = require("./constans/text-constant");

const {
  workoutTypeOptions,
  weightliftingDayOptions,
  stretchingDayOptions,
  timeOptions,
  weightliftingTimeOptions,
  stretchingTimeOptions,
  scheduleAllDayOptions,
  infoCommandOptions,
  days,
} = require("./constans/options-constant");

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/info", description: "Информация" },
  { command: "/schedule", description: "Записаться" },
]);

const getUserName = (user) => {
  const name = user.first_name;
  const lastName = user.last_name || "";
  const username = user.username ? `@${user.username}` : "";

  const fullName = `${lastName} ${name} ${username}`;
  return fullName.trim();
};
const sayHello = (currentChatId) => bot.sendMessage(currentChatId, startText);

const questionHandler = (message, userId) => {
  const text = `Пользователь ${getUserName(message.chat)} задал вопрос:

${message.text}`;

  bot.sendMessage(adminId, text);
  bot.removeListener("message");
};

const scheduleHandler = (query, id, workoutName) => {
  if (query.data.includes("scheduleTime")) {
    bot.answerCallbackQuery(query.id);
    bot.removeListener("callback_query");

    const time = query.data.split("~")[1];
    const currentChatId = query.message.chat.id;

    return bot
      .sendMessage(
        adminId,
        `${getUserName(query.from)} записался на ${
          workoutNames[workoutName]
        }: ${days[id]} - ${time}`
      )
      .then(() => {
        bot.sendMessage(
          currentChatId,
          `Вы записаны на ${workoutNames[workoutName]}: ${days[id]} - ${time}`
        );
      });
  }
};

const scheduleDayHandler = (query, currentChatId, timeOptions, workoutName) => {
  if (query.data.includes("scheduleDay")) {
    bot.answerCallbackQuery(query.id);
    bot.removeAllListeners("callback_query");

    const id = query.data.split(":")[1];

    const isNightTime = workoutName === "stretching" && id == 2;
    const options = timeOptions(isNightTime);

    bot.sendMessage(currentChatId, "Доступное время", options).then(() => {
      bot.addListener("callback_query", (query) =>
        scheduleHandler(query, id, workoutName)
      );
    });
  }
};

bot.onText(/\/start/, (message) => {
  const currentChatId = message.chat.id;
  sayHello(currentChatId);
});

bot.onText(/\/info/, (message) => {
  bot.removeListener("callback_query");
  const currentChatId = message.chat.id;

  bot.sendMessage(currentChatId, "Информация", infoCommandOptions).then(() => {
    bot.addListener("callback_query", (query) => {
      const currentChatId = query.message.chat.id;
      const data = query.data;

      if (data === "about") {
        bot.answerCallbackQuery(query.id);
        sayHello(currentChatId);
      }
      if (data === "price") {
        bot.answerCallbackQuery(query.id);
        bot.sendPhoto(currentChatId, "./assets/price.jpg", {
          caption: priceText,
        });
      }
      if (data === "timetable") {
        bot.answerCallbackQuery(query.id);
        bot.sendPhoto(currentChatId, "./assets/timetable.jpg");
      }
      if (data === "promotions") {
        bot.answerCallbackQuery(query.id);
        bot.sendMessage(currentChatId, promotionsText);
      }
      if (data === "firstTime") {
        bot.answerCallbackQuery(query.id);
        bot.sendPhoto(currentChatId, "./assets/firstTime.jpg", {
          caption: firstTimeText,
        });
      }
      if (data === "contacts") {
        bot.answerCallbackQuery(query.id);
        bot.sendMessage(currentChatId, contactsText);
      }
      if (data === "question") {
        bot.answerCallbackQuery(query.id);
        bot.removeListener("callback_query");
        bot.sendMessage(currentChatId, questionText).then(() => {
          bot.addListener("message", (message) =>
            questionHandler(message, currentChatId)
          );
        });
      }
    });
  });
});

bot.onText(/\/schedule/, (message) => {
  const currentChatId = message.chat.id;
  bot
    .sendMessage(currentChatId, "Выберите тип тренировки", workoutTypeOptions)
    .then(() => {
      bot.addListener("callback_query", (query) => {
        const currentChatId = query.message.chat.id;
        const data = query.data;

        if (data === "crossfit") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");

          bot
            .sendMessage(currentChatId, "Доступные дни", scheduleAllDayOptions)
            .then(() => {
              bot.addListener("callback_query", (query) =>
                scheduleDayHandler(
                  query,
                  currentChatId,
                  timeOptions,
                  "crossfit"
                )
              );
            });
        }
        if (data === "weightlifting") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");

          bot
            .sendMessage(
              currentChatId,
              "Доступные дни",
              weightliftingDayOptions
            )
            .then(() => {
              bot.addListener("callback_query", (query) =>
                scheduleDayHandler(
                  query,
                  currentChatId,
                  weightliftingTimeOptions,
                  "weightlifting"
                )
              );
            });
        }
        if (data === "stretching") {
          bot.answerCallbackQuery(query.id);
          bot.removeAllListeners("callback_query");

          bot
            .sendMessage(currentChatId, "Доступные дни", stretchingDayOptions)
            .then(() => {
              bot.addListener("callback_query", (query) =>
                scheduleDayHandler(
                  query,
                  currentChatId,
                  stretchingTimeOptions,
                  "stretching"
                )
              );
            });
        }
        if (data === "free") {
          bot.removeAllListeners("callback_query");

          bot
            .sendMessage(currentChatId, "Доступные дни", scheduleAllDayOptions)
            .then(() => {
              bot.addListener("callback_query", (query) =>
                scheduleDayHandler(query, currentChatId, timeOptions, "free")
              );
            });
        }
      });
    });
});

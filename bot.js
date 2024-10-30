import fetch from 'node-fetch';
import Parser from 'rss-parser';

const parser = new Parser();
const TELEGRAM_BOT_TOKEN = 'TOKEN'
const CHAT_ID = '1337' // id себя или группы, где бот находится.
const RSS_URL = 'https://site.com/rss.xml'

// Функция для отправки сообщений в Telegram с кнопкой
async function sendTelegramMessage(message, link) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const params = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Смотреть на сайте',
          url: link,
        },
      ]],
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json(); // Получение JSON-ответа

    if (!response.ok) {
      console.error('Ошибка отправки сообщения:', data);
    } else {
      console.log('Сообщение успешно отправлено:', data);
    }
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

// Функция для проверки RSS и отправки новых постов
async function checkRSSFeed() {
  try {
    const feed = await parser.parseURL(RSS_URL);
    console.log("Полученные данные RSS:", feed);

  if (!feed.items || feed.items.length === 0) {
  console.log("Нет новых постов.");
  return;
}

    const latestPost = feed.items[0];
    const datePublished = new Date(latestPost.pubDate).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const message = `Новый пост на сайте <b>АП!</b>\n\n👉 <b>${latestPost.title}</b>\n<i>${latestPost.contentSnippet || 'Описание отсутствует'}</i>\n\n👀 ${datePublished}`;
    console.log("Сообщение для отправки:", message);
    await sendTelegramMessage(message, latestPost.link);
  } catch (error) {
    console.error('Ошибка чтения RSS:', error);
  }
}

// Запуск функции для проверки
checkRSSFeed();


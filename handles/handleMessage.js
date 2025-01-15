const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');
const config = require('../config.json');

const commands = new Map();

fs.readdirSync(path.join(__dirname, '../commands'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const command = require(`../commands/${file}`);
    commands.set(command.name.toLowerCase(), command);
  });

async function handleMessage(event, pageAccessToken) {
  const senderId = event?.sender?.id;
  if (!senderId) return console.error('Invalid event object');

  const messageText = event?.message?.text?.trim();
  if (!messageText) return console.log('Received event without message text');

  const [commandName, ...args] = messageText.startsWith(config.prefix)
    ? messageText.slice(config.prefix.length).split(' ')
    : messageText.split(' ');

  try {
    if (commands.has(commandName.toLowerCase())) {
      const isAdmin = config.adminIds.includes(senderId);
      await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, sendMessage, isAdmin);
    } else {
      await commands.get('gpt4').execute(senderId, [messageText], pageAccessToken);
    }
  } catch (error) {
    console.error(`Error executing command:`, error);
    await sendMessage(senderId, { text: error.message || config.messageSettings.defaultResponse }, pageAccessToken);
  }
}

module.exports = { handleMessage };

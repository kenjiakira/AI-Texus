const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');

const adminId = '8522020297887049'; 

const commands = new Map();
const prefix = '-';

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

  const [commandName, ...args] = messageText.startsWith(prefix)
    ? messageText.slice(prefix.length).split(' ')
    : messageText.split(' ');

  try {
    if (senderId === adminId) {
      console.log(`Admin (${senderId}) executed command: ${commandName}`);

      if (commands.has(commandName.toLowerCase())) {
        await commands.get(commandName.toLowerCase()).execute(senderId, args, pageAccessToken, sendMessage);
      } else {
        await commands.get('gpt4').execute(senderId, [messageText], pageAccessToken);
      }
    } else {

      await sendMessage(senderId, { text: 'Bạn không có quyền thực hiện lệnh này.' }, pageAccessToken);
    }
  } catch (error) {
    console.error(`Error executing command:`, error);
    await sendMessage(senderId, { text: error.message || 'There was an error executing that command.' }, pageAccessToken);
  }
}

module.exports = { handleMessage };

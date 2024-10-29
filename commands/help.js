const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Hiện các lệnh có sẵn',
  usage: 'help\nhelp [tên lệnh]',
  author: 'Hệ thống',
  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const commandFile = commandFiles.find(file => {
        const command = require(path.join(commandsDir, file));
        return command.name.toLowerCase() === commandName;
      });

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        const commandDetails = `
━━━━━━━━━━━━━━
Tên lệnh: ${command.name}
Mô tả: ${command.description}
Cách Dùng: ${command.usage}
━━━━━━━━━━━━━━`;
        
        sendMessage(senderId, { text: commandDetails }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `Lệnh "${commandName}" không tồn tại.` }, pageAccessToken);
      }
      return;
    }

    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `│ - ${command.name}`;
    });

    const helpMessage = `
━━━━━━━━━━━━━━
Các lệnh có sẵn:
╭─╼━━━━━━━━╾─╮
${commands.join('\n')}
╰─━━━━━━━━━╾─╯
Gõ -help [name] 
Để xem cách sử dụng lệnh.
━━━━━━━━━━━━━━`;

    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
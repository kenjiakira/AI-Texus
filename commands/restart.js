const { exec } = require('child_process');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');
const { adminId } = require('..//handles/handleMessage'); // Đường dẫn đến file handleMessage của bạn

module.exports = {
  name: 'restart',
  description: 'Khởi động lại bot.',
  usage: 'restart',
  author: 'Hệ thống',
  async execute(senderId, args, pageAccessToken) {

    if (senderId !== adminId) {
      await sendMessage(senderId, { text: 'Bạn không có quyền thực hiện lệnh này.' }, pageAccessToken);
      return;
    }

    await sendMessage(senderId, { text: 'Bot đang khởi động lại...' }, pageAccessToken);

    exec('node index.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error restarting bot: ${error}`);
        return;
      }
      console.log(`Bot restarted successfully: ${stdout}`);
    });

    process.exit(0);
  }
};

const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'restart',
  description: 'Khởi động lại bot.',
  usage: 'restart',
  author: 'Hệ thống',
  execute(senderId, args, pageAccessToken, isAdmin) {
    if (!isAdmin) {
      sendMessage(senderId, { text: 'Bạn không có quyền truy cập lệnh này.' }, pageAccessToken);
      return;
    }

    sendMessage(senderId, { text: 'Bot đang khởi động lại, vui lòng đợi...' }, pageAccessToken);

    setTimeout(() => {
      console.log('Bot đang khởi động lại...');
      process.exit(); 
    }, 3000);
  }
};

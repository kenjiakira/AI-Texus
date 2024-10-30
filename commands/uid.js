const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'uid',
  description: 'Xem UID của bạn',
  usage: 'uid',
  author: 'Hệ thống',
  execute(senderId, args, pageAccessToken) {
    const responseMessage = `
━━━━━━━━━━━━━━
UID của bạn là: ${senderId}
━━━━━━━━━━━━━━`;

    sendMessage(senderId, { text: responseMessage }, pageAccessToken);
  }
};

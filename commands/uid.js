const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'uid',
  description: 'Xem UID của bạn',
  usage: 'uid',
  author: 'Hệ thống',
  async execute({ event, send }) {

    const userId = event.sender.id; 

    const responseMessage = `
━━━━━━━━━━━━━━
UID của bạn là: ${userId}
━━━━━━━━━━━━━━`;

    return send(responseMessage);
  }
};

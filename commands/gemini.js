const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gemini',
  description: 'Tương tác với Google Gemini',
  usage: 'gemini [tin nhắn của bạn]',
  author: 'coffee',
  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Cách sử dụng: gemini <tin nhắn của bạn>" }, pageAccessToken);

    try {
      const { data } = await axios.get(`https://joshweb.click/gemini?prompt=${encodeURIComponent(prompt)}`);
      sendMessage(senderId, { text: data.gemini }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'Lỗi khi tạo phản hồi. Vui lòng thử lại sau.' }, pageAccessToken);
    }
  }
};

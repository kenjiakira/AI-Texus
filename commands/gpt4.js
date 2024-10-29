const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Tương tác với GPT-4o',
  usage: 'gpt4 [tin nhắn của bạn]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) return sendMessage(senderId, { text: "Cách sử dụng: gpt4 <câu hỏi>" }, pageAccessToken);

    try {
      const { data: { result } } = await axios.get(`https://joshweb.click/api/gpt-4o?q=${encodeURIComponent(prompt)}&uid=${senderId}`);
      sendMessage(senderId, { text: result }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'Đã xảy ra lỗi khi tạo nội dung. Vui lòng thử lại sau.' }, pageAccessToken);
    }
  }
};

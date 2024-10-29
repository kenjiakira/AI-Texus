const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'spotify',
  description: 'Tìm kiếm và phát bài hát trên Spotify.',
  usage: 'spotify [tên bài hát]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    try {
      const { data } = await axios.get(`https://hiroshi-api.onrender.com/tiktok/spotify?search=${encodeURIComponent(args.join(' '))}`);
      const link = data[0]?.download;

      sendMessage(senderId, link ? {
        attachment: { type: 'audio', payload: { url: link, is_reusable: true } }
      } : { text: 'Xin lỗi, không tìm thấy liên kết Spotify cho truy vấn đó.' }, pageAccessToken);
    } catch {
      sendMessage(senderId, { text: 'Xin lỗi, đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn.' }, pageAccessToken);
    }
  }
};

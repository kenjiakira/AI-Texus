const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'lyrics',
  description: 'Lấy lời bài hát',
  usage: 'lyrics [tên bài hát]',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    try {
      const { data: { result } } = await axios.get(`https://joshweb.click/search/lyrics?q=${encodeURIComponent(args.join(' '))}`);
      if (result?.lyrics) {
        const messages = splitMessage(result.title, result.artist, result.lyrics, 2000);
        messages.forEach(message => sendMessage(senderId, { text: message }, pageAccessToken));
        if (result.image) sendMessage(senderId, { attachment: { type: 'image', payload: { url: result.image, is_reusable: true } } }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: 'Xin lỗi, không tìm thấy lời bài hát cho truy vấn của bạn.' }, pageAccessToken);
      }
    } catch {
      sendMessage(senderId, { text: 'Xin lỗi, đã xảy ra lỗi trong quá trình xử lý yêu cầu của bạn.' }, pageAccessToken);
    }
  }
};

const splitMessage = (title, artist, lyrics, chunkSize) => {
  const message = `Tiêu đề: ${title}\nNghệ sĩ: ${artist}\n\n${lyrics}`;
  return Array.from({ length: Math.ceil(message.length / chunkSize) }, (_, i) => message.slice(i * chunkSize, (i + 1) * chunkSize));
};

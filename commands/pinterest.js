const axios = require('axios');
const fs = require('fs');
const { sendMessage } = require('../handles/sendMessage');

const tokenPath = './token.txt';
const pageAccessToken = fs.readFileSync(tokenPath, 'utf8').trim();

module.exports = {
  name: 'pinterest',
  description: 'Tìm kiếm hình ảnh trên Pinterest.',
  usage: '-pinterest từ khóa -số lượng',
  author: 'coffee',

  async execute(senderId, args) {
    // Đảm bảo args được định nghĩa và là một mảng, mặc định là một chuỗi rỗng nếu không
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Vui lòng cung cấp truy vấn tìm kiếm.' }, pageAccessToken);
      return;
    }

    // Xử lý trường hợp người dùng cung cấp truy vấn tìm kiếm và số lượng hình ảnh tùy chọn
    const match = args.join(' ').match(/(.+)-(\d+)$/);
    const searchQuery = match ? match[1].trim() : args.join(' ');
    let imageCount = match ? parseInt(match[2], 10) : 5;

    // Đảm bảo số lượng người dùng yêu cầu nằm trong khoảng 1 đến 20
    imageCount = Math.max(1, Math.min(imageCount, 20));

    try {
      const { data } = await axios.get(`https://hiroshi-api.onrender.com/image/pinterest?search=${encodeURIComponent(searchQuery)}`);

      // Giới hạn số lượng hình ảnh theo yêu cầu của người dùng
      const selectedImages = data.data.slice(0, imageCount);

      if (selectedImages.length === 0) {
        await sendMessage(senderId, { text: `Không tìm thấy hình ảnh cho "${searchQuery}".` }, pageAccessToken);
        return;
      }

      // Gửi mỗi hình ảnh trong một tin nhắn riêng biệt
      for (const url of selectedImages) {
        const attachment = {
          type: 'image',
          payload: { url }
        };
        await sendMessage(senderId, { attachment }, pageAccessToken);
      }

    } catch (error) {
      console.error('Lỗi:', error);
      await sendMessage(senderId, { text: 'Lỗi: Không thể lấy hình ảnh.' }, pageAccessToken);
    }
  }
};

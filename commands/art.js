const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  
  name: 'art',  
  description: 'Tạo ảnh AI từ Prompt của bạn', 
  usage: '/generateImage [prompt]', 
  author: 'MakoyQx',  

  async execute(senderId, args, pageAccessToken) {
   
    if (!args || args.length === 0) {
    
      await sendMessage(senderId, {
        text: '❌ Vui lòng nhập Prompt\n\nVí dụ: Art Chó , Mèo V..v.'
      }, pageAccessToken);
      return;  
    }

    const prompt = args.join(' ');
    const apiUrl = `https://joshweb.click/api/art?prompt=${encodeURIComponent(prompt)}`;  

    await sendMessage(senderId, { text: '⌛ Đang tạo ảnh , Đợi chút....' }, pageAccessToken);

    try {
      
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl  
          }
        }
      }, pageAccessToken);

    } catch (error) {
     
      console.error('Error generating image:', error);
      
      await sendMessage(senderId, {
        text: 'Có lỗi gì đó đã xảy ra vui lòng thử lại sau nha.'
      }, pageAccessToken);
    }
  }
};
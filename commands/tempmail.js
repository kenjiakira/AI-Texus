const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const domains = ["rteet.com", "1secmail.com", "1secmail.org", "1secmail.net", "wwjmp.com", "esiix.com", "xojxe.com", "yoggm.com"];

module.exports = {
  name: 'tempmail',
  description: 'Tạo email tạm thời và kiểm tra hộp thư đến',
  usage: '-tempmail gen HOẶC -tempmail inbox <email>',
  author: 'coffee',

  async execute(senderId, args, pageAccessToken) {
    const [cmd, email] = args;
    if (cmd === 'gen') {
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return sendMessage(senderId, { text: `📧 | Email Tạm Thời: ${Math.random().toString(36).slice(2, 10)}@${domain}` }, pageAccessToken);
    }

    if (cmd === 'inbox' && email && domains.some(d => email.endsWith(`@${d}`))) {
      try {
        const [username, domain] = email.split('@');
        const inbox = (await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`)).data;
        if (!inbox.length) return sendMessage(senderId, { text: 'Hộp thư đến trống.' }, pageAccessToken);

        const { id, from, subject, date } = inbox[0];
        const { textBody } = (await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${domain}&id=${id}`)).data;
        return sendMessage(senderId, { text: `📬 | Email Mới Nhất:\nTừ: ${from}\nChủ Đề: ${subject}\nNgày: ${date}\n\nNội Dung:\n${textBody}` }, pageAccessToken);
      } catch {
        return sendMessage(senderId, { text: 'Lỗi: Không thể lấy hộp thư hoặc nội dung email.' }, pageAccessToken);
      }
    }

    sendMessage(senderId, { text: 'Sử dụng không hợp lệ. Sử dụng -tempmail gen hoặc -tempmail inbox <email>' }, pageAccessToken);
  },
};

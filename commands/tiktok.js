const axios = require('axios'); 
const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage'); 

let is_url = (url) => /^http(s)?:\/\//.test(url);

let stream_url = async (url, type) => {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join(__dirname, 'cache', `${Date.now()}.${type}`);
    fs.writeFileSync(filePath, res.data);
    setTimeout(() => fs.unlinkSync(filePath), 1000 * 60);
    return fs.createReadStream(filePath);
  } catch (error) {
    console.error("Lỗi khi tải tệp từ URL:", error);
    throw new Error("Không thể tải tệp từ URL");
  }
};

module.exports = {
  name: "tiktok",
  description: "Tải nội dung từ TikTok thông qua URL.",
  usage: "tiktok <url>",
  author: "Hệ thống",
  async execute({ api, args = [] }) {
    
    if (!Array.isArray(args)) {
      return sendMessage({ text: "❌ Đã xảy ra lỗi với đối số. Vui lòng thử lại." });
    }

    if (args.length === 0) {
      return sendMessage({ text: "⚠️ Vui lòng cung cấp URL TikTok. 📲" });
    }

    const url = args.join(" ").trim();

    if (!is_url(url)) {
      return sendMessage({ text: "❌ Vui lòng cung cấp URL hợp lệ. 🌐" });
    }

    if (/tiktok\.com/.test(url)) {
      try {
        const res = await axios.post(`https://www.tikwm.com/api/`, { url });

        if (res.data.code !== 0) {
          return sendMessage({ text: "⚠️ Không thể tải nội dung từ URL này. 😢" });
        }

        const tiktok = res.data.data;
        let attachment = [];

        if (Array.isArray(tiktok.images)) {
          for (let imageUrl of tiktok.images) {
            attachment.push(await stream_url(imageUrl, 'jpg'));
          }
        } else {
          attachment.push(await stream_url(tiktok.play, 'mp4'));
        }

        sendMessage({
          body: `🎉==[ TIKTOK DOWNLOAD ]==🎉\n\n🎬 **Tiêu đề**: ${tiktok.title}\n❤️ **Lượt thích**: ${tiktok.digg_count}\n👤 **Tác giả**: ${tiktok.author.nickname}\n🆔 **ID TikTok**: ${tiktok.author.unique_id}`,
          attachment
        });

      } catch (error) {
        console.error("Lỗi trong quá trình xử lý:", error);
        return sendMessage({ text: "❌ Đã xảy ra lỗi khi xử lý yêu cầu của bạn. 😥" });
      }
    } else {
      return sendMessage({ text: "⚠️ Vui lòng cung cấp URL TikTok hợp lệ. 📲" });
    }
  }
};

const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: "wikipedia",
    description: "Tra cứu thông tin từ Wikipedia.",
    usage: "wikipedia [từ khóa]",
    author: "Hệ thống",
    async execute(senderId, args, pageAccessToken) {
        const searchTerm = args.join(" ") || null;

        try {
            if (!searchTerm) {
                const randomWikiArticle = await fetchRandomWikiArticle();
                if (randomWikiArticle) {
                    await sendMessage(senderId, {
                        text: `📚 Wikipedia: ${randomWikiArticle.title}\n\n${randomWikiArticle.extract}\n\nĐọc thêm: ${randomWikiArticle.url}\n\nBạn có thể tìm thêm thông tin bằng cách nhập wiki 'từ khóa'.`,
                       
                        attachment: {
                            type: 'image',
                            payload: {
                                url: randomWikiArticle.image 
                            }
                        }
                    }, pageAccessToken);
                } else {
                    await sendMessage(senderId, { text: "Không thể tìm thấy thông tin ngẫu nhiên từ Wikipedia vào lúc này." }, pageAccessToken);
                }
            } else {
                const apiUrl = `https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
                const response = await axios.get(apiUrl);
                const wikiData = response.data;
                if (wikiData.title && wikiData.extract) {
                    const imageUrl = wikiData.thumbnail ? wikiData.thumbnail.source : null;
                    const message = `📚 Wikipedia: ${wikiData.title}\n\n${wikiData.extract}\n\nĐọc thêm: ${wikiData.content_urls.desktop.page}`;

                    if (imageUrl) {
                        await sendMessage(senderId, { text: message, attachment: { type: 'image', payload: { url: imageUrl } } }, pageAccessToken);
                    } else {
                       
                        await sendMessage(senderId, { text: message }, pageAccessToken);
                    }
                    return;
                } else {
                    await sendMessage(senderId, { text: "Không tìm thấy thông tin từ khóa này trên Wikipedia." }, pageAccessToken);
                    return;
                }
            }
        } catch (error) {
            await sendMessage(senderId, { text: error.message }, pageAccessToken);
        }
    }
};

async function fetchRandomWikiArticle(retries = 3) {
    const apiUrl = `https://vi.wikipedia.org/api/rest_v1/page/random/summary`;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(apiUrl);
            const wikiData = response.data;
            if (wikiData.title && wikiData.extract) {
                const imageUrl = wikiData.thumbnail ? wikiData.thumbnail.source : null;
                return {
                    title: wikiData.title,
                    extract: wikiData.extract,
                    url: wikiData.content_urls.desktop.page,
                    image: imageUrl
                };
            } else {
                return null;
            }
        } catch (error) {
            if (attempt === retries) {
                throw new Error("Không thể truy xuất thông tin từ Wikipedia vào lúc này. Vui lòng thử lại sau.");
            }
            console.error(`Lỗi khi truy xuất thông tin: ${error.message}. Thử lại lần ${attempt}`);
            await delay(2000);
        }
    }
}

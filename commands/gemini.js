const { GoogleGenerativeAI } = require('@google/generative-ai');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: 'gemini',
    description: 'Chat with Gemini AI',
    usage: 'Just type your message',
    author: 'coffee',

    async execute(senderId, args, pageAccessToken) {
        if (!args || args.length === 0) {
            await sendMessage(senderId, { text: 'Vui lòng nhập nội dung tin nhắn.' }, pageAccessToken);
            return;
        }

        const message = args.join(' ');
        
        try {
            let ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            try {
                const model = ai.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(message);
                const response = await result.response;
                await sendMessage(senderId, { text: response.text() }, pageAccessToken);
            } catch (primaryError) {
                console.log("Primary API key failed, trying backup...");
                ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_BACKUP);
                const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(message);
                const response = await result.response;
                await sendMessage(senderId, { text: response.text() }, pageAccessToken);
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            await sendMessage(senderId, { text: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn.' }, pageAccessToken);
        }
    }
};
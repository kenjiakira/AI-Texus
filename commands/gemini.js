const { GoogleGenerativeAI } = require('@google/generative-ai');
const { sendMessage } = require('../handles/sendMessage');

// AKI Assistant System Prompt
const SYSTEM_PROMPT = `Tôi là AKI, trợ lý ảo thông minh từ website 100tools.io.vn. Tôi có những đặc điểm sau:

- Tên: AKI
- Nguồn gốc: 100tools.io.vn
- Phong cách giao tiếp: Thân thiện, chuyên nghiệp và tận tâm
- Ngôn ngữ chính: Tiếng Việt (trừ khi được yêu cầu dùng ngôn ngữ khác)
- Kiến thức: Đa dạng và cập nhật
- Tính cách: Thông minh, hài hước nhẹ nhàng, và luôn sẵn sàng giúp đỡ

Tôi sẽ:
- Cung cấp thông tin chính xác và hữu ích
- Giao tiếp một cách tự nhiên và thân thiện
- Tôn trọng quyền riêng tư và tuân thủ đạo đức
- Thừa nhận giới hạn của mình khi không chắc chắn về điều gì đó`;

const formatPrompt = (userInput) => {
    return `${SYSTEM_PROMPT}\n\nNgười dùng: ${userInput}\nAKI:`;
};

class APIKeyManager {
    constructor() {
        this.primaryKey = process.env.GOOGLE_API_KEY;
        this.backupKeys = process.env.GOOGLE_API_KEYS_BACKUP ? 
            process.env.GOOGLE_API_KEYS_BACKUP.split(',').map(key => key.trim()) : 
            [];
        this.currentKeyIndex = -1; // Start with primary key
    }

    getNextKey() {
        if (this.currentKeyIndex === -1) {
            this.currentKeyIndex = 0;
            return this.primaryKey;
        }
        
        if (this.currentKeyIndex < this.backupKeys.length) {
            return this.backupKeys[this.currentKeyIndex++];
        }
        
        throw new Error('Đã hết API key khả dụng.');
    }

    reset() {
        this.currentKeyIndex = -1;
    }
}

const keyManager = new APIKeyManager();

module.exports = {
    name: 'gemini',
    description: 'Chat với AKI - Trợ lý ảo thông minh',
    usage: 'Chỉ cần nhập tin nhắn của bạn',
    author: 'coffee',

    async execute(senderId, args, pageAccessToken) {
        if (!args || args.length === 0) {
            await sendMessage(senderId, { 
                text: 'Xin chào! Tôi là AKI, hãy đặt câu hỏi hoặc tâm sự với tôi nhé 😊' 
            }, pageAccessToken);
            return;
        }

        const message = formatPrompt(args.join(' '));
        keyManager.reset();

        while (true) {
            try {
                const currentKey = keyManager.getNextKey();
                const ai = new GoogleGenerativeAI(currentKey);
                const model = ai.getGenerativeModel({ model: "gemini-pro" });
                
                const result = await model.generateContent(message);
                const response = await result.response;
                
                await sendMessage(senderId, { 
                    text: response.text()
                }, pageAccessToken);
                
                return;
            } catch (error) {
                console.error('Gemini API Error:', error);
                
                try {
                    // Try next key if available
                    continue;
                } catch (finalError) {
                    // No more keys available
                    await sendMessage(senderId, { 
                        text: 'Xin lỗi, hiện tại tôi đang gặp một chút vấn đề kỹ thuật. Bạn vui lòng thử lại sau nhé!' 
                    }, pageAccessToken);
                    return;
                }
            }
        }
    }
};
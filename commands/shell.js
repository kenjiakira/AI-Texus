const { exec } = require('child_process');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
    name: 'run',
    description: 'Chạy một lệnh shell (chỉ dành cho admin).',
    usage: 'run [lệnh]',
    author: 'Hệ thống',
    async execute(senderId, args, pageAccessToken, sendMessage, isAdmin) {
        if (!isAdmin) {
            await sendMessage(senderId, { text: 'Bạn không có quyền thực hiện lệnh này.' }, pageAccessToken);
            return;
        }

        const command = args.join(' ');

        if (!command) {
            await sendMessage(senderId, { text: 'Vui lòng cung cấp lệnh shell để chạy.' }, pageAccessToken);
            return;
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                sendMessage(senderId, { text: `Lỗi: ${error.message}` }, pageAccessToken);
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                sendMessage(senderId, { text: `stderr: ${stderr}` }, pageAccessToken);
                return;
            }

            sendMessage(senderId, { text: `Kết quả:\n${stdout}` }, pageAccessToken);
        });
    }
};

const os = require('os');
const util = require('util');
const execPromise = util.promisify(require('child_process').exec);
const { sendMessage } = require('../handles/sendMessage');

let commandCount = 0;
const botStartTime = Date.now();

module.exports = {
    name: "uptime",
    description: "Hiển thị trạng thái hệ thống của bot.",
    usage: "uptime",
    author: "Hệ thống",
    usedby: 2,
    cooldown: 0,
    async execute(senderId, args, pageAccessToken, sendMessage, isAdmin) {
        if (!isAdmin) {
            return sendMessage(senderId, { text: "Bạn không có quyền truy cập lệnh này." }, pageAccessToken);
        }

        commandCount++;

        let currentTime = Date.now();
        let uptime = currentTime - botStartTime;
        let seconds = Math.floor((uptime / 1000) % 60);
        let minutes = Math.floor((uptime / (1000 * 60)) % 60);
        let hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
        let days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        let memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; 
        let cpuLoad = os.loadavg()[0].toFixed(2); 

        const systemInfo = await getSystemInfo();
        const nodeVersion = await getNodeVersion();
        const systemUptime = await getSystemUptime();

        let uptimeMessage = `⏱️ BOT UPTIME\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `🕒 Thời gian online: ${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây\n`;
        uptimeMessage += `🖥️ Thời gian hệ điều hành đã hoạt động: ${systemUptime}\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `📊 Số lệnh đã thực thi: ${commandCount}\n`;
        uptimeMessage += `💾 Bộ nhớ sử dụng: ${memoryUsage.toFixed(2)} MB\n`;
        uptimeMessage += `⚙️ CPU Load: ${cpuLoad}%\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `🖥️ Hệ điều hành: ${systemInfo.platform} (${systemInfo.arch})\n`;
        uptimeMessage += `- Phiên bản: ${systemInfo.release}\n`;
        uptimeMessage += `- Tên máy: ${systemInfo.hostname}\n`;
        uptimeMessage += `- CPU Model: ${systemInfo.cpuModel} (${systemInfo.coreCount} core(s), ${systemInfo.cpuSpeed} MHz)\n`;
        uptimeMessage += `- Tải CPU: ${systemInfo.loadAverage.join(', ')}\n`;
        uptimeMessage += `- Dung lượng bộ nhớ: ${systemInfo.totalMemory} GB\n`;
        uptimeMessage += `- Bộ nhớ còn lại: ${systemInfo.freeMemory} GB\n`;
        uptimeMessage += `- Bộ nhớ đã sử dụng: ${systemInfo.usedMemory} GB\n`;
        uptimeMessage += `=======================\n`;
        uptimeMessage += `🔢 Node.js Version: ${nodeVersion}\n`;

        return sendMessage(senderId, { text: uptimeMessage }, pageAccessToken);
    }
};

async function getSystemInfo() {
    try {
        const platform = os.platform();
        const release = os.release();
        const arch = os.arch();
        const hostname = os.hostname();
        const cpuModel = os.cpus()[0].model;
        const coreCount = os.cpus().length;
        const cpuSpeed = os.cpus()[0].speed;
        const loadAverage = os.loadavg();
        const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
        const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
        const usedMemory = (totalMemory - freeMemory).toFixed(2);

        return {
            platform,
            release,
            arch,
            hostname,
            cpuModel,
            coreCount,
            cpuSpeed,
            loadAverage,
            totalMemory,
            freeMemory,
            usedMemory
        };
    } catch {
        return {
            platform: 'N/A',
            release: 'N/A',
            arch: 'N/A',
            hostname: 'N/A',
            cpuModel: 'N/A',
            coreCount: 'N/A',
            cpuSpeed: 'N/A',
            loadAverage: 'N/A',
            totalMemory: 'N/A',
            freeMemory: 'N/A',
            usedMemory: 'N/A'
        };
    }
}

async function getNodeVersion() {
    try {
        const { stdout } = await execPromise('node -v');
        return stdout.trim();
    } catch {
        return 'N/A';
    }
}

async function getSystemUptime() {
    const sysUptimeDays = Math.floor(os.uptime() / (60 * 60 * 24));
    const sysUptimeHours = Math.floor((os.uptime() % (60 * 60 * 24)) / (60 * 60));
    const sysUptimeMinutes = Math.floor((os.uptime() % (60 * 60)) / 60);
    const sysUptimeSeconds = Math.floor(os.uptime() % 60);
    return `${sysUptimeDays} ngày, ${sysUptimeHours} giờ, ${sysUptimeMinutes} phút, ${sysUptimeSeconds} giây`;
}

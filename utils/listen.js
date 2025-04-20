class Listen {
  constructor() {
    this.name = '';
    this.description = '';
    this.usage = '';
    this.author = '';
    this.permission = [];
    this.cooldowns = 5;
    this.isActive = true;
  }

  checkPermission(senderId, isAdmin) {
    if (!this.permission.length) return true;
    return isAdmin || this.permission.includes(senderId);
  }

  async execute(senderId, args, pageAccessToken, sendMessage, isAdmin) {
    try {
      if (!this.isActive) {
        throw new Error('Lệnh này hiện đang bị vô hiệu hóa.');
      }

      if (!this.checkPermission(senderId, isAdmin)) {
        throw new Error('Bạn không có quyền sử dụng lệnh này.');
      }

      throw new Error('Phương thức execute() chưa được triển khai.');
    } catch (error) {
      console.error(`Lỗi khi thực thi lệnh ${this.name}:`, error);
      await sendMessage(senderId, { text: error.message }, pageAccessToken);
    }
  }

  getHelp() {
    return {
      name: this.name,
      description: this.description,
      usage: this.usage,
      author: this.author,
      permission: this.permission,
      cooldowns: this.cooldowns
    };
  }

  checkCooldown(senderId) {

    return true;
  }

  setActive(status) {
    this.isActive = status;
    return this.isActive;
  }
}

module.exports = Listen;

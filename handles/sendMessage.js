const axios = require('axios');
const path = require('path');

const axiosPost = (url, data, params = {}) => axios.post(url, data, { params }).then(res => res.data);

const sendMessage = async (senderId, { text = '', attachment = null }, pageAccessToken) => {
  if (!text && !attachment) return;

  const url = `https://graph.facebook.com/v21.0/me/messages`;
  const params = { access_token: pageAccessToken };

  try {
    await axiosPost(url, { recipient: { id: senderId }, sender_action: "typing_on" }, params);

    const messagePayload = {
      recipient: { id: senderId },
      message: {}
    };

    if (text) {
      messagePayload.message.text = text;
    }

    if (attachment) {
      if (attachment.type && attachment.payload && attachment.payload.url) {
        messagePayload.message.attachment = {
          type: attachment.type,
          payload: {
            url: attachment.payload.url,
            is_reusable: true
          }
        };
      } else {
        console.warn("Attachment không hợp lệ:", attachment);
        await axiosPost(url, { recipient: { id: senderId }, message: { text: "Có lỗi xảy ra với tệp đính kèm." } }, params);
        return; 
      }
    }

    await axiosPost(url, messagePayload, params);
    await axiosPost(url, { recipient: { id: senderId }, sender_action: "typing_off" }, params);

  } catch (e) {
    const errorMessage = e.response?.data?.error?.message || e.message;
    console.error(`Error in ${path.basename(__filename)}: ${errorMessage}`);
    await axiosPost(url, { recipient: { id: senderId }, message: { text: "Có lỗi xảy ra khi gửi tin nhắn." } }, params);
  }
};

module.exports = { sendMessage };

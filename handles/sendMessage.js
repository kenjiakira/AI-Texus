const axios = require('axios');
const path = require('path');

// Helper function for POST requests
const axiosPost = (url, data, params = {}) => axios.post(url, data, { params }).then(res => res.data);

// Send a message with typing indicators
const sendMessage = async (senderId, { text = '', attachment = null }, pageAccessToken) => {
  if (!text && !attachment) return;

  const url = `https://graph.facebook.com/v21.0/me/messages`;
  const params = { access_token: pageAccessToken };

  try {
    // Turn on typing indicator
    await axiosPost(url, { recipient: { id: senderId }, sender_action: "typing_on" }, params);

    // Prepare message payload based on content
    const messagePayload = {
      recipient: { id: senderId },
      message: {}
    };

    if (text) {
      messagePayload.message.text = text;
    }

    if (attachment) {
      messagePayload.message.attachment = {
        type: attachment.type,
        payload: {
          url: attachment.payload.url,
          is_reusable: true
        }
      };
    }

    // Send the message
    await axiosPost(url, messagePayload, params);

    // Turn off typing indicator
    await axiosPost(url, { recipient: { id: senderId }, sender_action: "typing_off" }, params);

  } catch (e) {
    // Extract and log the error message concisely
    const errorMessage = e.response?.data?.error?.message || e.message;
    console.error(`Error in ${path.basename(__filename)}: ${errorMessage}`);
  }
};

module.exports = { sendMessage };
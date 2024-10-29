const { sendMessage } = require('./sendMessage');

const handlePostback = async (event, pageAccessToken) => {
  const { id: senderId } = event.sender || {};
  const { payload } = event.postback || {};

  if (!senderId || !payload) return console.error('Invalid postback event object');

  try {
    await sendMessage(senderId, { text: `You sent a postback with payload: ${payload}` }, pageAccessToken);
  } catch (err) {
    console.error('Error sending postback response:', err.message || err);
  }
};

module.exports = { handlePostback };
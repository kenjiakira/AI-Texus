require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const { handleMessage } = require('./handles/handleMessage');
const { handlePostback } = require('./handles/handlePostback');
const config = require('./config.json');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const COMMANDS_PATH = path.join(__dirname, 'commands');

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/webhook', (req, res) => {
  console.log('Webhook GET request received');
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Mode:', mode);
  console.log('Token:', token);
  console.log('Challenge:', challenge);

  if (mode && token) {
    if (mode === 'subscribe' && token === config.webhookVerifyToken) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  return res.sendStatus(404);
});

app.post('/webhook', (req, res) => {
  console.log('Webhook POST request received');
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  const { body } = req;

  if (body.object === 'page') {
    try {
      body.entry?.forEach(entry => {
        entry.messaging?.forEach(event => {
          console.log('Processing event:', JSON.stringify(event, null, 2));
          
          if (event.message) {
            handleMessage(event, PAGE_ACCESS_TOKEN);
          } else if (event.postback) {
            handlePostback(event, PAGE_ACCESS_TOKEN);
          }
        });
      });

      return res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
      console.error('Error processing webhook event:', error);
      return res.sendStatus(500);
    }
  }

  console.log('Invalid request body object:', body.object);
  return res.sendStatus(404);
});

const sendMessengerProfileRequest = async (method, url, data = null) => {
  try {
    const response = await axios({
      method,
      url: `https://graph.facebook.com/v21.0${url}?access_token=${PAGE_ACCESS_TOKEN}`,
      headers: { 'Content-Type': 'application/json' },
      data
    });
    return response.data;
  } catch (error) {
    console.error(`Lỗi trong yêu cầu ${method}:`, error.response?.data || error.message);
    throw error;
  }
};

const loadCommands = () => {
  return fs.readdirSync(COMMANDS_PATH)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const command = require(path.join(COMMANDS_PATH, file));
  
      return command.name && command.description && command.usedby === 0 ? 
        { name: command.name, description: command.description } : null;
    })
    .filter(Boolean);
};

const loadMenuCommands = async (isReload = false) => {
  const commands = loadCommands();

  if (isReload) {
    try {
      await sendMessengerProfileRequest('delete', '/me/messenger_profile', { fields: ['commands'] });
      console.log('Các lệnh menu đã được xóa thành công.');
    } catch (error) {
      console.error('Lỗi khi xóa menu commands:', error);
      return;
    }
  }

  try {
    await sendMessengerProfileRequest('post', '/me/messenger_profile', {
      commands: [{ locale: 'default', commands }],
    });
    console.log('Các lệnh menu đã được tải thành công.');
  } catch (error) {
    console.error('Lỗi khi tải menu commands:', error);
  }
};

fs.watch(COMMANDS_PATH, (eventType, filename) => {
  if (['change', 'rename'].includes(eventType) && filename.endsWith('.js')) {
    loadMenuCommands(true).catch(error => {
      console.error('Lỗi khi tải lại các lệnh menu:', error);
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Máy chủ đang chạy trên cổng ${PORT}`);
  try {
    await loadMenuCommands(); 
  } catch (error) {
    console.error('Lỗi khi tải các lệnh menu ban đầu:', error);
  }
});

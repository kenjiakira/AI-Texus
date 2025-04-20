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

app.use('/webhook', express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const COMMANDS_PATH = path.join(__dirname, 'commands');

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Texus Bot is running!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/webhook', (req, res) => {
  console.log('[Webhook GET] Request received:', {
    mode: req.query['hub.mode'],
    token: req.query['hub.verify_token'],
    challenge: req.query['hub.challenge']
  });

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (!mode || !token) {
    console.log('[Webhook] Missing mode or token');
    return res.sendStatus(400);
  }

  if (mode === 'subscribe' && token === config.webhookVerifyToken) {
    console.log('[Webhook] Verification successful');
    return res.status(200).send(challenge);
  }

  console.log('[Webhook] Verification failed: Invalid token');
  return res.sendStatus(403);
});

app.post('/webhook', (req, res) => {
  console.log('[Webhook POST] Request received');
  console.log('[Webhook] Headers:', req.headers);
  console.log('[Webhook] Body:', JSON.stringify(req.body, null, 2));

  const { body } = req;

  if (!body || body.object !== 'page') {
    console.log('[Webhook] Invalid request body:', body);
    return res.sendStatus(400);
  }

  try {
    body.entry?.forEach(entry => {
      console.log('[Webhook] Processing entry:', entry);
      
      entry.messaging?.forEach(event => {
        console.log('[Webhook] Processing event:', event);
        
        if (event.message) {
          handleMessage(event, PAGE_ACCESS_TOKEN);
        } else if (event.postback) {
          handlePostback(event, PAGE_ACCESS_TOKEN);
        }
      });
    });

    return res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('[Webhook] Error processing event:', error);
    return res.sendStatus(500);
  }
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

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`AI Texus Bot đang chạy trên cổng ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  try {
    await loadMenuCommands(); 
    console.log('Menu commands đã được tải thành công');
  } catch (error) {
    console.error('Lỗi khi tải menu commands:', error);
  }
});

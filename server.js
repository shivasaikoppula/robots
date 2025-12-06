
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const robotsRouter = require('./routes/robots');
const logsRouter = require('./routes/logs');
const apiKeyAuth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(apiKeyAuth); // global simple API-key auth if API_KEY is set

app.use('/robots', robotsRouter);
app.use('/', logsRouter); // logs endpoints at /robots/:id/logs and /logs

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

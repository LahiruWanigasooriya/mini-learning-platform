const express = require('express');
const dotenv = require('dotenv');
const notificationRoutes = require('./routes/notification.routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 8083;

app.use(express.json());

app.use('/api/notifications', notificationRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'Notification Service is running on Node.js' });
});

app.listen(port, () => {
    console.log(`Notification Service running on port ${port}`);
});

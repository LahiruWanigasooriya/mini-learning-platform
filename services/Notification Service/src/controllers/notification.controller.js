const notificationService = require('../services/notification.service');

const getUserNotifications = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const notifications = await notificationService.getUserNotifications(userId);
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createNotification = async (req, res) => {
    try {
        const notification = await notificationService.createNotification(req.body);
        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notificationId = parseInt(req.params.notificationId, 10);
        if (isNaN(notificationId)) {
            return res.status(400).json({ error: 'Invalid notification ID' });
        }
        const notification = await notificationService.markAsRead(notificationId);
        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserNotifications,
    createNotification,
    markAsRead
};

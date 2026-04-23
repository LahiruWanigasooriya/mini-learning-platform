const express = require('express');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

router.get('/user/:userId', notificationController.getUserNotifications);
router.post('/', notificationController.createNotification);
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;

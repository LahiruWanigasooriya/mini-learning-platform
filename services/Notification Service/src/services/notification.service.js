const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserNotifications = async (userId) => {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

const createNotification = async (data) => {
    return prisma.notification.create({
        data: {
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            status: data.status || 'PENDING'
        }
    });
};

const markAsRead = async (notificationId) => {
    return prisma.notification.update({
        where: { id: notificationId },
        data: {
            status: 'READ',
            readAt: new Date()
        }
    });
};

module.exports = {
    getUserNotifications,
    createNotification,
    markAsRead
};

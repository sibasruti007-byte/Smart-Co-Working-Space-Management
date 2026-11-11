import { broadcastUserNotification } from '../sockets/socket.gateway.js';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'BOOKING' | 'INQUIRY' | 'MEETING' | 'SYSTEM';
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export class NotificationService {
  private notifications = new Map<string, NotificationItem>();

  async createNotification(data: {
    userId: string;
    title: string;
    content: string;
    type: 'BOOKING' | 'INQUIRY' | 'MEETING' | 'SYSTEM';
    metadata?: Record<string, unknown>;
  }): Promise<NotificationItem> {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const item: NotificationItem = {
      id,
      userId: data.userId,
      title: data.title,
      content: data.content,
      type: data.type,
      isRead: false,
      metadata: data.metadata,
      createdAt: new Date().toISOString(),
    };

    this.notifications.set(id, item);

    // 1. Broadcast instant in-app notification via WebSockets
    broadcastUserNotification(data.userId, item);

    // 2. Dispatch simulated Email
    logger.info(
      {
        recipient: data.userId,
        title: data.title,
        smtpHost: env.SMTP_HOST,
        smtpPort: env.SMTP_PORT,
      },
      '📧 Dispatched Email Notification'
    );

    return item;
  }

  async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    const all = Array.from(this.notifications.values());
    return all.filter((n) => n.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const notif = this.notifications.get(notificationId);
    if (!notif || notif.userId !== userId) return false;
    notif.isRead = true;
    return true;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const list = await this.getUserNotifications(userId);
    return list.filter((n) => !n.isRead).length;
  }
}

export const notificationService = new NotificationService();


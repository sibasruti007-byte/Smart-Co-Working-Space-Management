import { prisma, isDbReady } from '../config/prisma.js';
import { InquiryThreadData, InquiryMessageData, MeetingRequestData, UserRole } from '@smartspace/shared';

export class InquiryRepository {
  private memoryThreads = new Map<string, InquiryThreadData>();
  private memoryMeetings = new Map<string, MeetingRequestData>();

  async createThread(data: {
    workspaceId: string;
    workspaceTitle: string;
    userId: string;
    userName: string;
    ownerId: string;
    subject: string;
    initialMessage: string;
    senderRole: UserRole;
  }): Promise<InquiryThreadData> {
    const threadId = `thread-${Date.now()}`;
    const messageId = `msg-${Date.now()}`;

    const initialMsg: InquiryMessageData = {
      id: messageId,
      threadId,
      senderId: data.userId,
      senderName: data.userName,
      senderRole: data.senderRole,
      messageText: data.initialMessage,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    const thread: InquiryThreadData = {
      id: threadId,
      workspaceId: data.workspaceId,
      workspaceTitle: data.workspaceTitle,
      userId: data.userId,
      userName: data.userName,
      ownerId: data.ownerId,
      subject: data.subject,
      status: 'OPEN',
      messages: [initialMsg],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDbReady()) {
      try {
        await prisma.inquiryThread.create({
          data: {
            id: threadId,
            workspaceId: data.workspaceId,
            userId: data.userId,
            ownerId: data.ownerId,
            subject: data.subject,
            messages: {
              create: {
                id: messageId,
                senderId: data.userId,
                messageText: data.initialMessage,
              },
            },
          },
        });
      } catch {
        // fallback
      }
    }

    this.memoryThreads.set(threadId, thread);
    return thread;
  }

  async addMessage(
    threadId: string,
    senderId: string,
    senderName: string,
    senderRole: UserRole,
    messageText: string
  ): Promise<InquiryMessageData> {
    const thread = this.memoryThreads.get(threadId);
    if (!thread) throw new Error('Thread not found');

    const msgId = `msg-${Date.now()}`;
    const newMsg: InquiryMessageData = {
      id: msgId,
      threadId,
      senderId,
      senderName,
      senderRole,
      messageText,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    thread.messages.push(newMsg);
    thread.updatedAt = new Date().toISOString();

    if (isDbReady()) {
      try {
        await prisma.inquiryMessage.create({
          data: {
            id: msgId,
            threadId,
            senderId,
            messageText,
          },
        });
      } catch {
        // fallback
      }
    }

    return newMsg;
  }

  async getThreadById(id: string): Promise<InquiryThreadData | null> {
    return this.memoryThreads.get(id) || null;
  }

  async getUserThreads(userId: string): Promise<InquiryThreadData[]> {
    return Array.from(this.memoryThreads.values()).filter((t) => t.userId === userId);
  }

  async getOwnerThreads(ownerId: string): Promise<InquiryThreadData[]> {
    return Array.from(this.memoryThreads.values()).filter((t) => t.ownerId === ownerId);
  }

  async createMeetingRequest(data: {
    threadId?: string;
    workspaceId: string;
    userId: string;
    scheduledAt: string;
    durationMinutes: number;
    notes?: string;
  }): Promise<MeetingRequestData> {
    const id = `meeting-${Date.now()}`;
    const req: MeetingRequestData = {
      id,
      threadId: data.threadId || null,
      workspaceId: data.workspaceId,
      userId: data.userId,
      scheduledAt: data.scheduledAt,
      durationMinutes: data.durationMinutes,
      status: 'PENDING',
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.memoryMeetings.set(id, req);
    return req;
  }

  async updateMeetingStatus(
    id: string,
    status: 'ACCEPTED' | 'DECLINED' | 'COMPLETED'
  ): Promise<MeetingRequestData> {
    const m = this.memoryMeetings.get(id);
    if (!m) throw new Error('Meeting request not found');
    m.status = status;
    m.updatedAt = new Date().toISOString();
    return m;
  }

  async getMeetingById(id: string): Promise<MeetingRequestData | null> {
    return this.memoryMeetings.get(id) || null;
  }
}

export const inquiryRepository = new InquiryRepository();


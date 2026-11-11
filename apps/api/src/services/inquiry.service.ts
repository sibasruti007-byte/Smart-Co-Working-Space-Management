import { inquiryRepository } from '../repositories/inquiry.repository.js';
import { workspaceRepository } from '../repositories/workspace.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { notificationService } from './notification.service.js';
import { InquiryCreateInput, UserRole } from '@smartspace/shared';

export class InquiryService {
  async startInquiry(
    userId: string,
    userName: string,
    userRole: UserRole,
    input: InquiryCreateInput
  ) {
    const space = await workspaceRepository.findByIdOrSlug(input.workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    const thread = await inquiryRepository.createThread({
      workspaceId: space.id,
      workspaceTitle: space.title,
      userId,
      userName,
      ownerId: space.ownerId,
      subject: input.subject,
      initialMessage: input.message,
      senderRole: userRole,
    });

    // Notify Space Owner
    await notificationService.createNotification({
      userId: space.ownerId,
      title: `New Inquiry for ${space.title}`,
      content: `${userName}: "${input.subject}"`,
      type: 'INQUIRY',
      metadata: { threadId: thread.id, workspaceId: space.id },
    });

    return thread;
  }

  async postMessage(
    threadId: string,
    senderId: string,
    senderName: string,
    senderRole: UserRole,
    messageText: string
  ) {
    const thread = await inquiryRepository.getThreadById(threadId);
    if (!thread) {
      const err: any = new Error('Inquiry thread not found');
      err.statusCode = 404;
      throw err;
    }

    if (thread.userId !== senderId && thread.ownerId !== senderId) {
      const err: any = new Error('Unauthorized to message on this inquiry thread');
      err.statusCode = 403;
      throw err;
    }

    const message = await inquiryRepository.addMessage(
      threadId,
      senderId,
      senderName,
      senderRole,
      messageText
    );

    // Notify other participant
    const recipientId = thread.userId === senderId ? thread.ownerId : thread.userId;
    await notificationService.createNotification({
      userId: recipientId,
      title: `New message on "${thread.subject}"`,
      content: `${senderName}: ${messageText.substring(0, 100)}...`,
      type: 'INQUIRY',
      metadata: { threadId },
    });

    return message;
  }

  async requestMeeting(
    userId: string,
    data: {
      threadId?: string;
      workspaceId: string;
      scheduledAt: string;
      durationMinutes: number;
      notes?: string;
    }
  ) {
    const space = await workspaceRepository.findByIdOrSlug(data.workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    const meeting = await inquiryRepository.createMeetingRequest({
      threadId: data.threadId,
      workspaceId: space.id,
      userId,
      scheduledAt: data.scheduledAt,
      durationMinutes: data.durationMinutes,
      notes: data.notes,
    });

    await notificationService.createNotification({
      userId: space.ownerId,
      title: `Tour Request for ${space.title}`,
      content: `Attendee requested a tour on ${new Date(data.scheduledAt).toLocaleDateString()}`,
      type: 'MEETING',
      metadata: { meetingId: meeting.id, workspaceId: space.id },
    });

    return meeting;
  }

  async updateMeetingStatus(meetingId: string, ownerId: string, status: 'ACCEPTED' | 'DECLINED') {
    const meeting = await inquiryRepository.getMeetingById(meetingId);
    if (!meeting) {
      const err: any = new Error('Meeting not found');
      err.statusCode = 404;
      throw err;
    }

    const space = await workspaceRepository.findByIdOrSlug(meeting.workspaceId);
    if (!space || space.ownerId !== ownerId) {
      const err: any = new Error('Unauthorized: only the space owner can update tour requests');
      err.statusCode = 403;
      throw err;
    }

    const updated = await inquiryRepository.updateMeetingStatus(meeting.id, status);

    await notificationService.createNotification({
      userId: meeting.userId,
      title: `Tour Request ${status}`,
      content: `The operator of ${space.title} has ${status.toLowerCase()} your tour request.`,
      type: 'MEETING',
      metadata: { meetingId: meeting.id },
    });

    return updated;
  }

  async findSimilarTeams(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user || !user.userPreference?.optInSimilarTeams) {
      return {
        optedIn: false,
        message: 'Opt-in required to discover compatible remote teams and share co-working spaces',
        matches: [],
      };
    }

    const userPref = user.userPreference;
    const allUsers = Array.from((userRepository as any).memoryUsers.values()) as any[];

    const matches = allUsers
      .filter((u) => u.id !== userId)
      .map((u) => {
        const pref = (userRepository as any).memoryPreferences?.get(u.id) || u.userPreference;
        if (!pref || !pref.optInSimilarTeams) return null;

        let compatibilityScore = 60;
        if (pref.preferredCity?.toLowerCase() === userPref.preferredCity?.toLowerCase()) compatibilityScore += 25;
        if (pref.workStyle === userPref.workStyle) compatibilityScore += 15;

        return {
          id: `team-${u.id.substring(0, 8)}`,
          workStyle: pref.workStyle,
          teamSize: pref.teamSize,
          city: pref.preferredCity,
          compatibilityScore,
          expectationsMatch: pref.expectations ? Object.keys(pref.expectations) : [],
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return {
      optedIn: true,
      matches,
    };
  }
}

export const inquiryService = new InquiryService();

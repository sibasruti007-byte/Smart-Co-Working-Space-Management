import { workspaceRepository } from '../repositories/workspace.repository.js';
import { WorkspaceCreateInput, WorkspaceSummary } from '@smartspace/shared';

export class WorkspaceService {
  async createWorkspace(ownerId: string, input: WorkspaceCreateInput): Promise<WorkspaceSummary> {
    return workspaceRepository.create(ownerId, input);
  }

  async updateWorkspace(
    workspaceId: string,
    userId: string,
    userRole: string,
    updates: Partial<WorkspaceCreateInput>
  ): Promise<WorkspaceSummary> {
    const space = await workspaceRepository.findByIdOrSlug(workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    if (space.ownerId !== userId && userRole !== 'ADMIN') {
      const err: any = new Error('Unauthorized to modify this workspace listing');
      err.statusCode = 403;
      throw err;
    }

    return workspaceRepository.update(space.id, updates as any);
  }

  async submitForVerification(workspaceId: string, ownerId: string): Promise<WorkspaceSummary> {
    const space = await workspaceRepository.findByIdOrSlug(workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    if (space.ownerId !== ownerId) {
      const err: any = new Error('Unauthorized: only the space owner can submit for verification');
      err.statusCode = 403;
      throw err;
    }

    if (!space.images || space.images.length === 0) {
      const err: any = new Error('Listing must include at least one photo before submission');
      err.statusCode = 400;
      throw err;
    }

    return workspaceRepository.update(space.id, {
      status: 'PENDING_VERIFICATION',
      rejectionReason: null,
    });
  }

  async verifyWorkspace(
    workspaceId: string,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ): Promise<WorkspaceSummary> {
    const space = await workspaceRepository.findByIdOrSlug(workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    if (status === 'REJECTED' && !rejectionReason) {
      const err: any = new Error('A rejection reason must be provided to assist the space owner');
      err.statusCode = 400;
      throw err;
    }

    return workspaceRepository.update(space.id, {
      status,
      rejectionReason: status === 'REJECTED' ? rejectionReason : null,
    });
  }

  async archiveWorkspace(workspaceId: string, userId: string, userRole: string): Promise<WorkspaceSummary> {
    const space = await workspaceRepository.findByIdOrSlug(workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    if (space.ownerId !== userId && userRole !== 'ADMIN') {
      const err: any = new Error('Unauthorized to archive this workspace');
      err.statusCode = 403;
      throw err;
    }

    return workspaceRepository.update(space.id, {
      status: 'ARCHIVED',
    });
  }

  async getWorkspaceByIdOrSlug(idOrSlug: string): Promise<WorkspaceSummary> {
    const space = await workspaceRepository.findByIdOrSlug(idOrSlug);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }
    return space;
  }

  async getOwnerWorkspaces(ownerId: string): Promise<WorkspaceSummary[]> {
    return workspaceRepository.findByOwner(ownerId);
  }

  async getVerificationQueue(): Promise<WorkspaceSummary[]> {
    return workspaceRepository.findPendingVerification();
  }
}

export const workspaceService = new WorkspaceService();


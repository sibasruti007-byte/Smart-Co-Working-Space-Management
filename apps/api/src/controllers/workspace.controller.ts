import { Request, Response, NextFunction } from 'express';
import { workspaceService } from '../services/workspace.service.js';

export class WorkspaceController {
  async createWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const space = await workspaceService.createWorkspace(req.user!.id, req.body);
      res.status(201).json({
        message: 'Workspace listing draft created successfully',
        workspace: space,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const space = await workspaceService.updateWorkspace(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body
      );
      res.status(200).json({
        message: 'Workspace listing updated successfully',
        workspace: space,
      });
    } catch (err) {
      next(err);
    }
  }

  async submitForVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const space = await workspaceService.submitForVerification(req.params.id, req.user!.id);
      res.status(200).json({
        message: 'Workspace submitted for administrator verification',
        workspace: space,
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, rejectionReason } = req.body;
      const space = await workspaceService.verifyWorkspace(req.params.id, status, rejectionReason);
      res.status(200).json({
        message: `Workspace verification updated to ${status}`,
        workspace: space,
      });
    } catch (err) {
      next(err);
    }
  }

  async archiveWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const space = await workspaceService.archiveWorkspace(req.params.id, req.user!.id, req.user!.role);
      res.status(200).json({
        message: 'Workspace archived successfully',
        workspace: space,
      });
    } catch (err) {
      next(err);
    }
  }

  async getWorkspace(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const space = await workspaceService.getWorkspaceByIdOrSlug(req.params.idOrSlug);
      res.status(200).json({ workspace: space });
    } catch (err) {
      next(err);
    }
  }

  async getMyWorkspaces(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spaces = await workspaceService.getOwnerWorkspaces(req.user!.id);
      res.status(200).json({ workspaces: spaces });
    } catch (err) {
      next(err);
    }
  }

  async getVerificationQueue(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const spaces = await workspaceService.getVerificationQueue();
      res.status(200).json({ queue: spaces });
    } catch (err) {
      next(err);
    }
  }
}

export const workspaceController = new WorkspaceController();


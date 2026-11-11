import { Request, Response, NextFunction } from 'express';
import { occupancyService } from '../services/occupancy.service.js';

export class OccupancyController {
  async recordEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await occupancyService.recordEvent(req.params.id, req.body);
      res.status(200).json({
        message: 'Telemetry occupancy event processed',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getLiveTelemetry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const telemetry = await occupancyService.getLiveTelemetry(req.params.id);
      res.status(200).json(telemetry);
    } catch (err) {
      next(err);
    }
  }

  async getHeatmap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const heatmap = await occupancyService.getUtilizationHeatmap(req.params.id);
      res.status(200).json(heatmap);
    } catch (err) {
      next(err);
    }
  }
}

export const occupancyController = new OccupancyController();


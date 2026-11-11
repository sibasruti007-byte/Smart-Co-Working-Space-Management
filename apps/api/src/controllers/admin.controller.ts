import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';

export class AdminController {
  async getKPIs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const kpis = await analyticsService.getPlatformKPIs();
      res.status(200).json({ kpis });
    } catch (err) {
      next(err);
    }
  }

  async exportCSV(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const csv = await analyticsService.generateCSVReport();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="smartspace_kpis_report.csv"');
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await analyticsService.getAuditLogs();
      res.status(200).json({ logs });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();


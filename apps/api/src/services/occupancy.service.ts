import { workspaceRepository } from '../repositories/workspace.repository.js';
import { broadcastSpaceOccupancy } from '../sockets/socket.gateway.js';
import { OccupancyEventInput, TelemetryMetrics } from '@smartspace/shared';

export class OccupancyService {
  async recordEvent(workspaceId: string, event: OccupancyEventInput) {
    const space = await workspaceRepository.findByIdOrSlug(workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    const delta = event.direction === 'CHECK_IN' ? event.delta || 1 : -(event.delta || 1);
    const updatedCount = Math.max(0, space.currentOccupancy + delta);

    await workspaceRepository.update(space.id, {
      currentOccupancy: updatedCount,
    });

    const percent = Math.min(100, Math.round((updatedCount / space.seatingCapacity) * 100));

    const payload = {
      workspaceId: space.id,
      currentOccupancy: updatedCount,
      seatingCapacity: space.seatingCapacity,
      occupancyPercent: percent,
      direction: event.direction,
      timestamp: new Date().toISOString(),
    };

    broadcastSpaceOccupancy(space.id, payload);

    return payload;
  }

  async getLiveTelemetry(workspaceId: string): Promise<TelemetryMetrics> {
    const space = await workspaceRepository.findByIdOrSlug(workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    const occupied = space.currentOccupancy || 4;
    const capacity = space.seatingCapacity || 12;
    const percent = Math.min(100, Math.round((occupied / capacity) * 100));

    return {
      capacityPercent: percent,
      occupiedCount: occupied,
      totalCapacity: capacity,
      airQualityIndex: 94,
      co2Ppm: 480,
      vocLevel: 'LOW',
      ambientNoiseDb: 42,
      temperatureCelsius: 22.5,
      targetTemperatureCelsius: 22.0,
      humidityPercent: 48,
      airflowQuality: 'FRESH',
      luxLevel: 520,
      lastSyncTimestamp: new Date().toISOString(),
    };
  }

  async getUtilizationHeatmap(workspaceId: string) {
    const space = await workspaceRepository.findByIdOrSlug(workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = [8, 10, 12, 14, 16, 18, 20];

    // Seed realistic utilization percentages
    const matrix = days.map((day, dIdx) => {
      const isWeekend = dIdx >= 5;
      const hourly = hours.map((hour) => {
        let base = isWeekend ? 20 : 60;
        if (hour >= 11 && hour <= 15) base += 30; // peak traffic
        if (hour >= 18) base -= 35; // evening taper
        const jitter = Math.sin(dIdx * 3 + hour) * 8;
        const rate = Math.max(5, Math.min(100, Math.round(base + jitter)));
        return { hour: `${hour.toString().padStart(2, '0')}:00`, utilizationRate: rate };
      });

      return {
        day,
        hourly,
      };
    });

    return {
      workspaceId: space.id,
      title: space.title,
      heatmap: matrix,
    };
  }
}

export const occupancyService = new OccupancyService();


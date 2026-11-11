import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let ioInstance: SocketIOServer | null = null;

export function initSocketGateway(server: HttpServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    logger.debug({ socketId: socket.id }, 'Socket client connected');

    socket.on('join_space', (spaceId: string) => {
      socket.join(`space:${spaceId}`);
      logger.debug({ socketId: socket.id, spaceId }, 'Client joined space telemetry channel');
    });

    socket.on('leave_space', (spaceId: string) => {
      socket.leave(`space:${spaceId}`);
      logger.debug({ socketId: socket.id, spaceId }, 'Client left space telemetry channel');
    });

    socket.on('join_user', (userId: string) => {
      socket.join(`user:${userId}`);
      logger.debug({ socketId: socket.id, userId }, 'Client joined personal notifications channel');
    });

    socket.on('disconnect', () => {
      logger.debug({ socketId: socket.id }, 'Socket client disconnected');
    });
  });

  ioInstance = io;
  return io;
}

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

export function broadcastSpaceOccupancy(spaceId: string, payload: any) {
  if (ioInstance) {
    ioInstance.to(`space:${spaceId}`).emit('OCCUPANCY_UPDATED', payload);
  }
}

export function broadcastSlotStatus(spaceId: string, payload: any) {
  if (ioInstance) {
    ioInstance.to(`space:${spaceId}`).emit('SLOT_AVAILABILITY_CHANGED', payload);
  }
}

export function broadcastUserNotification(userId: string, payload: any) {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit('NEW_NOTIFICATION', payload);
  }
}


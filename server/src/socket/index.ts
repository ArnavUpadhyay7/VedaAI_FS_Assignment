import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join:assignment", (assignmentId: string) => {
      if (assignmentId) {
        socket.join(`assignment:${assignmentId}`);
      }
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

export function emitAssignmentEvent(
  event: "assignment:queued" | "assignment:processing" | "assignment:completed" | "assignment:failed",
  assignmentId: string,
  payload: Record<string, unknown> = {}
): void {
  const socket = getIO();
  const data = { assignmentId, ...payload };
  socket.to(`assignment:${assignmentId}`).emit(event, data);
  socket.emit(event, data);
}

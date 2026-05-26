"use client";

import { io, type Socket } from "socket.io-client";
import { SOCKET_URL } from "./constants";
import type { SocketPayload } from "./types";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socket;
}

export function joinAssignmentRoom(assignmentId: string): void {
  getSocket().emit("join:assignment", assignmentId);
}

export function subscribeToAssignmentEvents(
  handlers: {
    onQueued?: (payload: SocketPayload) => void;
    onProcessing?: (payload: SocketPayload) => void;
    onCompleted?: (payload: SocketPayload) => void;
    onFailed?: (payload: SocketPayload) => void;
  }
): () => void {
  const client = getSocket();

  const queued = (payload: SocketPayload) => handlers.onQueued?.(payload);
  const processing = (payload: SocketPayload) =>
    handlers.onProcessing?.(payload);
  const completed = (payload: SocketPayload) =>
    handlers.onCompleted?.(payload);
  const failed = (payload: SocketPayload) => handlers.onFailed?.(payload);

  client.on("assignment:queued", queued);
  client.on("assignment:processing", processing);
  client.on("assignment:completed", completed);
  client.on("assignment:failed", failed);

  return () => {
    client.off("assignment:queued", queued);
    client.off("assignment:processing", processing);
    client.off("assignment:completed", completed);
    client.off("assignment:failed", failed);
  };
}

"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useAssignmentSocket } from "@/hooks/use-assignment-socket";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useAssignmentSocket({});

  useEffect(() => {
    const client = getSocket();
    if (!client.connected) {
      client.connect();
    }
  }, []);

  return <>{children}</>;
}

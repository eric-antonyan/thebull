import { useEffect } from "react";
import { io } from "socket.io-client";
import { queryClient } from "../queryClient";

export const useTasksSocket = () => {
  useEffect(() => {
    const socket = io(`http://exp.thebull.ru`, {
      transports: ["websocket"],
    });

    socket.on("taskCreated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("taskUpdated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("taskDeleted", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    // ❗❗ MUST return cleanup function
    return () => {
      socket.disconnect();
    };
  }, []);
};

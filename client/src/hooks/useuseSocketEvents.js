
import { useEffect } from "react";

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    if (socket) {
      // Register event listeners
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.on(event, handler);
      });

      // Clean up listeners when component unmounts
      return () => {
        Object.entries(handlers).forEach(([event, handler]) => {
          socket.off(event, handler);
        });
      };
    }
  }, [socket, handlers]);
};

export default useSocketEvents;

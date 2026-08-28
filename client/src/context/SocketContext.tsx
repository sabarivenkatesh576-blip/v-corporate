import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface LiveNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: Date;
}

interface SocketContextType {
  socket: Socket | null;
  online: boolean;
  notifications: LiveNotification[];
  clearNotification: (id: string) => void;
  joinTeam: (teamId: string) => void;
  broadcastTaskUpdate: (teamId: string, taskId: string, taskTitle: string, status: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [online, setOnline] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  useEffect(() => {
    const SOCKET_BASE = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:5000' : '/');
    const newSocket = io(SOCKET_BASE, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      setOnline(true);
      if (user?._id) {
        newSocket.emit('join_user', user._id);
      }
    });

    newSocket.on('disconnect', () => {
      setOnline(false);
    });

    newSocket.on('new_notification', (data: any) => {
      const notif: LiveNotification = {
        id: Math.random().toString(),
        title: data.title || 'V-CORP Notification',
        message: data.message || '',
        type: data.type || 'system',
        timestamp: new Date()
      };
      setNotifications((prev) => [notif, ...prev.slice(0, 9)]);
    });

    newSocket.on('task_update_broadcast', (data: any) => {
      const notif: LiveNotification = {
        id: Math.random().toString(),
        title: `Team Task Update: ${data.taskTitle}`,
        message: `${data.updatedBy} marked task as ${data.status}.`,
        type: 'task',
        timestamp: new Date()
      };
      setNotifications((prev) => [notif, ...prev.slice(0, 9)]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  const joinTeam = (teamId: string) => {
    if (socket && teamId) {
      socket.emit('join_team', teamId);
    }
  };

  const broadcastTaskUpdate = (teamId: string, taskId: string, taskTitle: string, status: string) => {
    if (socket && teamId) {
      socket.emit('task_updated', {
        teamId,
        taskId,
        taskTitle,
        status,
        updatedBy: user?.fullName || 'A squad member'
      });
    }
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        online,
        notifications,
        clearNotification,
        joinTeam,
        broadcastTaskUpdate
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

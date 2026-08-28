import { Server as SocketIOServer, Socket } from 'socket.io';
import { TeamMessage } from '../models/TeamMessage';
import { Notification } from '../models/Notification';

export class SocketService {
  private static io: SocketIOServer;

  static init(io: SocketIOServer) {
    this.io = io;

    io.on('connection', (socket: Socket) => {
      // User joins personal channel
      socket.on('join_user', (userId: string) => {
        if (userId) {
          socket.join(`user:${userId}`);
        }
      });

      // User joins team channel
      socket.on('join_team', (teamId: string) => {
        if (teamId) {
          socket.join(`team:${teamId}`);
        }
      });

      // Real-time Chat message
      socket.on('send_team_message', async (data: {
        teamId: string;
        channel: string;
        senderId: string;
        senderName: string;
        text: string;
        attachments?: string[];
      }) => {
        try {
          const newMsg = await TeamMessage.create({
            teamId: data.teamId,
            channel: data.channel || '#general',
            senderId: data.senderId,
            senderName: data.senderName,
            text: data.text,
            attachments: data.attachments || []
          });

          io.to(`team:${data.teamId}`).emit('new_team_message', newMsg);
        } catch (err) {
          console.error('Error broadcasting team message:', err);
        }
      });

      // Real-time Task Status Update
      socket.on('task_updated', (data: {
        teamId: string;
        taskId: string;
        taskTitle: string;
        status: string;
        updatedBy: string;
      }) => {
        io.to(`team:${data.teamId}`).emit('task_update_broadcast', {
          ...data,
          timestamp: new Date()
        });
      });

      // Meeting Room & WebRTC Signaling
      socket.on('join_meeting', (data: { meetingId: string; userId: string; userName: string }) => {
        const meetingRoom = `meeting:${data.meetingId}`;
        socket.join(meetingRoom);
        socket.to(meetingRoom).emit('user_joined_meeting', {
          socketId: socket.id,
          userId: data.userId,
          userName: data.userName
        });
      });

      socket.on('webrtc_offer', (data: { targetSocketId: string; sdp: any; callerName: string }) => {
        io.to(data.targetSocketId).emit('webrtc_offer', {
          callerSocketId: socket.id,
          sdp: data.sdp,
          callerName: data.callerName
        });
      });

      socket.on('webrtc_answer', (data: { targetSocketId: string; sdp: any }) => {
        io.to(data.targetSocketId).emit('webrtc_answer', {
          responderSocketId: socket.id,
          sdp: data.sdp
        });
      });

      socket.on('webrtc_ice_candidate', (data: { targetSocketId: string; candidate: any }) => {
        io.to(data.targetSocketId).emit('webrtc_ice_candidate', {
          senderSocketId: socket.id,
          candidate: data.candidate
        });
      });

      socket.on('meeting_media_toggle', (data: { meetingId: string; userId: string; audio: boolean; video: boolean }) => {
        io.to(`meeting:${data.meetingId}`).emit('meeting_media_toggle', data);
      });

      socket.on('leave_meeting', (data: { meetingId: string; userId: string }) => {
        socket.leave(`meeting:${data.meetingId}`);
        io.to(`meeting:${data.meetingId}`).emit('user_left_meeting', {
          socketId: socket.id,
          userId: data.userId
        });
      });

      socket.on('disconnect', () => {
        // Disconnected cleanly
      });
    });
  }

  static async sendNotificationToUser(userId: string, notif: {
    type: string;
    title: string;
    message: string;
    link?: string;
  }) {
    try {
      const created = await Notification.create({
        userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: notif.link,
        read: false
      });

      if (this.io) {
        this.io.to(`user:${userId}`).emit('new_notification', created);
      }
      return created;
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  }
}

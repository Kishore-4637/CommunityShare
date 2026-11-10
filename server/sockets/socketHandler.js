// Realtime Socket.IO handler
const onlineUsers = new Map(); // userId -> Set of socket.id

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    let currentUserId = null;

    // User authenticates/identifies their socket
    socket.on('join_user', (userId) => {
      if (!userId) return;
      currentUserId = userId.toString();
      socket.join(`user_${currentUserId}`);

      if (!onlineUsers.has(currentUserId)) {
        onlineUsers.set(currentUserId, new Set());
      }
      onlineUsers.get(currentUserId).add(socket.id);

      // Broadcast list of currently online user IDs
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    // Join a specific chat conversation room
    socket.on('join_conversation', (conversationId) => {
      if (conversationId) {
        socket.join(`conversation_${conversationId}`);
      }
    });

    // Leave a specific chat conversation room
    socket.on('leave_conversation', (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation_${conversationId}`);
      }
    });

    // Typing indicators
    socket.on('typing', ({ conversationId, userId, userName }) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        userName,
      });
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
      socket.to(`conversation_${conversationId}`).emit('user_stop_typing', {
        conversationId,
        userId,
      });
    });

    // Disconnect cleanup
    socket.on('disconnect', () => {
      if (currentUserId && onlineUsers.has(currentUserId)) {
        const userSockets = onlineUsers.get(currentUserId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(currentUserId);
        }
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });
  });
};

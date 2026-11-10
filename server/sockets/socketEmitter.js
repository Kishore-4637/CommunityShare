let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
};

export const getIO = () => {
  return ioInstance;
};

export const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId.toString()}`).emit(event, data);
  }
};

export const emitToConversation = (conversationId, event, data) => {
  if (ioInstance && conversationId) {
    ioInstance.to(`conversation_${conversationId}`).emit(event, data);
  }
};

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Send,
  MessageSquare,
  Search,
  Check,
  CheckCheck,
  Sparkles,
  ExternalLink,
  Circle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatService } from '../services/chatService';
import { authService } from '../services/authService';

export const ChatPage = () => {
  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const targetUserIdParam = queryParams.get('target');
  const targetItemIdParam = queryParams.get('itemId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversations
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        setLoading(true);
        const res = await chatService.getConversations();
        if (res.success) {
          setConversations(res.conversations || []);

          // If target user query param is present, select or initiate chat
          if (targetUserIdParam) {
            const found = res.conversations.find(
              (c) => c.otherUser?._id === targetUserIdParam
            );
            if (found) {
              setActiveConversation(found);
            } else {
              // Create temporary stub conversation
              setActiveConversation({
                conversationId: [user._id, targetUserIdParam].sort().join('_'),
                otherUser: { _id: targetUserIdParam, name: 'Neighbor' },
                item: targetItemIdParam ? { _id: targetItemIdParam } : null,
              });
            }
          } else if (res.conversations?.length > 0) {
            setActiveConversation(res.conversations[0]);
          }
        }
      } catch (err) {
        console.warn('Failed to load chats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConvs();
  }, [targetUserIdParam, user?._id]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation?.otherUser?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await chatService.getMessages(activeConversation.otherUser._id);
        if (res.success) {
          setMessages(res.messages || []);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        console.warn('Failed to load message history:', err);
      }
    };

    fetchMessages();

    // Join room in socket
    if (socket && activeConversation.conversationId) {
      socket.emit('join_conversation', activeConversation.conversationId);
    }

    return () => {
      if (socket && activeConversation.conversationId) {
        socket.emit('leave_conversation', activeConversation.conversationId);
      }
    };
  }, [activeConversation, socket]);

  // Listen for socket messages and typing
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMsg) => {
      if (
        activeConversation &&
        (newMsg.sender?._id === activeConversation.otherUser?._id ||
          newMsg.sender === activeConversation.otherUser?._id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 100);
      }

      // Update conversations list snippet
      setConversations((prev) => {
        return prev.map((c) => {
          if (c.conversationId === newMsg.conversationId) {
            return {
              ...c,
              lastMessage: {
                text: newMsg.text,
                createdAt: newMsg.createdAt,
                sender: newMsg.sender?._id || newMsg.sender,
                isRead: true,
              },
            };
          }
          return c;
        });
      });
    };

    const handleUserTyping = ({ conversationId }) => {
      if (activeConversation?.conversationId === conversationId) {
        setOtherUserTyping(true);
      }
    };

    const handleUserStopTyping = ({ conversationId }) => {
      if (activeConversation?.conversationId === conversationId) {
        setOtherUserTyping(false);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket, activeConversation]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!socket || !activeConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        conversationId: activeConversation.conversationId,
        userId: user._id,
        userName: user.name,
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop_typing', {
        conversationId: activeConversation.conversationId,
        userId: user._id,
      });
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation?.otherUser?._id) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (socket && activeConversation) {
      socket.emit('stop_typing', {
        conversationId: activeConversation.conversationId,
        userId: user._id,
      });
      setIsTyping(false);
    }

    try {
      const res = await chatService.sendMessage(
        activeConversation.otherUser._id,
        textToSend,
        activeConversation.item?._id || targetItemIdParam || null
      );

      if (res.success) {
        setMessages((prev) => [...prev, res.message]);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.warn('Failed to send message:', err);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-3xl border border-warmgray-200/90 shadow-premium overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[650px] max-h-[750px]">
        {/* Left Pane: Conversation List */}
        <div className="md:col-span-4 border-r border-warmgray-200 flex flex-col h-full bg-warmgray-50/50">
          {/* Header */}
          <div className="p-4 border-b border-warmgray-200 bg-white">
            <h2 className="text-lg font-bold text-charcoal-900 font-display">Messages</h2>
            <div className="relative mt-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-warmgray-200 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-warmgray-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-charcoal-400">Loading chats...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-400">
                No active conversations yet.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected =
                  activeConversation?.conversationId === conv.conversationId;
                const online = isUserOnline(conv.otherUser?._id);

                return (
                  <div
                    key={conv.conversationId}
                    onClick={() => setActiveConversation(conv)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-forest-50' : 'hover:bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={
                          conv.otherUser?.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                        }
                        alt=""
                        className="w-11 h-11 rounded-2xl object-cover border border-warmgray-200"
                      />
                      {online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-charcoal-800 truncate">
                          {conv.otherUser?.name}
                        </h4>
                        {conv.lastMessage?.createdAt && (
                          <span className="text-[10px] text-charcoal-400">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-500 truncate mt-0.5">
                        {conv.lastMessage?.text || 'Start conversation...'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-forest-800 text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Room */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-warmgray-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        activeConversation.otherUser?.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt=""
                      className="w-10 h-10 rounded-2xl object-cover border border-warmgray-200"
                    />
                    {isUserOnline(activeConversation.otherUser?._id) && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-900">
                      {activeConversation.otherUser?.name}
                    </h3>
                    <p className="text-[11px] text-charcoal-500 flex items-center gap-1.5">
                      {isUserOnline(activeConversation.otherUser?._id) ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          Online Now
                        </span>
                      ) : (
                        <span>Offline</span>
                      )}
                    </p>
                  </div>
                </div>

                {activeConversation.item && (
                  <Link
                    to={`/items/${activeConversation.item._id}`}
                    className="flex items-center gap-2 text-xs font-semibold text-forest-800 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-xl border border-forest-200/60 transition-colors"
                  >
                    <span>{activeConversation.item.title || 'View Resource'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-warmgray-50/30">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-charcoal-400 p-8 space-y-2">
                    <MessageSquare className="w-8 h-8 text-forest-400" />
                    <p className="text-xs">Say hello to {activeConversation.otherUser?.name}!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe =
                      (m.sender?._id || m.sender)?.toString() === user?._id?.toString();

                    return (
                      <div
                        key={m._id || Math.random()}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-subtle ${
                            isMe
                              ? 'bg-forest-800 text-white rounded-br-xs'
                              : 'bg-white text-charcoal-800 border border-warmgray-200 rounded-bl-xs'
                          }`}
                        >
                          <p>{m.text}</p>
                        </div>
                        <span className="text-[10px] text-charcoal-400 mt-1 px-1">
                          {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {otherUserTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-charcoal-400 italic">
                    <span>{activeConversation.otherUser?.name} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 border-t border-warmgray-200 flex items-center gap-2 bg-white"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder={`Message ${activeConversation.otherUser?.name}...`}
                  className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-warmgray-300 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-warmgray-50 text-charcoal-800"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-forest-800 text-white hover:bg-forest-900 disabled:opacity-40 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-charcoal-400 text-xs">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

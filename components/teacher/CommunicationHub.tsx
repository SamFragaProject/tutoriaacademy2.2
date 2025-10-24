import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Users,
  User,
  Bell,
  Megaphone,
  Star,
  Paperclip,
  Image,
  Smile,
  MoreVertical,
  ChevronLeft,
  CheckCheck,
  Check,
  Clock,
  Pin,
  Archive,
  Trash2,
  Edit2,
  Reply,
  Forward,
  Download,
  X,
  AlertCircle,
  TrendingUp,
  Calendar,
  Award,
  Heart
} from 'lucide-react';
import { Card } from '../ui';
import { useAuth } from '../../hooks/useAuth';

// ============================
// INTERFACES Y TIPOS
// ============================

type ConversationType = 'individual' | 'group' | 'announcement';
type MessageStatus = 'sent' | 'delivered' | 'read';
type NotificationType = 'message' | 'announcement' | 'reminder' | 'achievement' | 'alert';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  attachments?: string[];
  isAnnouncement?: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

interface Conversation {
  id: string;
  type: ConversationType;
  participants: string[];
  participantNames: string[];
  participantAvatars: string[];
  title?: string;
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  groupId?: string;
}

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  icon?: string;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  group: string;
  isOnline: boolean;
}

// ============================
// MOCK DATA
// ============================

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Ana García', avatar: '👩', group: '3° A', isOnline: true },
  { id: 's2', name: 'Carlos Rodríguez', avatar: '👨', group: '3° A', isOnline: false },
  { id: 's3', name: 'María López', avatar: '👧', group: '3° B', isOnline: true },
  { id: 's4', name: 'Juan Martínez', avatar: '👦', group: '3° B', isOnline: false },
  { id: 's5', name: 'Pedro Sánchez', avatar: '👨', group: '3° C', isOnline: true },
  { id: 's6', name: 'Lucía Fernández', avatar: '👧', group: '3° C', isOnline: false },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    conversationId: 'c1',
    senderId: 's1',
    senderName: 'Ana García',
    senderAvatar: '👩',
    content: 'Profesor, tengo una duda sobre el ejercicio 5 de la tarea de álgebra.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    status: 'read'
  },
  {
    id: 'm2',
    conversationId: 'c1',
    senderId: 'teacher',
    senderName: 'Profesor',
    senderAvatar: '👨‍🏫',
    content: 'Claro Ana, ¿cuál es tu duda específicamente?',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    status: 'read'
  },
  {
    id: 'm3',
    conversationId: 'c1',
    senderId: 's1',
    senderName: 'Ana García',
    senderAvatar: '👩',
    content: 'No entiendo cómo factorizar x² + 5x + 6',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    status: 'read'
  },
  {
    id: 'm4',
    conversationId: 'c2',
    senderId: 's3',
    senderName: 'María López',
    senderAvatar: '👧',
    content: '¿Cuándo es la fecha límite del proyecto de biología?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    status: 'delivered'
  },
  {
    id: 'm5',
    conversationId: 'c3',
    senderId: 'teacher',
    senderName: 'Profesor',
    senderAvatar: '👨‍🏫',
    content: 'Recordatorio: Mañana tenemos examen de historia. Repasen los capítulos 5-8.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    status: 'sent',
    isAnnouncement: true
  }
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    type: 'individual',
    participants: ['s1'],
    participantNames: ['Ana García'],
    participantAvatars: ['👩'],
    lastMessage: MOCK_MESSAGES[2],
    unreadCount: 1,
    isPinned: true,
    isArchived: false
  },
  {
    id: 'c2',
    type: 'individual',
    participants: ['s3'],
    participantNames: ['María López'],
    participantAvatars: ['👧'],
    lastMessage: MOCK_MESSAGES[3],
    unreadCount: 1,
    isPinned: false,
    isArchived: false
  },
  {
    id: 'c3',
    type: 'group',
    participants: ['s1', 's2', 's3', 's4', 's5'],
    participantNames: ['Ana García', 'Carlos Rodríguez', 'María López', 'Juan Martínez', 'Pedro Sánchez'],
    participantAvatars: ['👩', '👨', '👧', '👦', '👨'],
    title: '3° A - Matemáticas',
    lastMessage: MOCK_MESSAGES[4],
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    groupId: 'g1'
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'message',
    title: 'Nuevo mensaje de Ana García',
    message: 'No entiendo cómo factorizar x² + 5x + 6',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    isRead: false,
    icon: '👩'
  },
  {
    id: 'n2',
    type: 'reminder',
    title: 'Tareas por calificar',
    message: 'Tienes 15 tareas pendientes de calificación',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isRead: false
  },
  {
    id: 'n3',
    type: 'achievement',
    title: 'Carlos Rodríguez obtuvo un logro',
    message: 'Completó 10 ejercicios seguidos correctamente',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    isRead: true
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Estudiante requiere atención',
    message: 'Pedro Sánchez ha bajado su rendimiento un 15%',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    isRead: true
  }
];

// ============================
// COMPONENTE PRINCIPAL
// ============================

export const CommunicationHub: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'messages' | 'announcements' | 'notifications'>('messages');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // ============================
  // COMPUTED VALUES
  // ============================

  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const conversationMessages = useMemo(() => {
    if (!selectedConversation) return [];
    return messages.filter(m => m.conversationId === selectedConversation.id);
  }, [messages, selectedConversation]);

  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      if (searchQuery) {
        return conv.participantNames.some(name => 
          name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || conv.title?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return !conv.isArchived;
    });
  }, [conversations, searchQuery]);

  // ============================
  // HANDLERS
  // ============================

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'teacher',
      senderName: 'Profesor',
      senderAvatar: '👨‍🏫',
      content: messageInput,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id
        ? { ...conv, lastMessage: newMessage, unreadCount: 0 }
        : conv
    ));
    setMessageInput('');
  };

  const handleSendAnnouncement = (content: string, recipients: string[]) => {
    const newAnnouncement: Message = {
      id: `m${Date.now()}`,
      conversationId: 'announcements',
      senderId: 'teacher',
      senderName: 'Profesor',
      senderAvatar: '👨‍🏫',
      content,
      timestamp: new Date(),
      status: 'sent',
      isAnnouncement: true
    };

    setMessages(prev => [...prev, newAnnouncement]);
    setShowAnnouncement(false);
    
    // Create notification for each recipient
    recipients.forEach(recipientId => {
      const student = MOCK_STUDENTS.find(s => s.id === recipientId);
      if (student) {
        const notification: Notification = {
          id: `n${Date.now()}_${recipientId}`,
          type: 'announcement',
          title: 'Nuevo Anuncio',
          message: content.substring(0, 100),
          timestamp: new Date(),
          isRead: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handlePinConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
    ));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  // ============================
  // RENDER FUNCTIONS
  // ============================

  const renderStats = () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Mensajes', value: conversations.reduce((sum, c) => sum + c.unreadCount, 0), icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
        { label: 'Anuncios Enviados', value: messages.filter(m => m.isAnnouncement).length, icon: Megaphone, color: 'from-purple-500 to-pink-500' },
        { label: 'Notificaciones', value: unreadNotifications, icon: Bell, color: 'from-orange-500 to-red-500' }
      ].map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`p-4 bg-gradient-to-r ${stat.color} bg-opacity-10`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );

  const renderConversationList = () => (
    <div className="h-[calc(100vh-400px)] overflow-y-auto space-y-2">
      <AnimatePresence mode="popLayout">
        {filteredConversations
          .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return (b.lastMessage?.timestamp.getTime() || 0) - (a.lastMessage?.timestamp.getTime() || 0);
          })
          .map(conversation => (
            <motion.div
              key={conversation.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedConversation?.id === conversation.id
                  ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {conversation.type === 'individual' ? (
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                      {conversation.participantAvatars[0]}
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {conversation.type === 'individual' && MOCK_STUDENTS.find(s => s.id === conversation.participants[0])?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {conversation.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                      <h3 className="text-white font-semibold truncate">
                        {conversation.title || conversation.participantNames.join(', ')}
                      </h3>
                    </div>
                    <span className="text-xs text-white/40 flex-shrink-0 ml-2">
                      {conversation.lastMessage && formatTimestamp(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-white/60 truncate">
                      {conversation.lastMessage.senderId === 'teacher' ? 'Tú: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>

                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{conversation.unreadCount}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );

  const renderMessageThread = () => {
    if (!selectedConversation) {
      return (
        <Card className="h-full flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Selecciona una conversación</h3>
            <p className="text-white/60">Elige un estudiante o grupo para comenzar a chatear</p>
          </div>
        </Card>
      );
    }

    return (
      <Card className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
              {selectedConversation.type === 'individual' 
                ? selectedConversation.participantAvatars[0]
                : <Users className="w-5 h-5 text-white" />
              }
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {selectedConversation.title || selectedConversation.participantNames.join(', ')}
              </h3>
              {selectedConversation.type === 'individual' && (
                <p className="text-xs text-white/60">
                  {MOCK_STUDENTS.find(s => s.id === selectedConversation.participants[0])?.isOnline 
                    ? 'En línea' 
                    : 'Desconectado'}
                </p>
              )}
              {selectedConversation.type === 'group' && (
                <p className="text-xs text-white/60">
                  {selectedConversation.participants.length} miembros
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePinConversation(selectedConversation.id)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Pin className={`w-5 h-5 ${selectedConversation.isPinned ? 'text-yellow-500' : 'text-white/60'}`} />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {conversationMessages.map(message => {
              const isOwn = message.senderId === 'teacher';
              return (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isOwn && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {message.senderAvatar}
                    </div>
                  )}
                  <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-sm'
                          : 'bg-white/10 text-white rounded-bl-sm'
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs text-white/60 mb-1">{message.senderName}</p>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-xs text-white/40">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      {isOwn && (
                        message.status === 'read' ? (
                          <CheckCheck className="w-3 h-3 text-blue-400" />
                        ) : message.status === 'delivered' ? (
                          <CheckCheck className="w-3 h-3 text-white/40" />
                        ) : (
                          <Check className="w-3 h-3 text-white/40" />
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-end gap-2">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-white/60" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Image className="w-5 h-5 text-white/60" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-white/60" />
              </button>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Escribe un mensaje..."
                rows={1}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </Card>
    );
  };

  const renderNotifications = () => (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Sin notificaciones</h3>
          <p className="text-white/60">No tienes notificaciones nuevas</p>
        </Card>
      ) : (
        notifications.map(notification => {
          const typeColors = {
            message: 'from-blue-500 to-cyan-500',
            announcement: 'from-purple-500 to-pink-500',
            reminder: 'from-yellow-500 to-orange-500',
            achievement: 'from-green-500 to-emerald-500',
            alert: 'from-red-500 to-rose-500'
          };

          const TypeIcon = {
            message: MessageSquare,
            announcement: Megaphone,
            reminder: Clock,
            achievement: Award,
            alert: AlertCircle
          }[notification.type];

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`cursor-pointer ${
                notification.isRead ? 'opacity-60' : ''
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <Card className={`p-4 hover:border-blue-500/30 transition-all ${
                !notification.isRead ? 'border-blue-500/30' : ''
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${typeColors[notification.type]} flex items-center justify-center flex-shrink-0`}>
                    {notification.icon ? (
                      <span className="text-xl">{notification.icon}</span>
                    ) : (
                      <TypeIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-white font-semibold">{notification.title}</h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-white/60 mb-2">{notification.message}</p>
                    <span className="text-xs text-white/40">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })
      )}
    </div>
  );

  // ============================
  // RENDER PRINCIPAL
  // ============================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Centro de Comunicación
            </h1>
            <p className="text-white/60 mt-1">
              Mensajes, anuncios y notificaciones en un solo lugar
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewMessage(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold"
            >
              <MessageSquare className="w-5 h-5" />
              Nuevo Mensaje
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAnnouncement(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
            >
              <Megaphone className="w-5 h-5" />
              Anuncio
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        {renderStats()}

        {/* Tabs */}
        <Card className="p-2">
          <div className="flex gap-2">
            {[
              { key: 'messages', label: 'Mensajes', icon: MessageSquare },
              { key: 'announcements', label: 'Anuncios', icon: Megaphone },
              { key: 'notifications', label: 'Notificaciones', icon: Bell, badge: unreadNotifications }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveView(tab.key as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all relative ${
                    activeView === tab.key
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-white/60 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Content */}
        {activeView === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className={selectedConversation ? 'hidden lg:block' : 'col-span-full lg:col-span-1'}>
              <Card className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar conversaciones..."
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                {renderConversationList()}
              </Card>
            </div>

            {/* Message Thread */}
            <div className={selectedConversation ? 'col-span-full lg:col-span-2' : 'hidden lg:block lg:col-span-2'}>
              {renderMessageThread()}
            </div>
          </div>
        )}

        {activeView === 'announcements' && (
          <Card className="p-6">
            <div className="text-center py-12">
              <Megaphone className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Historial de Anuncios</h3>
              <p className="text-white/60 mb-6">
                Aquí verás todos los anuncios que has enviado
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAnnouncement(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold"
              >
                <Megaphone className="w-5 h-5" />
                Crear Primer Anuncio
              </motion.button>
            </div>
          </Card>
        )}

        {activeView === 'notifications' && renderNotifications()}

        {/* New Message Modal */}
        <AnimatePresence>
          {showNewMessage && (
            <NewMessageModal
              students={MOCK_STUDENTS}
              onClose={() => setShowNewMessage(false)}
              onSend={(recipientId, message) => {
                // Create new conversation or add to existing
                const existingConv = conversations.find(c => 
                  c.type === 'individual' && c.participants.includes(recipientId)
                );

                if (existingConv) {
                  const newMessage: Message = {
                    id: `m${Date.now()}`,
                    conversationId: existingConv.id,
                    senderId: 'teacher',
                    senderName: 'Profesor',
                    senderAvatar: '👨‍🏫',
                    content: message,
                    timestamp: new Date(),
                    status: 'sent'
                  };
                  setMessages(prev => [...prev, newMessage]);
                  setConversations(prev => prev.map(conv =>
                    conv.id === existingConv.id
                      ? { ...conv, lastMessage: newMessage }
                      : conv
                  ));
                  setSelectedConversation(existingConv);
                } else {
                  const student = MOCK_STUDENTS.find(s => s.id === recipientId)!;
                  const newConv: Conversation = {
                    id: `c${Date.now()}`,
                    type: 'individual',
                    participants: [recipientId],
                    participantNames: [student.name],
                    participantAvatars: [student.avatar],
                    unreadCount: 0,
                    isPinned: false,
                    isArchived: false
                  };
                  setConversations(prev => [newConv, ...prev]);
                  setSelectedConversation(newConv);
                }
                setShowNewMessage(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Announcement Modal */}
        <AnimatePresence>
          {showAnnouncement && (
            <AnnouncementModal
              students={MOCK_STUDENTS}
              onClose={() => setShowAnnouncement(false)}
              onSend={handleSendAnnouncement}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================
// SUB-COMPONENTES
// ============================

interface NewMessageModalProps {
  students: Student[];
  onClose: () => void;
  onSend: (recipientId: string, message: string) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ students, onClose, onSend }) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (selectedStudent && message.trim()) {
      onSend(selectedStudent, message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Nuevo Mensaje</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Para</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Selecciona un estudiante</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Escribe tu mensaje..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!selectedStudent || !message.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Enviar
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

interface AnnouncementModalProps {
  students: Student[];
  onClose: () => void;
  onSend: (content: string, recipients: string[]) => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ students, onClose, onSend }) => {
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState<string[]>(students.map(s => s.id));

  const handleSend = () => {
    if (content.trim() && recipients.length > 0) {
      onSend(content, recipients);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Crear Anuncio</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Mensaje del Anuncio</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="Escribe tu anuncio..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-white/60">Destinatarios ({recipients.length})</label>
                <button
                  onClick={() => setRecipients(recipients.length === students.length ? [] : students.map(s => s.id))}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {recipients.length === students.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-white/5 rounded-lg">
                {students.map(student => {
                  const isSelected = recipients.includes(student.id);
                  return (
                    <button
                      key={student.id}
                      onClick={() => {
                        setRecipients(prev =>
                          isSelected
                            ? prev.filter(id => id !== student.id)
                            : [...prev, student.id]
                        );
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                        isSelected ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/5 text-white/80'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'bg-purple-500 border-purple-500' : 'border-white/30'
                      }`}>
                        {isSelected && <CheckCheck className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-xl">{student.avatar}</span>
                      <span className="text-sm">{student.name}</span>
                      <span className="text-xs text-white/40 ml-auto">{student.group}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!content.trim() || recipients.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Megaphone className="w-4 h-4" />
              Publicar Anuncio
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

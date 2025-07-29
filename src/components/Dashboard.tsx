import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, MessageCircle, Trash2, LogOut, Bot, Search } from 'lucide-react';
import { User, ChatRoom } from '../types';

// Validation schema for chat room creation
const chatRoomSchema = z.object({
  name: z.string()
    .min(1, 'Room name is required')
    .max(50, 'Room name must be at most 50 characters')
    .trim(),
  description: z.string()
    .max(200, 'Description must be at most 200 characters')
    .optional(),
});

type ChatRoomFormData = z.infer<typeof chatRoomSchema>;

interface DashboardProps {
  user: User;
  onSelectChatRoom: (chatRoom: ChatRoom) => void;
  onLogout: () => void;
  onAddToast: (toast: { type: 'success' | 'error' | 'warning' | 'info'; message: string }) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  onSelectChatRoom,
  onLogout,
  onAddToast
}) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Form hook for chat room creation
  const chatRoomForm = useForm<ChatRoomFormData>({
    resolver: zodResolver(chatRoomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    // Initialize with some demo chatrooms
    setChatRooms([
      {
        id: '1',
        name: 'General Chat',
        description: 'General conversations with Gemini',
        createdAt: new Date('2024-01-15'),
        lastMessage: {
          id: '1',
          content: 'Hello! How can I help you today?',
          sender: 'ai',
          timestamp: new Date('2024-01-15T10:30:00'),
          type: 'text'
        }
      },
      {
        id: '2',
        name: 'Creative Writing',
        description: 'Get help with creative writing projects',
        createdAt: new Date('2024-01-14'),
        lastMessage: {
          id: '2',
          content: 'That\'s a great story idea! Let me help you develop it further.',
          sender: 'ai',
          timestamp: new Date('2024-01-14T15:45:00'),
          type: 'text'
        }
      }
    ]);
  }, []);

  const handleCreateChatRoom = (data: ChatRoomFormData) => {
    setIsCreating(true);

    // Simulate API call
    setTimeout(() => {
      const newRoom: ChatRoom = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description || undefined,
        createdAt: new Date()
      };

      setChatRooms(prev => [newRoom, ...prev]);
      chatRoomForm.reset();
      setShowCreateModal(false);
      setIsCreating(false);
      onAddToast({ type: 'success', message: 'Chat room created successfully!' });
    }, 1000);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    chatRoomForm.reset();
    setIsCreating(false);
  };

  const handleDeleteChatRoom = (roomId: string, roomName: string) => {
    if (window.confirm(`Are you sure you want to delete "${roomName}"?`)) {
      setChatRooms(prev => prev.filter(room => room.id !== roomId));
      onAddToast({ type: 'success', message: 'Chat room deleted successfully!' });
    }
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Manage your AI conversations</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search chat rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat Room</span>
            </button>
          </div>
        </div>

        {/* Chat Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChatRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => onSelectChatRoom(room)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created {formatTime(room.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChatRoom(room.id, room.name);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {room.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
              )}
              
              {room.lastMessage && (
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium">
                      {room.lastMessage.sender === 'ai' ? 'Gemini: ' : 'You: '}
                    </span>
                    {room.lastMessage.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(room.lastMessage.timestamp)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredChatRooms.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              {searchQuery ? 'No matching chat rooms' : 'No chat rooms yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Create your first chat room to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Create Chat Room
              </button>
            )}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Chat Room</h2>
              
              <form onSubmit={chatRoomForm.handleSubmit(handleCreateChatRoom)} className="space-y-4">
                <div>
                  <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    {...chatRoomForm.register('name')}
                    placeholder="Enter room name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {chatRoomForm.formState.errors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {chatRoomForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="roomDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    {...chatRoomForm.register('description')}
                    placeholder="Enter room description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                  {chatRoomForm.formState.errors.description && (
                    <p className="text-red-600 text-sm mt-1">
                      {chatRoomForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create Room'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
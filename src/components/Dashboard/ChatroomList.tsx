import React, { useState } from 'react';
import { Search, Plus, Trash2, MessageSquare } from 'lucide-react';
import { Chatroom } from '../../types';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { formatTimestamp } from '../../utils/helpers';
import { ChatroomSkeleton } from '../UI/LoadingSkeleton';

interface ChatroomListProps {
  chatrooms: Chatroom[];
  onSelect: (chatroom: Chatroom) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedChatroomId?: string;
  isLoading?: boolean;
}

export const ChatroomList: React.FC<ChatroomListProps> = ({
  chatrooms,
  onSelect,
  onDelete,
  onCreate,
  searchQuery,
  onSearchChange,
  selectedChatroomId,
  isLoading = false
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirmId === id) {
      onDelete(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Chatrooms
            </h2>
            <Button size="sm" onClick={onCreate}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search chatrooms..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="p-4">
          <ChatroomSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chatrooms
          </h2>
          <Button size="sm" onClick={onCreate}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search chatrooms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatrooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">
              {searchQuery ? 'No chatrooms found' : 'No chatrooms yet'}
            </p>
            {!searchQuery && (
              <p className="text-sm text-center mt-2">
                Create your first chatroom to get started
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {chatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                className={`
                  flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 
                  cursor-pointer transition-colors
                  ${selectedChatroomId === chatroom.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' 
                    : ''
                  }
                `}
                onClick={() => onSelect(chatroom)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {chatroom.title}
                  </h3>
                  {chatroom.lastMessage && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {chatroom.lastMessage}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatTimestamp(new Date(chatroom.createdAt))}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(chatroom.id);
                  }}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${deleteConfirmId === chatroom.id
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }
                  `}
                  title={deleteConfirmId === chatroom.id ? 'Click again to confirm' : 'Delete chatroom'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
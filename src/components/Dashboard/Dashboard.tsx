import React, { useState, useCallback } from "react";
import { ChatroomList } from "./ChatroomList";
import { CreateChatroomModal } from "./CreateChatroomModal";
import { ChatInterface } from "../Chat/ChatInterface";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  createChatroom,
  deleteChatroom,
  selectChatroom,
  sendMessage,
  setSearchQuery,
} from "../../store/slices/chatSlice";
import { useToast } from "../UI/Toast";

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chatrooms, currentChatroom, messages, isTyping, searchQuery } =
    useAppSelector((state) => state.chat);

  const { showSuccess, showError, ToastContainer } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter chatrooms based on search query
  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get messages for current chatroom
  const currentMessages = currentChatroom
    ? messages.filter((msg) => msg.chatroomId === currentChatroom.id)
    : [];

  const handleCreateChatroom = useCallback(
    (title: string) => {
      try {
        dispatch(createChatroom(title));
        const newChatroom = chatrooms.find((room) => room.title === title);
        showSuccess("Chatroom created successfully!");
        if (newChatroom) {
          dispatch(selectChatroom(newChatroom));
        }
      } catch (error) {
        showError("Failed to create chatroom");
      }
    },
    [dispatch, chatrooms, showSuccess, showError]
  );

  const handleDeleteChatroom = useCallback(
    (id: string) => {
      try {
        dispatch(deleteChatroom(id));
        showSuccess("Chatroom deleted successfully!");
      } catch (error) {
        showError("Failed to delete chatroom");
      }
    },
    [dispatch, showSuccess, showError]
  );

  const handleSendMessage = useCallback(
    (message: string, image?: string) => {
      if (!currentChatroom) return;

      try {
        dispatch(
          sendMessage({
            content: message,
            image,
            chatroomId: currentChatroom.id,
          })
        );
        showSuccess("Message sent!");
      } catch (error) {
        showError("Failed to send message");
      }
    },
    [dispatch, currentChatroom, showSuccess, showError]
  );

  const handleBackToList = () => {
    dispatch(selectChatroom(null as any));
  };

  return (
    <>
      <div className="flex h-[calc(100vh-60px)] bg-gray-50 dark:bg-gray-900">
        <div
          className={`
          ${currentChatroom ? "hidden md:flex" : "flex"} 
          flex-col w-full md:w-80 lg:w-96
        `}
        >
          <ChatroomList
            chatrooms={filteredChatrooms}
            onSelect={(chatroom) => dispatch(selectChatroom(chatroom))}
            onDelete={handleDeleteChatroom}
            onCreate={() => setIsCreateModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={(query) => dispatch(setSearchQuery(query))}
            selectedChatroomId={currentChatroom?.id}
          />
        </div>
        <div
          className={`
          ${currentChatroom ? "flex" : "hidden md:flex"} 
          flex-1 flex-col
        `}
        >
          {currentChatroom ? (
            <ChatInterface
              chatroom={currentChatroom}
              messages={currentMessages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onBack={handleBackToList}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Select a chatroom</h3>
                <p className="text-sm">
                  Choose a chatroom from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateChatroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateChatroom}
      />

      <ToastContainer />
    </>
  );
};

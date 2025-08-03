import { useState, useCallback } from 'react';
import { MessageLogo } from '~/assets/images/icons';
import {
  useConversations,
  useConversationMessages,
  useMessagesRealtime,
  usePresence,
} from '../../hooks';
import { AccountItemLoadingSkeleton, AccountMessageItem } from './components';
import ChatForm from './ChatForm';

function Messages() {
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);

  const { isUserOnline } = usePresence();

  // Custom hooks để quản lý state
  const {
    conversations,
    isLoadingConversations,
    updateConversationLastMessage,
    resetUnreadCount,
    incrementUnreadCount,
    getUnreadCount,
  } = useConversations();

  const {
    loadMessagesForConversation,
    addMessageToConversation,
    setMessagesForConversation,
    getMessagesForConversation,
    isConversationLoading,
    ensureConversationMessages,
  } = useConversationMessages();

  // Real-time subscriptions
  useMessagesRealtime({
    selectedUserInfo,
    updateConversationLastMessage,
    addMessageToConversation,
    incrementUnreadCount,
    ensureConversationMessages,
  });

  // Function để handle chọn conversation
  const handleSelectConversation = useCallback(
    (conv) => {
      setSelectedUserInfo(conv);

      // Reset unread count cho conversation này khi user chọn xem
      resetUnreadCount(conv.partner_id);

      // Load tin nhắn nếu chưa có
      loadMessagesForConversation(conv.partner_id);
    },
    [resetUnreadCount, loadMessagesForConversation],
  );

  // Helper function để tính số tin nhắn chưa đọc cho một conversation
  const getUnreadMessageCount = useCallback(
    (conv) => {
      // Sử dụng unread count từ database thông qua custom hook
      return getUnreadCount(conv.partner_id);
    },
    [getUnreadCount],
  );

  return (
    <div className="w-full ml-0 lg:w-[calc(100%-72px)] lg:ml-[72px] flex justify-start h-screen">
      <aside className="z-[98] w-[320px] h-full bg-white opacity-100 border-r border-r-[rgba(0,0,0,0.12)] flex flex-col">
        <div className="h-[72px] w-full flex flex-shrink-0 ml-[16px] pt-[24px] pb-[16px]">
          <h2 className="text-[20px] font-bold">Messages</h2>
        </div>
        <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
          {/* Hiển thị loading skeletons khi đang fetch conversations */}
          {isLoadingConversations
            ? // Hiển thị 5 skeleton items
              Array.from({ length: 5 }).map((_, index) => (
                <AccountItemLoadingSkeleton key={`skeleton-${index}`} />
              ))
            : // Map qua danh sách cuộc trò chuyện thật
              conversations.map((conv) => (
                <AccountMessageItem
                  key={conv.partner_id}
                  partnerInfo={conv}
                  onClick={() => handleSelectConversation(conv)}
                  isSelected={selectedUserInfo?.partner_id === conv.partner_id}
                  newMessageCount={getUnreadMessageCount(conv)}
                  isOnline={isUserOnline(conv.partner_id)}
                />
              ))}
        </div>
      </aside>
      <div className="flex-1 flex justify-center items-center">
        {selectedUserInfo ? (
          <ChatForm
            receiverInfo={selectedUserInfo}
            messages={
              Array.isArray(getMessagesForConversation(selectedUserInfo.partner_id)) 
                ? getMessagesForConversation(selectedUserInfo.partner_id)
                : []
            }
            isLoadingMessages={isConversationLoading(
              selectedUserInfo.partner_id,
            )}
            onSetMessages={setMessagesForConversation}
            isReceiverOnline={isUserOnline(selectedUserInfo.partner_id)}
          />
        ) : (
          <MessageLogo className="fill-[rgba(0,0,0,0.12)]" />
        )}
      </div>
    </div>
  );
}

export default Messages;

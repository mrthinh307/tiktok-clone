import { useEffect } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import supabase from '~/config/supabaseClient';

/**
 * Hook để quản lý real-time subscriptions cho messages
 */
const useMessagesRealtime = ({
  selectedUserInfo,
  updateConversationLastMessage,
  addMessageToConversation,
  incrementUnreadCount,
  ensureConversationMessages,
}) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.sub) return;

    // Subscription 1: Tin nhắn ta gửi đi
    const channelSent = supabase
      .channel(`sent-messages:${user.sub}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.sub}`,
        },
        (payload) => {
          const newMessage = payload.new;
          const partnerId = newMessage.receiver_id; // Người ta gửi cho

          // Cập nhật last message cho conversation tương ứng
          updateConversationLastMessage(partnerId, newMessage);

          // Nếu tin nhắn là cho conversation hiện tại đang được chọn
          if (selectedUserInfo && partnerId === selectedUserInfo.partner_id) {
            // Thêm tin nhắn vào conversation hiện tại
            addMessageToConversation(partnerId, newMessage);
          }
        },
      )
      .subscribe();

    // Subscription 2: Tin nhắn ta nhận về
    const channelReceived = supabase
      .channel(`received-messages:${user.sub}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.sub}`,
        },
        (payload) => {
          const newMessage = payload.new;
          const partnerId = newMessage.sender_id; // Người gửi cho ta

          // Cập nhật last message cho conversation tương ứng
          updateConversationLastMessage(partnerId, newMessage);

          // Nếu tin nhắn là cho conversation hiện tại đang được chọn
          if (selectedUserInfo && partnerId === selectedUserInfo.partner_id) {
            addMessageToConversation(partnerId, newMessage);
          } else {
            // Nếu không phải conversation đang được chọn
            // Tăng unread count
            incrementUnreadCount(partnerId);

            // Thêm tin nhắn vào conversation hoặc load nếu chưa có
            ensureConversationMessages(partnerId, newMessage);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSent);
      supabase.removeChannel(channelReceived);
    };
  }, [
    user?.sub,
    selectedUserInfo,
    updateConversationLastMessage,
    addMessageToConversation,
    incrementUnreadCount,
    ensureConversationMessages,
  ]);
};

export default useMessagesRealtime;

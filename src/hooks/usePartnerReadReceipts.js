import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { useReadReceipts } from '~/hooks';
import supabase from '~/config/supabaseClient';

/**
 * Hook để quản lý read receipts của partner (để hiển thị read status)
 * @param {string} partnerId - ID của partner
 * @param {array} messages - Array tin nhắn trong conversation
 * @returns {object} Object chứa read receipt info và helper functions
 */
const usePartnerReadReceipts = (partnerId, messages) => {
  const [partnerReadReceipt, setPartnerReadReceipt] = useState(null);
  const { user } = useAuth();
  const { getPartnerReadReceipt } = useReadReceipts();

  // Load read receipt của partner khi conversation thay đổi
  useEffect(() => {
    const loadPartnerReadReceipt = async () => {
      if (partnerId && user?.sub) {
        const receipt = await getPartnerReadReceipt(partnerId);
        setPartnerReadReceipt(receipt);
      }
    };

    loadPartnerReadReceipt();
  }, [partnerId, user?.sub, getPartnerReadReceipt]);

  // Real-time subscription để cập nhật read receipt của partner
  useEffect(() => {
    if (!partnerId || !user?.sub) return;

    const channel = supabase
      .channel(`partner-read-receipts:${partnerId}:${user.sub}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'read_receipts',
          filter: `user_id=eq.${partnerId}`,
        },
        (payload) => {
          if (payload.new?.conversation_partner_id === user.sub) {
            setPartnerReadReceipt(payload.new);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId, user?.sub]);

  // Helper function để check xem tin nhắn có được partner đọc chưa
  const isMessageReadByPartner = useCallback(
    (message) => {
      // Chỉ check read status cho tin nhắn của chính mình
      if (message.sender_id !== user?.sub) {
        return false;
      }

      if (!partnerReadReceipt || !partnerReadReceipt.last_read_message_id) {
        return false;
      }

      // Nếu tin nhắn có cùng ID với last_read_message_id thì chắc chắn đã được đọc
      if (message.id === partnerReadReceipt.last_read_message_id) {
        return true;
      }

      // Tìm vị trí của tin nhắn hiện tại và tin nhắn cuối cùng đã đọc
      const currentMessageIndex = messages.findIndex(
        (msg) => msg.id === message.id,
      );
      const lastReadMessageIndex = messages.findIndex(
        (msg) => msg.id === partnerReadReceipt.last_read_message_id,
      );

      // Nếu không tìm thấy một trong hai tin nhắn thì không thể xác định
      if (currentMessageIndex === -1 || lastReadMessageIndex === -1) {
        // Fallback: so sánh theo timestamp
        const messageTime = new Date(message.created_at);
        const lastReadTime = new Date(partnerReadReceipt.last_read_at);
        return messageTime <= lastReadTime;
      }

      // Nếu tin nhắn hiện tại có index <= lastReadMessageIndex thì đã được đọc
      return currentMessageIndex <= lastReadMessageIndex;
    },
    [partnerReadReceipt, user?.sub, messages],
  );

  // Helper function để check xem tin nhắn có phải là tin cuối cùng của conversation không
  const isLastMessageOfConversation = useCallback((message, messages) => {
    if (!messages || messages.length === 0) return false;

    const lastMessage = messages[messages.length - 1];
    return message.id === lastMessage.id;
  }, []);

  return {
    partnerReadReceipt,
    isMessageReadByPartner,
    isLastMessageOfConversation,
  };
};

export default usePartnerReadReceipts;

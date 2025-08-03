import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { useReadReceipts } from '~/hooks';
import supabase from '~/config/supabaseClient';

/**
 * Hook để quản lý danh sách conversations và unread counts
 */
const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [readReceipts, setReadReceipts] = useState({});
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const { user } = useAuth();
  const {
    getReadReceiptsForConversations,
    countUnreadMessagesForConversations,
  } = useReadReceipts();

  // Fetch conversations và related data
  useEffect(() => {
    const fetchConversationsAndReadReceipts = async () => {
      if (!user?.sub) return;

      setIsLoadingConversations(true);
      try {
        const { data, error } = await supabase.rpc(
          'get_conversations_for_user',
          {
            p_user_id: user.sub,
          },
        );

        if (error) {
          throw new Error(`Failed to fetch conversations: ${error.message}`);
        }

        if (data && data.length > 0) {
          setConversations(data);

          // Fetch read receipts cho tất cả conversations
          const partnerIds = data.map((conv) => conv.partner_id);
          const receipts = await getReadReceiptsForConversations(partnerIds);
          setReadReceipts(receipts);

          // Fetch unread counts từ database cho tất cả conversations
          const counts = await countUnreadMessagesForConversations(partnerIds);
          setUnreadCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversationsAndReadReceipts();
  }, [
    user?.sub,
    getReadReceiptsForConversations,
    countUnreadMessagesForConversations,
  ]);

  // Update last message của conversation
  const updateConversationLastMessage = useCallback((partnerId, newMessage) => {
    setConversations((prev) => {
      const existingConv = prev.find((conv) => conv.partner_id === partnerId);
      if (existingConv) {
        // Xác định nội dung hiển thị cho last message
        let displayContent = newMessage.content;
        if (newMessage.type === 'image') {
          displayContent = 'sent a photo';
        } else if (newMessage.type === 'video') {
          displayContent = 'sent a video';
        }

        const updatedConversations = prev.map((conv) =>
          conv.partner_id === partnerId
            ? {
                ...conv,
                last_message: displayContent,
                last_time: newMessage.created_at || new Date().toISOString(),
              }
            : conv,
        );

        // Sắp xếp lại để conversation có tin nhắn mới nhất lên đầu
        return updatedConversations.sort(
          (a, b) => new Date(b.last_time) - new Date(a.last_time),
        );
      }
      return prev;
    });
  }, []);

  // Reset unread count khi user chọn conversation
  const resetUnreadCount = useCallback((partnerId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [partnerId]: 0,
    }));
  }, []);

  // Increment unread count khi nhận tin nhắn mới
  const incrementUnreadCount = useCallback((partnerId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [partnerId]: (prev[partnerId] || 0) + 1,
    }));
  }, []);

  // Get unread count cho một conversation
  const getUnreadCount = useCallback(
    (partnerId) => {
      return unreadCounts[partnerId] || 0;
    },
    [unreadCounts],
  );

  return {
    conversations,
    isLoadingConversations,
    unreadCounts,
    readReceipts,
    updateConversationLastMessage,
    resetUnreadCount,
    incrementUnreadCount,
    getUnreadCount,
  };
};

export default useConversations;

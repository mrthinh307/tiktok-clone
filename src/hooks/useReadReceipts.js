import { useCallback } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import supabase from '~/config/supabaseClient';

/**
 * Hook để quản lý read receipts - tracking tin nhắn cuối cùng mà user đã đọc
 */
const useReadReceipts = () => {
  const { user } = useAuth();

  /**
   * Cập nhật read receipt khi user đọc tin nhắn
   * @param {string} partnerId - ID của partner trong conversation
   * @param {string} lastReadMessageId - ID của tin nhắn cuối cùng đã đọc
   */
  const updateReadReceipt = useCallback(
    async (partnerId, lastReadMessageId) => {
      if (!user?.sub || !partnerId || !lastReadMessageId) return;

      try {
        const { error } = await supabase.from('read_receipts').upsert(
          {
            user_id: user.sub,
            conversation_partner_id: partnerId,
            last_read_message_id: lastReadMessageId,
            last_read_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,conversation_partner_id',
          },
        );

        if (error) {
          console.error('Error updating read receipt:', error);
        } else {
          console.log(`📖 Updated read receipt for partner ${partnerId}`);
        }
      } catch (error) {
        console.error('Error in updateReadReceipt:', error);
      }
    },
    [user?.sub],
  );

  /**
   * Lấy read receipt cho một conversation
   * @param {string} partnerId - ID của partner
   * @returns {Promise<object|null>} Read receipt data hoặc null
   */
  const getReadReceipt = useCallback(
    async (partnerId) => {
      if (!user?.sub || !partnerId) return null;

      try {
        const { data, error } = await supabase
          .from('read_receipts')
          .select('*')
          .eq('user_id', user.sub)
          .eq('conversation_partner_id', partnerId)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned, đây là trường hợp bình thường
          console.error('Error fetching read receipt:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in getReadReceipt:', error);
        return null;
      }
    },
    [user?.sub],
  );

  /**
   * Lấy read receipt của partner để biết partner đã đọc đến đâu
   * @param {string} partnerId - ID của partner
   * @returns {Promise<object|null>} Read receipt data hoặc null
   */
  const getPartnerReadReceipt = useCallback(
    async (partnerId) => {
      if (!user?.sub || !partnerId) return null;

      try {
        const { data, error } = await supabase
          .from('read_receipts')
          .select('*')
          .eq('user_id', partnerId) // Partner đã đọc
          .eq('conversation_partner_id', user.sub) // Trong conversation với mình
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned, đây là trường hợp bình thường
          console.error('Error fetching partner read receipt:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in getPartnerReadReceipt:', error);
        return null;
      }
    },
    [user?.sub],
  );

  /**
   * Lấy read receipts cho tất cả conversations (dùng khi fetch danh sách conversations)
   * @param {string[]} partnerIds - Array các partner IDs
   * @returns {Promise<object>} Object với key là partnerId, value là read receipt data
   */
  const getReadReceiptsForConversations = useCallback(
    async (partnerIds) => {
      if (!user?.sub || !partnerIds || partnerIds.length === 0) return {};

      try {
        const { data, error } = await supabase
          .from('read_receipts')
          .select('*')
          .eq('user_id', user.sub)
          .in('conversation_partner_id', partnerIds);

        if (error) {
          console.error('Error fetching read receipts:', error);
          return {};
        }

        // Convert array thành object với key là partnerId
        const readReceiptsMap = {};
        data?.forEach((receipt) => {
          readReceiptsMap[receipt.conversation_partner_id] = receipt;
        });

        return readReceiptsMap;
      } catch (error) {
        console.error('Error in getReadReceiptsForConversations:', error);
        return {};
      }
    },
    [user?.sub],
  );

  /**
   * Đếm tin nhắn chưa đọc trực tiếp từ database (không cần load toàn bộ messages)
   * @param {string} partnerId - ID của partner
   * @returns {Promise<number>} Số tin nhắn chưa đọc
   */
  const countUnreadMessagesFromDB = useCallback(
    async (partnerId) => {
      if (!user?.sub || !partnerId) return 0;

      try {
        const { data, error } = await supabase.rpc('count_unread_messages', {
          p_user_id: user.sub,
          p_partner_id: partnerId,
        });

        if (error) {
          console.error('Error counting unread messages:', error);
          return 0;
        }

        return data || 0;
      } catch (error) {
        console.error('Error in countUnreadMessagesFromDB:', error);
        return 0;
      }
    },
    [user?.sub],
  );

  /**
   * Đếm tin nhắn chưa đọc cho nhiều conversations cùng lúc từ database
   * @param {string[]} partnerIds - Array các partner IDs
   * @returns {Promise<object>} Object với key là partnerId, value là unread count
   */
  const countUnreadMessagesForConversations = useCallback(
    async (partnerIds) => {
      if (!user?.sub || !partnerIds || partnerIds.length === 0) return {};

      try {
        // Gọi function cho từng partner (có thể optimize bằng cách tạo function batch trong SQL)
        const promises = partnerIds.map(async (partnerId) => {
          const count = await countUnreadMessagesFromDB(partnerId);
          return { partnerId, count };
        });

        const results = await Promise.all(promises);

        // Convert array thành object với key là partnerId
        const unreadCountsMap = {};
        results.forEach(({ partnerId, count }) => {
          unreadCountsMap[partnerId] = count;
        });

        return unreadCountsMap;
      } catch (error) {
        console.error('Error in countUnreadMessagesForConversations:', error);
        return {};
      }
    },
    [countUnreadMessagesFromDB, user?.sub],
  );

  /**
   * Đếm số tin nhắn chưa đọc dựa trên read receipt
   * @param {Array} messages - Array tin nhắn trong conversation
   * @param {string} partnerId - ID của partner
   * @param {object} readReceipt - Read receipt data
   * @returns {number} Số tin nhắn chưa đọc
   */
  const countUnreadMessages = useCallback(
    (messages, partnerId, readReceipt) => {
      if (!messages || messages.length === 0) return 0;
      if (!readReceipt || !readReceipt.last_read_message_id) {
        // Nếu chưa có read receipt, đếm tất cả tin nhắn từ partner
        return messages.filter((msg) => msg.sender_id === partnerId).length;
      }

      // Tìm index của tin nhắn cuối cùng đã đọc
      const lastReadIndex = messages.findIndex(
        (msg) => msg.id === readReceipt.last_read_message_id,
      );

      if (lastReadIndex === -1) {
        // Không tìm thấy tin nhắn đã đọc, có thể tin nhắn đã bị xóa
        // Đếm tất cả tin nhắn từ partner
        return messages.filter((msg) => msg.sender_id === partnerId).length;
      }

      // Đếm tin nhắn từ partner sau tin nhắn cuối cùng đã đọc
      let unreadCount = 0;
      for (let i = lastReadIndex + 1; i < messages.length; i++) {
        if (messages[i].sender_id === partnerId) {
          unreadCount++;
        }
      }

      return unreadCount;
    },
    [],
  );

  /**
   * Đánh dấu conversation là đã đọc (đọc tin nhắn cuối cùng)
   * @param {Array} messages - Array tin nhắn trong conversation
   * @param {string} partnerId - ID của partner
   */
  const markConversationAsRead = useCallback(
    async (messages, partnerId) => {
      if (!messages || messages.length === 0) return;

      // Tìm tin nhắn cuối cùng
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        await updateReadReceipt(partnerId, lastMessage.id);
      }
    },
    [updateReadReceipt],
  );

  return {
    updateReadReceipt,
    getReadReceipt,
    getPartnerReadReceipt,
    getReadReceiptsForConversations,
    countUnreadMessages,
    countUnreadMessagesFromDB,
    countUnreadMessagesForConversations,
    markConversationAsRead,
  };
};

export default useReadReceipts;

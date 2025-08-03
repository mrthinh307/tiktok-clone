import { useState, useCallback } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import supabase from '~/config/supabaseClient';

/**
 * Hook để quản lý conversation messages và loading states
 */
const useConversationMessages = () => {
  const [conversationMessages, setConversationMessages] = useState({}); // {partnerId: [messages]}
  const [loadingConversations, setLoadingConversations] = useState(new Set()); // Set of partnerIds being loaded

  const { user } = useAuth();

  // Load tin nhắn cho một conversation
  const loadMessagesForConversation = useCallback(
    async (partnerId) => {
      // Nếu đã có tin nhắn hoặc đang loading thì không load lại
      if (
        conversationMessages[partnerId] ||
        loadingConversations.has(partnerId)
      ) {
        return;
      }

      setLoadingConversations((prev) => new Set([...prev, partnerId]));

      try {
        const { data, error } = await supabase.rpc(
          'get_messages_between_users',
          {
            sender: user.sub,
            receiver: partnerId,
          },
        );

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        setConversationMessages((prev) => ({
          ...prev,
          [partnerId]: data || [],
        }));
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoadingConversations((prev) => {
          const newSet = new Set(prev);
          newSet.delete(partnerId);
          return newSet;
        });
      }
    },
    [user?.sub, conversationMessages, loadingConversations],
  );

  // Thêm tin nhắn mới vào conversation
  const addMessageToConversation = useCallback((partnerId, newMessage) => {
    setConversationMessages((prev) => {
      const existingMessages = prev[partnerId] || [];

      // Kiểm tra nếu tin nhắn đã tồn tại (theo ID)
      const messageExists = existingMessages.some(
        (msg) => msg.id === newMessage.id,
      );

      if (messageExists) {
        console.log(
          'Message with same ID already exists, skipping:',
          newMessage.id,
        );
        return prev;
      }

      // Đối với tin nhắn văn bản, kiểm tra xem có optimistic message nào giống không
      if (newMessage.type === 'text') {
        const hasOptimisticMessage = existingMessages.some(
          (msg) =>
            msg.id &&
            msg.id.toString().startsWith('temp_') &&
            msg.content === newMessage.content &&
            msg.type === newMessage.type &&
            msg.sender_id === newMessage.sender_id,
        );

        if (hasOptimisticMessage) {
          return prev;
        }
      }

      // Đối với file (image/video), thay thế optimistic message bằng real message
      if (newMessage.type !== 'text') {
        const optimisticIndex = existingMessages.findIndex(
          (msg) =>
            msg.id &&
            msg.id.toString().startsWith('temp_') &&
            msg.content !== newMessage.content && // URL khác nhau (local vs remote)
            msg.type === newMessage.type &&
            msg.sender_id === newMessage.sender_id,
        );

        if (optimisticIndex !== -1) {
          const updatedMessages = [...existingMessages];
          updatedMessages[optimisticIndex] = newMessage;
          return {
            ...prev,
            [partnerId]: updatedMessages,
          };
        }
      }

      return {
        ...prev,
        [partnerId]: [...existingMessages, newMessage],
      };
    });
  }, []);

  // Set tin nhắn cho conversation (dùng cho optimistic updates)
  const setMessagesForConversation = useCallback((partnerId, messagesOrUpdater) => {
    setConversationMessages((prev) => {
      if (typeof messagesOrUpdater === 'function') {
        // Nếu là function updater
        const currentMessages = prev[partnerId] || [];
        const newMessages = messagesOrUpdater(currentMessages);
        return {
          ...prev,
          [partnerId]: newMessages,
        };
      } else {
        // Nếu là array trực tiếp
        return {
          ...prev,
          [partnerId]: messagesOrUpdater,
        };
      }
    });
  }, []);

  // Get messages cho một conversation
  const getMessagesForConversation = useCallback(
    (partnerId) => {
      return conversationMessages[partnerId] || [];
    },
    [conversationMessages],
  );

  // Check nếu conversation đang loading
  const isConversationLoading = useCallback(
    (partnerId) => {
      return loadingConversations.has(partnerId);
    },
    [loadingConversations],
  );

  // Thêm tin nhắn vào conversation nếu chưa có, nếu có rồi thì load
  const ensureConversationMessages = useCallback(
    (partnerId, newMessage) => {
      setConversationMessages((prev) => {
        // Nếu chưa có conversation, load tin nhắn
        if (!prev[partnerId]) {
          loadMessagesForConversation(partnerId);
          return prev;
        }

        const existingMessages = prev[partnerId];
        return {
          ...prev,
          [partnerId]: [...existingMessages, newMessage],
        };
      });
    },
    [loadMessagesForConversation],
  );

  return {
    conversationMessages,
    loadMessagesForConversation,
    addMessageToConversation,
    setMessagesForConversation,
    getMessagesForConversation,
    isConversationLoading,
    ensureConversationMessages,
  };
};

export default useConversationMessages;

import { useEffect, useRef, useCallback } from 'react';
import useReadReceipts from './useReadReceipts';

/**
 * Hook để auto-update read receipt khi user đang xem conversation
 * @param {Array} messages - Array tin nhắn trong conversation
 * @param {string} partnerId - ID của partner
 * @param {boolean} isActive - Conversation có đang được chọn không
 */
const useAutoReadReceipt = (messages, partnerId, isActive) => {
  const { updateReadReceipt } = useReadReceipts();
  const lastUpdateRef = useRef(null);
  const timeoutRef = useRef(null);

  /**
   * Update read receipt sau một khoảng delay để tránh spam requests
   */
  const debouncedUpdateReadReceipt = useCallback(
    (messageId) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (lastUpdateRef.current !== messageId) {
          updateReadReceipt(partnerId, messageId);
          lastUpdateRef.current = messageId;
        }
      }, 1000); // Delay 1 giây để avoid spam
    },
    [updateReadReceipt, partnerId],
  );

  useEffect(() => {
    if (!isActive || !messages || messages.length === 0 || !partnerId) {
      return;
    }

    // Tìm tin nhắn cuối cùng từ partner (không phải từ chính mình)
    const lastPartnerMessage = [...messages]
      .reverse()
      .find((msg) => msg.sender_id === partnerId);

    if (lastPartnerMessage && lastPartnerMessage.id) {
      debouncedUpdateReadReceipt(lastPartnerMessage.id);
    }

    // Cleanup timeout khi component unmount hoặc dependencies thay đổi
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages, partnerId, isActive, debouncedUpdateReadReceipt]);

  // Cleanup timeout khi component unmount
};

export default useAutoReadReceipt;

import { useState, useCallback } from 'react';

/**
 * Hook để quản lý việc select/deselect message để hiển thị timestamp chi tiết
 * @returns {object} Object chứa selectedMessageId và handler functions
 */
const useMessageSelection = () => {
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  /**
   * Handle click vào tin nhắn để toggle timestamp chi tiết
   * @param {string|number} messageId - ID của tin nhắn
   */
  const handleMessageClick = useCallback((messageId) => {
    setSelectedMessageId((prev) => (prev === messageId ? null : messageId));
  }, []);

  /**
   * Clear selection (ẩn tất cả timestamp chi tiết)
   */
  const clearSelection = useCallback(() => {
    setSelectedMessageId(null);
  }, []);

  /**
   * Check xem tin nhắn có đang được chọn không
   * @param {string|number} messageId - ID của tin nhắn
   * @returns {boolean} True if message is selected
   */
  const isMessageSelected = useCallback(
    (messageId) => {
      return selectedMessageId === messageId;
    },
    [selectedMessageId],
  );

  return {
    selectedMessageId,
    handleMessageClick,
    clearSelection,
    isMessageSelected,
  };
};

export default useMessageSelection;

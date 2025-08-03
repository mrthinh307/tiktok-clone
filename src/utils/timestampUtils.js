/**
 * Utility functions for formatting timestamps in chat messages
 */

/**
 * Format thời gian cho system message (hiển thị giữa các tin nhắn)
 * @param {string} timestamp - ISO timestamp string
 * @param {string|null} previousTimestamp - ISO timestamp string của tin nhắn trước đó
 * @returns {string} Formatted timestamp string
 */
export const formatSystemTime = (timestamp, previousTimestamp = null) => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset thời gian về 00:00:00 để so sánh chỉ ngày
  const messageDateOnly = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  const timeString = messageDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Nếu có tin nhắn trước đó và cùng ngày
  if (previousTimestamp) {
    const previousDate = new Date(previousTimestamp);
    const previousDateOnly = new Date(
      previousDate.getFullYear(),
      previousDate.getMonth(),
      previousDate.getDate(),
    );

    // Nếu cùng ngày, chỉ hiển thị giờ
    if (messageDateOnly.getTime() === previousDateOnly.getTime()) {
      return timeString;
    }
  }

  // Logic cho ngày khác nhau hoặc tin nhắn đầu tiên
  if (messageDateOnly.getTime() === todayOnly.getTime()) {
    // Hôm nay - hiển thị giờ với label "Today"
    return `Today ${timeString}`;
  } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
    // Hôm qua
    return `Yesterday ${timeString}`;
  } else {
    // Ngày khác - hiển thị đầy đủ với format 24h
    return (
      messageDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) +
      ' ' +
      timeString
    );
  }
};

/**
 * Format timestamp chi tiết khi click vào tin nhắn
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Detailed formatted timestamp string
 */
export const formatDetailedTimestamp = (timestamp) => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDateOnly = new Date(
    messageDate.getFullYear(),
    messageDate.getMonth(),
    messageDate.getDate(),
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate(),
  );

  const timeString = messageDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateString = messageDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (messageDateOnly.getTime() === todayOnly.getTime()) {
    return `Today ${timeString}`;
  } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
    return `Yesterday ${timeString}`;
  } else {
    return `${dateString} ${timeString}`;
  }
};

/**
 * Check xem có cần hiển thị system timestamp không
 * @param {object} message - Message object
 * @param {array} messages - Array of all messages
 * @returns {boolean} True if should show timestamp
 */
export const shouldShowSystemTimestamp = (message, messages) => {
  const messageIndex = messages.findIndex((msg) => msg.id === message.id);
  if (messageIndex === 0) return true; // Tin nhắn đầu tiên luôn hiển thị

  const currentDate = new Date(message.created_at);
  const previousMessage = messages[messageIndex - 1];
  const previousDate = new Date(previousMessage.created_at);

  // Check nếu khác ngày
  const currentDateOnly = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const previousDateOnly = new Date(
    previousDate.getFullYear(),
    previousDate.getMonth(),
    previousDate.getDate(),
  );

  if (currentDateOnly.getTime() !== previousDateOnly.getTime()) {
    return true; // Khác ngày thì hiển thị
  }

  // Check nếu cách nhau > 5 phút
  const timeDifference = Math.abs(currentDate - previousDate);
  const fiveMinutesInMs = 5 * 60 * 1000; // 5 phút = 300,000ms

  return timeDifference > fiveMinutesInMs;
};

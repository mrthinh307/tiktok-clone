import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import useSendMessage from '~/hooks/useSendMessage';
import {
  useAutoReadReceipt,
  useMessageSelection,
  usePartnerReadReceipts,
} from '~/hooks';
import {
  formatSystemTime,
  formatDetailedTimestamp,
  shouldShowSystemTimestamp,
} from '~/utils/timestampUtils';
import {
  ChatHeader,
  ChatInput,
  MessageBubble,
  SystemTimestamp,
  StickerPicker,
  ChatLoadingSkeleton,
} from './components';

function ChatForm({
  receiverInfo,
  messages,
  isLoadingMessages,
  onSetMessages,
  isReceiverOnline,
}) {
  const [newMessage, setNewMessage] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const chatEndRef = useRef(null);
  const pickerRef = useRef(null);
  const smileButtonRef = useRef(null);

  // Custom hooks
  const { handleSendMessage, handleFileUpload, handleSendSticker } =
    useSendMessage(receiverInfo, messages || [], onSetMessages);

  const { selectedMessageId, handleMessageClick } = useMessageSelection();

  const { isMessageReadByPartner, isLastMessageOfConversation } =
    usePartnerReadReceipts(receiverInfo?.partner_id, messages || []);

  // Auto-update read receipt khi user đang xem conversation
  useAutoReadReceipt(messages, receiverInfo?.partner_id, true);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleMediaLoad = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Toggle sticker picker
  const handleToggleSticker = useCallback(() => {
    setIsPickerOpen((prev) => !prev);
  }, []);

  // Handle click outside sticker picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        smileButtonRef.current &&
        !smileButtonRef.current.contains(event.target)
      ) {
        setIsPickerOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Chat Header */}
      <ChatHeader
        receiverInfo={receiverInfo}
        isReceiverOnline={isReceiverOnline}
      />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-[1.6rem]">
        {isLoadingMessages ? (
          <ChatLoadingSkeleton />
        ) : (
          <div className="space-y-[1.6rem]">
            {messages.map((msg, index) => {
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const shouldShowTimestamp = shouldShowSystemTimestamp(
                msg,
                messages,
              );

              return (
                <div key={msg.id}>
                  {/* System timestamp - hiển thị khi cần thiết */}
                  {shouldShowTimestamp && (
                    <SystemTimestamp
                      timestamp={formatSystemTime(
                        msg.created_at,
                        previousMessage?.created_at,
                      )}
                    />
                  )}

                  {/* Message bubble */}
                  <MessageBubble
                    message={msg}
                    receiverInfo={receiverInfo}
                    onMediaLoad={handleMediaLoad}
                    isReadByPartner={isMessageReadByPartner(msg)}
                    isLastInConversation={isLastMessageOfConversation(
                      msg,
                      messages,
                    )}
                    selectedMessageId={selectedMessageId}
                    onMessageClick={handleMessageClick}
                    formatDetailedTimestamp={formatDetailedTimestamp}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input Area */}
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onToggleSticker={handleToggleSticker}
        smileButtonRef={smileButtonRef}
      />

      {/* Sticker Picker - Positioned Absolutely */}
      <AnimatePresence>
        {isPickerOpen && (
          <motion.div
            ref={pickerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[6rem] right-[1.6rem] w-fit h-[30rem] z-10"
          >
            <StickerPicker
              onSelectSticker={(sticker) =>
                handleSendSticker(sticker, setNewMessage)
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

ChatForm.propTypes = {
  receiverInfo: PropTypes.shape({
    partner_id: PropTypes.string.isRequired,
    partner_avatar_url: PropTypes.string.isRequired,
    partner_full_name: PropTypes.string.isRequired,
    partner_nickname: PropTypes.string.isRequired,
  }).isRequired,
  messages: PropTypes.array,
  isLoadingMessages: PropTypes.bool.isRequired,
  onSetMessages: PropTypes.func.isRequired,
  isReceiverOnline: PropTypes.bool.isRequired,
};

export default ChatForm;

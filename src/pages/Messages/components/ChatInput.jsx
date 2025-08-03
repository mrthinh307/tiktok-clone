import { useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SmileIcon,
  UploadImageIcon,
  MessageSolidIcon,
} from '~/assets/images/icons';

const ChatInput = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onFileUpload,
  onToggleSticker,
  smileButtonRef,
}) => {
  const imageInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e, newMessage, setNewMessage);
    }
  };
  return (
    <div className="border-t border-gray-200 p-[1.2rem] bg-white">
      <div className="flex items-center gap-[1.6rem]">
        {/* Input field for new messages */}
        <form
          onSubmit={(e) => onSendMessage(e, newMessage, setNewMessage)}
          className="flex-1 flex items-center bg-gray-100 rounded-[0.8rem] px-[0.8rem] sm:px-[1.6rem]"
        >
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="w-full bg-transparent py-[1rem] px-[0.8rem] sm:px-0 text-[1.6rem] leading-[24px] text-gray-800 placeholder-gray-400 border-none outline-none caret-primary"
            />
          </div>

          <div className="flex items-center gap-[0.6rem]">
            <input
              type="file"
              ref={imageInputRef}
              onChange={onFileUpload}
              className="hidden"
              accept="image/*,video/*"
            />
            <button
              type="button"
              onClick={() => imageInputRef?.current.click()}
            >
              <UploadImageIcon className="w-[2.4rem] h-[2.4rem]" />
            </button>
            <button
              ref={smileButtonRef}
              type="button"
              onClick={onToggleSticker}
            >
              <SmileIcon className="w-[2.4rem] h-[2.4rem]" />
            </button>
          </div>
        </form>

        {/* Send button */}
        <AnimatePresence>
          {newMessage.trim() && (
            <motion.button
              type="button"
              onClick={(e) => onSendMessage(e, newMessage, setNewMessage)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-primary hover:text-pink-600 transition-colors"
            >
              <MessageSolidIcon className="w-[3.2rem] h-[3.2rem]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

ChatInput.propTypes = {
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  onToggleSticker: PropTypes.func.isRequired,
  smileButtonRef: PropTypes.object.isRequired,
};

export default ChatInput;

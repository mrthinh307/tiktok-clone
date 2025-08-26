import { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '~/contexts/AuthContext';
import ReadStatus from './ReadStatus';

const MessageBubble = memo(
  ({
    message,
    receiverInfo,
    onMediaLoad,
    isReadByPartner,
    isLastInConversation,
    selectedMessageId,
    onMessageClick,
    formatDetailedTimestamp,
  }) => {
    const { user } = useAuth();
    const [mediaError, setMediaError] = useState(false);

    if (message.type === 'system') {
      return (
        <div className="text-center my-[1.6rem]">
          <span className="text-[1.2rem] text-gray-500">{message.content}</span>
        </div>
      );
    }

    const isMe = message.sender_id === user.sub;
    const isSelected = selectedMessageId === message.id;
    const shouldShowReadStatus = isMe && isLastInConversation;

    const handleMediaError = (mediaType) => {
      console.log(`${mediaType} failed to load`);
      setMediaError(true);
    };

    const handleRetryMedia = () => {
      setMediaError(false);
    };

    const renderMediaContent = () => {
      if (message.type === 'text') {
        return (
          <p className="break-words leading-[21px] py-[7px] px-[12px] border border-[rgba(22,24,35,0.12)] rounded-[0.8rem]">
            {message.content}
          </p>
        );
      }

      if (message.type === 'image') {
        return !mediaError ? (
          <img
            src={message.content}
            alt="sent"
            className="w-full h-auto object-cover"
            onLoad={onMediaLoad}
            onError={() => handleMediaError('Image')}
          />
        ) : (
          <MediaErrorFallback
            emoji="🖼️"
            message="Failed to load image"
            onRetry={handleRetryMedia}
          />
        );
      }

      if (message.type === 'video') {
        return !mediaError ? (
          <video
            src={message.content}
            title="Sent video"
            className="w-full h-auto object-cover"
            controls
            onLoadedData={onMediaLoad}
            onError={() => handleMediaError('Video')}
          />
        ) : (
          <MediaErrorFallback
            emoji="🎥"
            message="Failed to load video"
            onRetry={handleRetryMedia}
          />
        );
      }

      return null;
    };

    return (
      <div
        className={`flex flex-col ${
          isMe ? 'items-end' : 'items-start'
        } mb-[0.8rem]`}
      >
        <div
          className={`flex items-start gap-[0.8rem] ${
            isMe ? 'justify-end' : ''
          } relative`}
        >
          {!isMe && (
            <img
              src={receiverInfo.partner_avatar_url}
              alt="avatar"
              className="w-[3.2rem] h-[3.2rem] rounded-full flex-shrink-0"
            />
          )}

          <div className="flex flex-col">
            <div
              className={`w-fit max-w-[360px] break-words rounded-[0.8rem] overflow-hidden relative cursor-pointer transition-all ${
                isMe ? 'bg-[rgba(22,24,35,0.06)]' : 'bg-transparent'
              } ${isSelected ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => onMessageClick(message.id)}
            >
              {renderMediaContent()}

              {/* Upload progress overlay */}
              {message.status === 'uploading' && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-[0.8rem]">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-white text-xl font-medium">
                    Uploading...
                  </span>
                </div>
              )}
            </div>

            {/* Detailed timestamp when selected */}
            {isSelected && (
              <div
                className={`text-[1.1rem] text-gray-500 mt-1 ${
                  isMe ? 'text-right' : 'text-left'
                }`}
              >
                {formatDetailedTimestamp(message.created_at)}
              </div>
            )}

            {/* Read Status - Only show on last message of conversation */}
            {shouldShowReadStatus && (
              <ReadStatus
                message={message}
                isRead={isReadByPartner}
                partnerAvatar={receiverInfo.partner_avatar_url}
              />
            )}
          </div>

          {isMe && (
            <img
              src={user.avatar_url}
              alt="avatar"
              className="w-[3.2rem] h-[3.2rem] rounded-full flex-shrink-0"
            />
          )}
        </div>
      </div>
    );
  },
);

// Component for media error fallback
const MediaErrorFallback = ({ emoji, message, onRetry }) => (
  <div className="w-full min-h-[120px] bg-gray-100 border border-gray-200 rounded-[0.8rem] flex flex-col items-center justify-center p-4">
    <div className="text-gray-400 text-2xl mb-2">{emoji}</div>
    <p className="text-gray-500 text-xl text-center">{message}</p>
    <button
      onClick={onRetry}
      className="text-blue-500 text-xl mt-2 hover:underline"
    >
      Try again
    </button>
  </div>
);

MediaErrorFallback.propTypes = {
  emoji: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sender_id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    status: PropTypes.string,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  receiverInfo: PropTypes.shape({
    partner_avatar_url: PropTypes.string,
  }).isRequired,
  onMediaLoad: PropTypes.func.isRequired,
  isReadByPartner: PropTypes.bool.isRequired,
  isLastInConversation: PropTypes.bool.isRequired,
  selectedMessageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onMessageClick: PropTypes.func.isRequired,
  formatDetailedTimestamp: PropTypes.func.isRequired,
};

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;

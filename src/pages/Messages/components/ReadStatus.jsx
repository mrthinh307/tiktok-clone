import { memo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '~/contexts/AuthContext';

/**
 * Component hiển thị trạng thái đã xem tin nhắn theo style Messenger
 */
const ReadStatus = memo(({ message, isRead, partnerAvatar }) => {
  // Chỉ hiển thị read status cho tin nhắn của mình
  const { user } = useAuth();
  const isMyMessage = message.sender_id === user?.sub;

  if (!isMyMessage) return null;

  return (
    <div className="flex items-center mt-[0.4rem] justify-end">
      {isRead ? (
        // Khi partner đã đọc → hiển thị avatar nhỏ của partner
        <img
          src={partnerAvatar}
          alt="Read by partner"
          className="w-[1.6rem] h-[1.6rem] rounded-full border border-white shadow-sm"
          title="Seen"
        />
      ) : (
        // Khi chưa được đọc → hiển thị text "Sent"
        <span className="text-[1.2rem] text-muted">Sent</span>
      )}
    </div>
  );
});

ReadStatus.propTypes = {
  message: PropTypes.shape({
    sender_id: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  isRead: PropTypes.bool.isRequired,
  partnerAvatar: PropTypes.string.isRequired,
};

ReadStatus.displayName = 'ReadStatus';

export default ReadStatus;

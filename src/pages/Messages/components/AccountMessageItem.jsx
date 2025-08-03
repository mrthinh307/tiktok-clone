import PropTypes from 'prop-types';
import { memo } from 'react';

function AccountMessageItem({
  partnerInfo,
  onClick,
  isSelected,
  newMessageCount,
  isOnline,
}) {
  return (
    <div
      className={`relative w-full h-[72px] flex items-center justify-start pl-[16px] pr-[20px] cursor-pointer flex-shrink-0 transition-colors duration-200 ${
        isSelected
          ? 'bg-gray-100 border-r-2 border-gray-400'
          : 'hover:bg-[rgba(0,0,0,0.06)]'
      }`}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={`Chat with ${partnerInfo.partner_full_name}`}
      aria-selected={isSelected}
    >
      <div className="w-[48px] h-[48px] relative">
        <img
          src={partnerInfo.partner_avatar_url}
          alt="User Avatar"
          className="w-full h-full rounded-full"
        />
        <div
          className={`absolute bottom-[-2px] right-0 w-[1.4rem] h-[1.4rem] rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        ></div>
      </div>
      <div className="pl-[12px] flex-1">
        <p className="leading-[22px] min-h-[22px] max-w-[180px] text-ellipsis overflow-hidden whitespace-nowrap font-medium">
          {partnerInfo.partner_full_name}
        </p>
        <p className="flex items-center max-w-[180px] pt-[4px] text-[14px]">
          <span
            className={`text-ellipsis overflow-hidden whitespace-nowrap leading-tight ${
              newMessageCount > 0
                ? 'text-[rgba(22,24,35,0.95)] font-bold'
                : 'text-[rgba(22,24,35,0.75)] font-normal'
            }`}
          >
            {partnerInfo.last_message || ''}
          </span>
          <span className="inline-block flex-shrink-0 leading-[20px] pl-[6px] text-[rgba(22,24,35,0.6)]">
            {partnerInfo.last_time
              ? new Date(partnerInfo.last_time).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : ''}
          </span>
        </p>
      </div>

      {/* Badge notification cho tin nhắn mới */}
      {newMessageCount > 0 && !isSelected && (
        <div className="absolute top-[30px] right-[16px] w-[20px] h-[20px] bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-[12px] font-medium">
            {newMessageCount > 99 ? '99+' : newMessageCount}
          </span>
        </div>
      )}
    </div>
  );
}

AccountMessageItem.propTypes = {
  partnerInfo: PropTypes.shape({
    partner_avatar_url: PropTypes.string,
    partner_full_name: PropTypes.string,
    last_message: PropTypes.string,
    last_time: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  newMessageCount: PropTypes.number.isRequired,
  isOnline: PropTypes.bool.isRequired,
};

export default memo(AccountMessageItem);

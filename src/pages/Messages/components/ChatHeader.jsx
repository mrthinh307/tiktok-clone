import PropTypes from 'prop-types';

const ChatHeader = ({ receiverInfo, isReceiverOnline }) => {
  return (
    <div className="h-[8rem] flex-shrink-0 flex items-center justify-between px-[1.6rem] border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-[4.8rem] h-[4.8rem] rounded-full mr-[1.4rem] relative">
          <img
            src={receiverInfo.partner_avatar_url}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
          />
          <div
            className={`absolute bottom-[-2px] right-0 w-[1.4rem] h-[1.4rem] rounded-full border-2 border-white ${
              isReceiverOnline ? 'bg-green-500' : 'bg-gray-400'
            }`}
          ></div>
        </div>
        <div>
          <h3 className="font-semibold text-[1.8rem] leading-[2.4rem]">
            {receiverInfo.partner_full_name}
          </h3>
          <span className="text-[1.6rem] text-muted">
            @{receiverInfo.partner_nickname}
            {isReceiverOnline ? (
              <span className="ml-2 text-green-500 text-[1.4rem]">
                • online
              </span>
            ) : (
              <span className="ml-2 text-gray-400 text-[1.4rem]">
                • long time no see{' '}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  receiverInfo: PropTypes.shape({
    partner_avatar_url: PropTypes.string.isRequired,
    partner_full_name: PropTypes.string.isRequired,
    partner_nickname: PropTypes.string.isRequired,
  }).isRequired,
  isReceiverOnline: PropTypes.bool.isRequired,
};

export default ChatHeader;

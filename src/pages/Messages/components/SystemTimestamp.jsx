import PropTypes from 'prop-types';

const SystemTimestamp = ({ timestamp }) => {
  return (
    <div className="text-center my-[1.6rem]">
      <span className="text-[1.2rem] text-gray-500">{timestamp}</span>
    </div>
  );
};

SystemTimestamp.propTypes = {
  timestamp: PropTypes.string.isRequired,
};

export default SystemTimestamp;

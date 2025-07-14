import classNames from 'classnames/bind';
import styles from './LoadingSpinner.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function LoadingSpinner({ video }) {
  return (
    <div className={cx('loading-spinner')}>
      {video && (
        <img
          src={video.thumb_url}
          alt="thumbnail"
          className={cx('thumbnail')}
        />
      )}
      <div className={cx('loading-container')}>
        <div className={cx('tiktok-loading-icon')}></div>
      </div>
    </div>
  );
}

LoadingSpinner.propTypes = {
  video: PropTypes.object,
};

export default LoadingSpinner;

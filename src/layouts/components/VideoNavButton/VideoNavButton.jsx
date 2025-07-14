import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './VideoNavButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function VideoNavButton({
  onPrev,
  onNext,
  canNavigatePrev = true,
  canNavigateNext = true,
}) {
  const handlePreviousVideo = () => {
    if (canNavigatePrev && onPrev) {
      onPrev();
    }
  };

  const handleNextVideo = () => {
    if (canNavigateNext && onNext) {
      onNext();
    }
  };

  return (
    <div className="hidden md:flex flex-col justify-center gap-[16px] absolute top-[50%] right-[12px] translate-y-[-50%] z-10 lg:right[16px]">
      <button
        className={cx('btn-wrapper', { disabled: !canNavigatePrev })}
        onClick={handlePreviousVideo}
        disabled={!canNavigatePrev}
        aria-label="Previous video"
      >
        <FontAwesomeIcon icon={faChevronUp} className={cx('icon')} />
      </button>
      <button
        className={cx('btn-wrapper', { disabled: !canNavigateNext })}
        onClick={handleNextVideo}
        disabled={!canNavigateNext}
        aria-label="Next video"
      >
        <FontAwesomeIcon icon={faChevronDown} className={cx('icon')} />
      </button>
    </div>
  );
}

VideoNavButton.propTypes = {
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  canNavigatePrev: PropTypes.bool,
  canNavigateNext: PropTypes.bool,
};

export default memo(VideoNavButton);

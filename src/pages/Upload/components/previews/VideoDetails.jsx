import React from 'react';
import classNames from 'classnames/bind';
import styles from '../../Upload.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const VideoDetails = React.memo(
  ({
    description,
    onDescriptionChange,
    onPost,
    onDiscard,
    isUploading,
    coverImage,
    isPortable,
  }) => {
    const inputRef = React.useRef(null);
    return (
      <div className={cx('details-section')}>
        <div className={cx('details-container')}>
          {/* Description */}
          <div>
            <label className={cx('form-label')}>Description</label>
            <div className={cx('description-container')}>
              <textarea
                ref={inputRef}
                className={cx('description-input')}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Share more about your video here"
                maxLength={4000}
                disabled={isUploading}
              />
              <div className={cx('description-meta')}>
                <span className={cx('hashtag-mention')}>
                  <span
                    className={cx('hashtag', {
                      disabled: isUploading,
                    })}
                    onClick={(e) => {
                      e.preventDefault();
                      onDescriptionChange((prev) => prev + ' #');
                      inputRef.current.focus();
                    }}
                  >
                    # Hashtags
                  </span>
                  <span
                    className={cx('mention', {
                      disabled: isUploading,
                    })}
                    onClick={(e) => {
                      e.preventDefault();
                      onDescriptionChange((prev) => prev + ' @');
                      inputRef.current.focus();
                    }}
                  >
                    @ Mention
                  </span>
                </span>
                <span className={cx('char-count')}>
                  {description.length}/4000
                </span>
              </div>
            </div>
          </div>

          {/* Cover */}
          <div>
            <label className={cx('form-label')}>Cover</label>
            <div className={cx('cover-container')}>
              <img
                src={
                  coverImage ||
                  'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                }
                alt="cover-image"
              />
              <button
                disabled={isUploading}
                className={cx('edit-cover-button')}
              >
                Edit cover
              </button>
            </div>
          </div>
        </div>
        <div className={cx('button-container')}>
          <button
            className={cx('post-button', {
              disabled: isUploading || !isPortable,
            })}
            onClick={onPost}
            disabled={isUploading || !isPortable}
          >
            {isUploading ? (
              <FontAwesomeIcon icon={faSpinner} className={cx('spinner')} />
            ) : (
              'Post'
            )}
          </button>
          <button
            className={cx('discard-button')}
            onClick={onDiscard}
            disabled={isUploading}
          >
            Discard
          </button>
        </div>
      </div>
    );
  },
);

export default VideoDetails;

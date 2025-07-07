import React from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudDownload } from '@fortawesome/free-solid-svg-icons';
import styles from '../../Upload.module.scss';
import { ReplaceIcon, TickLoaded } from '~/assets/images/icons';

const cx = classNames.bind(styles);

const HeaderPreview = ({ selectedFile, uploadProgress, onReplace }) => {
  return (
    <div className={cx('preview-header')}>
      <div className={cx('file-info')}>
        <span className={cx('file-name')}>
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
        <span
          className={cx('file-size', {
            uploading: uploadProgress >= 0 && uploadProgress < 100,
          })}
        >
          {uploadProgress >= 0 && uploadProgress < 100 ? (
            <>
              <FontAwesomeIcon
                icon={faCloudDownload}
                className={cx('uploading-icon')}
              />
              Uploading&nbsp;
              {(
                (selectedFile.size * uploadProgress) /
                100 /
                (1024 * 1024)
              ).toFixed(2)}
              MB&nbsp;/&nbsp;
              {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
            </>
          ) : (
            <>
              <TickLoaded />
              {`Uploaded (${(selectedFile.size / (1024 * 1024)).toFixed(
                2,
              )} MB)`}
            </>
          )}
        </span>
      </div>
      <button
        className={cx('replace-button')}
        onClick={onReplace}
        hidden={uploadProgress >= 0 && uploadProgress < 100}
      >
        <>
          <ReplaceIcon />
          Replace
        </>
      </button>
      <div
        className={cx('progress-bar')}
        style={{ width: `${uploadProgress}%` }}
      ></div>
    </div>
  );
};

export default HeaderPreview;

import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames/bind';
import styles from '../Upload.module.scss';
import {
  CameraIcon,
  FolderIcon,
  LightIcon,
  ResolutionIcon,
  UploadVideoIcon,
} from '~/assets/images/icons';

const cx = classNames.bind(styles);

const PreUpload = forwardRef(({ onFileSelected }, ref) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    click: () => {
      inputRef.current?.click();
    },
  }));

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };

  const handleSelectVideoClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={cx('upload-main')}>
      <div className={cx('upload-section')}>
        <div
          className={cx('upload-area', {
            'drag-over': isDragOver,
          })}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={cx('upload-icon')}>
            <UploadVideoIcon />
          </div>
          <h2 className={cx('upload-title')}>Select video to upload</h2>
          <p className={cx('upload-subtitle')}>Or drag and drop it here</p>

          <button
            className={cx('select-video-button')}
            onClick={handleSelectVideoClick}
          >
            Select video
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className={cx('file-input')}
            style={{ display: 'none' }}
          />
        </div>
        {/* Info Sections */}
        <div className={cx('info-sections')}>
          <div className={cx('info-item')}>
            <div className={cx('info-icon')}>
              <CameraIcon />
            </div>
            <div className={cx('info-content')}>
              <h3>Size and duration</h3>
              <p>Maximum size: 30 GB, video duration: 60 minutes.</p>
            </div>
          </div>

          <div className={cx('info-item')}>
            <div className={cx('info-icon')}>
              <FolderIcon />
            </div>
            <div className={cx('info-content')}>
              <h3>File formats</h3>
              <p>Recommended: "mp4". Other major formats are supported.</p>
            </div>
          </div>

          <div className={cx('info-item')}>
            <div className={cx('info-icon')}>
              <ResolutionIcon />
            </div>
            <div className={cx('info-content')}>
              <h3>Video resolutions</h3>
              <p>High-resolution recommended: 1080p, 1440p, 4K.</p>
            </div>
          </div>

          <div className={cx('info-item')}>
            <div className={cx('info-icon')}>
              <LightIcon />
            </div>
            <div className={cx('info-content')}>
              <h3>Aspect ratios</h3>
              <p>Recommended: 16:9 for landscape, 9:16 for vertical.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CapCut Promotion */}
      <div className={cx('capcut-promotion')}>
        <div className={cx('capcut-content')}>
          <h3>Create high quality videos on CapCut Online</h3>
          <p>
            Automatically shorten your videos and create videos from scripts
            with AI-powered features
          </p>
        </div>
        <button className={cx('try-now-button')}>Try now</button>
      </div>
    </div>
  );
});

export default PreUpload;

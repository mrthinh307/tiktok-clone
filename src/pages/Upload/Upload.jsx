import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Upload.module.scss';
import VideoPreview from './components/VideoPreview';
import PreUpload from './components/PreUpload';

const cx = classNames.bind(styles);

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
  };

  const handleBack = (isOpenInputRef = false) => {
    setSelectedFile(null);
    if (isOpenInputRef) {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 0);
    }
  };

  return (
    <div className={cx('upload-container')}>
      {!selectedFile ? (
        <PreUpload ref={fileInputRef} onFileSelected={handleFileSelected} />
      ) : (
        <VideoPreview
          selectedFile={selectedFile}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default Upload;

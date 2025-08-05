import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import classNames from 'classnames/bind';
import styles from '../Upload.module.scss';
import { useAuth } from '~/contexts/AuthContext';
import VideoDetails from './previews/VideoDetails';
import PhonePreview from './previews/PhonePreview';
import HeaderPreview from './previews/HeaderPreview'; // Import the new component
import DiscardConfirmModal from './DiscardConfirmModal';
import {
  uploadCoverImage,
  uploadFileWithProgress,
  insertVideo,
  removeFileInBucket,
} from '~/services/apiServices/uploadService';
import { toast } from 'sonner';

const cx = classNames.bind(styles);

function VideoPreview({ selectedFile, onBack }) {
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoPublicUrl, setVideoPublicUrl] = useState(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const { user } = useAuth();
  const videoRef = useRef(null);

  const videoUrl = useMemo(() => {
    return selectedFile ? URL.createObjectURL(selectedFile) : null;
  }, [selectedFile]);

  // Effect to generate cover image from video
  useEffect(() => {
    const generateCoverImage = async () => {
      const video = videoRef.current;
      if (!video || !videoDuration) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size to match video aspect ratio
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      try {
        const time = 1; // Generate cover at 1 second

        // Create a promise to handle the seeked event
        await new Promise((resolve, reject) => {
          const handleSeeked = () => {
            try {
              // Draw the video frame to canvas
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

              setCoverImage(dataUrl);
              video.removeEventListener('seeked', handleSeeked);
              resolve();
            } catch (error) {
              console.error('Error capturing frame:', error);
              video.removeEventListener('seeked', handleSeeked);
              reject(error);
            }
          };

          video.addEventListener('seeked', handleSeeked);
          video.currentTime = time;
        });
      } catch (error) {
        console.error('Error generating cover:', error);
      }
    };

    if (videoRef.current && videoUrl && videoDuration > 0) {
      generateCoverImage();
    }
  }, [videoUrl, videoDuration]);

  // Effect to set video duration and check aspect ratio
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      const video = videoRef.current;

      const handleLoadedMetadata = () => {
        setVideoDuration(video.duration);

        if (video.videoWidth < video.videoHeight) {
          setIsVertical(true);
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoUrl]);

  // Effect to handle the entire upload process
  useEffect(() => {
    if (!selectedFile || !user) return;

    const uploadFiles = async () => {
      setUploadProgress(0);
      setVideoPublicUrl(null);

      try {
        // 1. Upload video with progress
        const fileName = `${user.sub}/${Date.now()}_${selectedFile.name}`;
        const uploadedVideoUrl = await uploadFileWithProgress(
          'videos',
          fileName,
          selectedFile,
          (progress) => {
            setUploadProgress(progress);
          },
        );
        setVideoFileName(fileName);
        setVideoPublicUrl(uploadedVideoUrl);
        setUploadProgress(100);
      } catch (error) {
        console.error('Video upload failed:', error);
        toast.error(`Video upload failed: ${error.message}`);
      }
    };

    uploadFiles();
  }, [selectedFile, user]);

  const handlePost = useCallback(async () => {
    if (!videoPublicUrl) {
      alert('Video must be uploaded before posting.');
      return;
    }

    // Disable button to prevent multiple posts
    setIsUploading(true);

    try {
      // 2. Upload cover image (convert base64 → Blob)
      const coverPublicUrl = await uploadCoverImage(coverImage, user);

      // 3. Optional: Gửi metadata đến API/database
      await insertVideo(videoPublicUrl, coverPublicUrl, description);

      toast.success('Video posted successfully!');
      // Optionally, navigate away or reset the form
      onBack();
    } catch (err) {
      console.error('Failed to post metadata:', err);
      toast.error('An error occurred while posting. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [videoPublicUrl, coverImage, user, description, onBack]);

  const handleDiscard = useCallback(() => {
    setShowDiscardModal(true);
  }, []);

  const handleDiscardConfirm = useCallback(async () => {
    setShowDiscardModal(false);

    if (!videoFileName) {
      onBack();
      return;
    }

    try {
      await removeFileInBucket('videos', videoFileName);
      toast.success('Video discarded successfully.');
      onBack();
    } catch (error) {
      console.error('Failed to discard video:', error);
      toast.error(`Failed to discard video: ${error.message}`);
    }
  }, [videoFileName, onBack]);

  const handleDiscardCancel = useCallback(() => {
    setShowDiscardModal(false);
  }, []);

  const handleReplace = useCallback(async () => {
    try {
      await removeFileInBucket('videos', videoFileName);
      toast.info('You can now upload a new video.');
    } catch (error) {
      console.error('Failed to remove existing video:', error);
      toast.error(`Failed to remove existing video: ${error.message}`);
    }
    onBack(true);
  }, [onBack, videoFileName]);

  return (
    <div className={cx('upload-main')}>
      {/* Header */}
      <HeaderPreview
        selectedFile={selectedFile}
        uploadProgress={uploadProgress}
        onReplace={handleReplace}
      />

      {/* Video Details Section */}
      <h2 className={cx('section-title')}>Details</h2>
      <div className={cx('preview-content')}>
        <VideoDetails
          description={description}
          onDescriptionChange={setDescription}
          onPost={handlePost}
          onDiscard={handleDiscard}
          isUploading={isUploading}
          coverImage={coverImage}
          isPortable={!!videoPublicUrl}
        />

        <PhonePreview
          videoUrl={videoUrl}
          description={description}
          user={user}
          isVertical={isVertical}
        />
      </div>

      {/* Hidden video element for cover generation */}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ display: 'none' }}
          preload="metadata"
          muted
        />
      )}

      {/* Discard Confirmation Modal */}
      <DiscardConfirmModal
        isOpen={showDiscardModal}
        onConfirm={handleDiscardConfirm}
        onCancel={handleDiscardCancel}
      />
    </div>
  );
}

export default VideoPreview;

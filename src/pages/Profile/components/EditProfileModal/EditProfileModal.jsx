import { useState, useRef, useMemo } from 'react';
import cx from 'clsx';
import Button from '~/components/Button';
import { CloseIcon, UploadIcon2 } from '~/assets/images/icons';
import { useAuth } from '~/contexts/AuthContext';
import styles from './EditProfileModal.module.scss';

function EditProfileModal({ isOpen, onClose, userProfile }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Original data for comparison
  const originalData = useMemo(
    () => ({
      username: userProfile?.username || user?.username || '',
      name: userProfile?.name || user?.name || user?.display_name || '',
      bio: userProfile?.bio || user?.bio || '',
      avatar: userProfile?.avatar || user?.avatar_url || user?.avatar || '',
    }),
    [userProfile, user],
  );

  // Form state
  const [formData, setFormData] = useState(originalData);
  const [previewAvatar, setPreviewAvatar] = useState(originalData.avatar);
  const [charCount, setCharCount] = useState(originalData.bio.length);

  // Check if data has changed
  const hasChanges = useMemo(() => {
    return (
      formData.username !== originalData.username ||
      formData.name !== originalData.name ||
      formData.bio !== originalData.bio ||
      formData.avatar !== originalData.avatar
    );
  }, [formData, originalData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'bio') {
      setCharCount(value.length);
    }
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target.result);
        setFormData((prev) => ({
          ...prev,
          avatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSave = () => {
    console.log('Saving profile data:', formData);
    // Here you would typically make an API call to save the data
    onClose();
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData(originalData);
    setPreviewAvatar(originalData.avatar);
    setCharCount(originalData.bio.length);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={cx(styles.overlay)}>
      <div className={cx(styles.modal)} onClick={(e) => e.stopPropagation()}>
        <div className={cx(styles.header)}>
          <h2 className={cx(styles.title)}>Edit profile</h2>
          <button className={cx(styles.closeButton)} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={cx(styles.content)}>
          {/* Profile Photo Section */}
          <div className={cx(styles.section)}>
            <label className={cx(styles.sectionLabel)}>Profile photo</label>
            <div className={cx(styles.sectionContent)}>
              <div
                className={cx(styles.avatarContainer)}
                onClick={handleAvatarClick}
              >
                <img
                  src={
                    previewAvatar ||
                    'https://www.svgrepo.com/show/508699/user.svg'
                  }
                  alt="Profile"
                  className={cx(styles.avatar)}
                />
                <div className={cx(styles.avatarOverlay)}>
                  <UploadIcon2 />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={cx(styles.hiddenInput)}
              />
            </div>
          </div>

          {/* Username Section */}
          <div className={cx(styles.section)}>
            <label className={cx(styles.sectionLabel)}>Username</label>
            <div className={cx(styles.sectionContent)}>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={cx(styles.input)}
                placeholder="Username"
              />
              <div className={cx(styles.inputHelper)}>
                <span className={cx(styles.urlPrefix)}>
                  www.tiktok.com/@{formData.username}
                </span>
                <p className={cx(styles.helperText)}>
                  Usernames can only contain letters, numbers, underscores, and
                  periods. Changing your username will also change your profile
                  link.
                </p>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className={cx(styles.section)}>
            <label className={cx(styles.sectionLabel)}>Name</label>
            <div className={cx(styles.sectionContent)}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={cx(styles.input)}
                placeholder="Name"
              />
              <p className={cx(styles.helperText)}>
                Your nickname can only be changed once every 7 days.
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className={cx(styles.section)}>
            <label className={cx(styles.sectionLabel)}>Bio</label>
            <div className={cx(styles.sectionContent)}>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className={cx(styles.textarea)}
                placeholder="Bio"
                maxLength={80}
                rows={4}
              />
              <div className={cx(styles.charCounter)}>{charCount}/80</div>
            </div>
          </div>

          {/* Footer Buttons - Move inside content */}
          <div className={cx(styles.footer)}>
            <Button className={cx(styles.cancelButton)} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={cx(styles.saveButton)}
              primary
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;

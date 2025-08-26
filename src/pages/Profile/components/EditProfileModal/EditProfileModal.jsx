import { useState, useRef, useMemo, useEffect } from 'react';
import cx from 'clsx';
import Button from '~/components/Button';
import { CloseIcon, UploadIcon2 } from '~/assets/images/icons';
import styles from './EditProfileModal.module.scss';
import supabase from '~/config/supabaseClient';
import { usePreventBodyScroll } from '~/hooks';

function EditProfileModal({ isOpen, onClose, userProfile }) {
  const fileInputRef = useRef(null);

  // Prevent body scroll when modal is open
  usePreventBodyScroll(isOpen);

  // Original data for comparison
  const originalData = useMemo(
    () => ({
      username: userProfile?.nickname || '',
      name: userProfile?.fullName || '',
      bio: userProfile?.bio || '',
      avatar_url: userProfile?.avatar_url || '',
    }),
    [userProfile],
  );

  // Form state
  const [formData, setFormData] = useState(() => originalData);
  const [previewAvatar, setPreviewAvatar] = useState(() => originalData.avatar_url);
  const [charCount, setCharCount] = useState(() => originalData.bio.length);
  const [isSaving, setIsSaving] = useState(false);

  // Update form data when originalData changes
  useEffect(() => {
    setFormData(originalData);
    setPreviewAvatar(originalData.avatar_url);
    setCharCount(originalData.bio.length);
  }, [originalData, isOpen]);

  // Check if data has changed
  const hasChanges = useMemo(() => {
    return (
      formData.username !== originalData.username ||
      formData.name !== originalData.name ||
      formData.bio !== originalData.bio ||
      formData.avatar_url !== originalData.avatar_url
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
          avatar_url: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSave = async () => {
    if (!hasChanges || !userProfile?.id) return;

    setIsSaving(true);

    try {
      // Prepare update data
      const updateData = {};

      if (formData.username !== originalData.username) {
        updateData.nickname = formData.username;
      }
      
      if (formData.name !== originalData.name) {
        updateData.fullName = formData.name;
        updateData.firstName = formData.name.split(' ')[0];
        updateData.lastName = formData.name.split(' ')[1] || '';
      }
      
      if (formData.bio !== originalData.bio) {
        updateData.bio = formData.bio;
      }

      // Handle avatar upload if changed
      if (formData.avatar_url !== originalData.avatar_url && formData.avatar_url.startsWith('data:')) {
        // If avatar is a base64 string (new upload), we would need to upload to storage
        // For now, we'll just save the avatar_url
        updateData.avatar_url = formData.avatar_url;
      }

      // Update user in Supabase
      const { error } = await supabase  
        .from('user')
        .update(updateData)
        .eq('id', userProfile.id);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
        return;
      }

      onClose();
      
      // Reload the page to fetch updated data
      // window.location.reload();
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData(originalData);
    setPreviewAvatar(originalData.avatar_url);
    setCharCount(originalData.bio?.length || 0);
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
                  src={previewAvatar}
                  alt="avatar"
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
                  www.dthinh.com/user/{formData.username}
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
                Your nickname can only be changed everytime you want.
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
            <Button className={cx(styles.cancelButton)} onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              className={cx(styles.saveButton)}
              primary
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;

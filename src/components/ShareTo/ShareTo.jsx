import { useState, useEffect, useRef } from 'react';
import cx from 'clsx';
import styles from './ShareTo.module.scss';
import { CloseIcon } from '~/assets/images/icons';
import { toast } from 'sonner';

// Copy Icon Component
const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"
      fill="currentColor"
    />
  </svg>
);

// Facebook Icon Component
const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.564H7.078V12.073H10.125V9.41C10.125 6.387 11.917 4.716 14.658 4.716C15.97 4.716 17.344 4.953 17.344 4.953V7.898H15.83C14.34 7.898 13.875 8.8 13.875 9.727V12.073H17.203L16.671 15.564H13.875V24C19.612 23.094 24 18.1 24 12.073Z"
      fill="#1877F2"
    />
  </svg>
);

// WhatsApp Icon Component  
const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.472 14.382C17.367 14.382 17.15 14.277 16.717 14.067C16.284 13.858 14.827 13.153 14.394 13.048C13.961 12.943 13.528 12.943 13.2 13.376C12.872 13.809 12.377 14.382 12.154 14.71C11.931 15.038 11.603 15.038 11.17 14.828C10.737 14.619 9.492 14.172 8.04 12.877C6.906 11.882 6.168 10.647 5.945 10.214C5.722 9.781 5.945 9.558 6.154 9.348C6.364 9.139 6.587 8.916 6.797 8.693C7.006 8.47 7.111 8.352 7.216 8.024C7.321 7.696 7.216 7.473 7.111 7.263C7.006 7.054 6.168 5.597 5.735 4.731C5.407 3.97 5.079 4.075 4.751 4.075C4.423 4.075 3.99 4.075 3.662 4.075C3.334 4.075 2.796 4.18 2.363 4.613C1.93 5.046 1.12 5.751 1.12 7.208C1.12 8.665 2.258 10.017 2.468 10.345C2.677 10.673 6.168 15.248 11.275 17.128C12.377 17.561 13.2 17.789 13.857 17.966C14.932 18.294 15.902 18.242 16.717 18.137C17.638 18.032 18.78 17.433 19.108 16.728C19.436 16.023 19.436 15.423 19.331 15.248C19.226 15.074 18.898 14.969 18.465 14.76C18.032 14.55 17.905 14.487 17.472 14.382Z"
      fill="#25D366"
    />
    <path
      d="M20.5 3.5C18.2 1.2 15.1 0 12 0C5.4 0 0 5.4 0 12C0 14.1 0.7 16.2 1.9 17.9L0 24L6.3 22.1C8 23.2 9.9 23.8 12 23.8C18.6 23.8 24 18.4 24 11.8C24 8.7 22.8 5.8 20.5 3.5ZM12 21.8C10.1 21.8 8.3 21.3 6.7 20.3L6.3 20.1L2.7 21L3.6 17.5L3.4 17.1C2.3 15.5 1.8 13.7 1.8 11.8C1.8 6.4 6.4 1.8 11.8 1.8C14.4 1.8 16.9 2.8 18.7 4.6C20.5 6.4 21.5 8.9 21.5 11.5C21.7 17.1 17.1 21.8 12 21.8Z"
      fill="#25D366"
    />
  </svg>
);

// Telegram Icon Component
const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 0C5.376 0 0 5.376 0 12S5.376 24 12 24S24 18.624 24 12S18.624 0 12 0ZM17.568 8.16C17.388 10.056 16.608 14.664 16.212 16.788C16.044 17.688 15.708 17.988 15.396 18.024C14.7 18.084 14.172 17.568 13.5 17.124C12.444 16.428 11.844 15.996 10.824 15.324C9.636 14.544 10.404 14.112 11.088 13.416C11.268 13.236 14.34 10.44 14.4 10.188C14.412 10.152 14.412 10.044 14.34 9.972C14.268 9.9 14.172 9.924 14.1 9.936C13.992 9.96 12.156 11.172 8.604 13.572C8.076 13.932 7.596 14.112 7.164 14.1C6.684 14.088 5.772 13.848 5.076 13.644C4.236 13.392 3.576 13.26 3.636 12.792C3.672 12.552 4.008 12.3 4.632 12.048C8.58 10.248 11.292 9.096 12.756 8.604C16.536 6.96 17.328 6.684 17.844 6.684C17.952 6.684 18.204 6.708 18.36 6.84C18.492 6.948 18.528 7.092 18.54 7.2C18.528 7.284 18.552 7.524 18.54 7.236C18.552 7.524 17.568 8.16 17.568 8.16Z"
      fill="#0088CC"
    />
  </svg>
);

// Embed Icon Component
const EmbedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.7 15.9L4.8 12L8.7 8.1L7.3 6.7L2 12L7.3 17.3L8.7 15.9ZM15.3 8.1L19.2 12L15.3 15.9L16.7 17.3L22 12L16.7 6.7L15.3 8.1Z"
      fill="currentColor"
    />
  </svg>
);

function ShareTo({ isOpen, onClose, profile }) {
  const modalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Generate profile URL
  const profileUrl = `${window.location.origin}/user/${profile?.nickname}`;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy link');
    }
  };

  // Handle Facebook share
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // Handle WhatsApp share
  const handleWhatsAppShare = () => {
    const text = `Check out ${profile?.fullName || profile?.nickname}'s profile on TikTok!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + profileUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle Telegram share
  const handleTelegramShare = () => {
    const text = `Check out ${profile?.fullName || profile?.nickname}'s profile on TikTok!`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  // Handle embed copy
  const handleEmbedCopy = async () => {
    const embedCode = `<iframe src="${profileUrl}" width="100%" height="400" frameborder="0"></iframe>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success('Embed code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy embed code: ', err);
      toast.error('Failed to copy embed code');
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cx(styles.overlay, { [styles.open]: isOpen })}>
      <div ref={modalRef} className={cx(styles.modal, { [styles.open]: isOpen })}>
        <div className={styles.header}>
          <h3 className={styles.title}>Share to</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.shareOptions}>
          <div className={styles.shareGrid}>
            {/* Copy Link */}
            <button className={styles.shareItem} onClick={handleCopyLink}>
              <div className={styles.shareIcon}>
                <CopyIcon />
              </div>
              <span className={styles.shareLabel}>Copy</span>
            </button>

            {/* WhatsApp */}
            <button className={styles.shareItem} onClick={handleWhatsAppShare}>
              <div className={styles.shareIcon}>
                <WhatsAppIcon />
              </div>
              <span className={styles.shareLabel}>WhatsApp</span>
            </button>

            {/* Embed */}
            <button className={styles.shareItem} onClick={handleEmbedCopy}>
              <div className={styles.shareIcon}>
                <EmbedIcon />
              </div>
              <span className={styles.shareLabel}>Embed</span>
            </button>

            {/* Facebook */}
            <button className={styles.shareItem} onClick={handleFacebookShare}>
              <div className={styles.shareIcon}>
                <FacebookIcon />
              </div>
              <span className={styles.shareLabel}>Facebook</span>
            </button>

            {/* Telegram */}
            <button className={styles.shareItem} onClick={handleTelegramShare}>
              <div className={styles.shareIcon}>
                <TelegramIcon />
              </div>
              <span className={styles.shareLabel}>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareTo;

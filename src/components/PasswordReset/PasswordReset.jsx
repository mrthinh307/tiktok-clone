import { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { createPortal } from 'react-dom';
import styles from './PasswordReset.module.scss';
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function PasswordReset({ isOpen, onClose }) {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await sendPasswordReset(email);
      
      if (result.success) {
        setIsEmailSent(true);
      } else {
        setError(result.message || 'Failed to send reset email');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsEmailSent(false);
    setIsLoading(false);
    onClose();
  };

  const handleBackToLogin = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={cx('overlay')} onClick={handleClose}>
      <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('header')}>
          <button 
            className={cx('back-button')} 
            onClick={handleBackToLogin}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2>Reset Password</h2>
          <button 
            className={cx('close-button')} 
            onClick={handleClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className={cx('content')}>
          {!isEmailSent ? (
            <>
              <p className={cx('description')}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className={cx('form')}>
                <div className={cx('form-group')}>
                  <label htmlFor="resetEmail">Email</label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your email address"
                    className={cx('form-input', { invalid: error })}
                    disabled={isLoading}
                    autoFocus
                  />
                  {error && <div className={cx('error-message')}>{error}</div>}
                </div>

                <button
                  type="submit"
                  className={cx('submit-button')}
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className={cx('success-message')}>
              <div className={cx('success-icon')}>✅</div>
              <h3>Email Sent!</h3>
              <p>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className={cx('instruction')}>
                Check your email and click the link to reset your password.
              </p>
              <button 
                className={cx('back-to-login')} 
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PasswordReset;

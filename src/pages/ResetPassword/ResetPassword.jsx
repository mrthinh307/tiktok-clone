import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './ResetPassword.module.scss';
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Check if we have a valid session (user clicked reset link)
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      // Redirect to home if no valid reset tokens
      navigate('/');
    }
  }, [navigate]);

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePassword(newPassword);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setErrors({ general: result.message || 'Failed to update password' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cx('container')}>
        <div className={cx('success-container')}>
          <div className={cx('success-icon')}>✅</div>
          <h1>Password Updated!</h1>
          <p>Your password has been successfully updated.</p>
          <p>You will be redirected to the home page in a few seconds...</p>
          <button 
            className={cx('home-button')} 
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cx('container')}>
      <div className={cx('reset-container')}>
        <div className={cx('header')}>
          <h1>Reset Your Password</h1>
          <p>Please enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className={cx('form')}>
          {errors.general && (
            <div className={cx('error-message', 'general-error')}>
              {errors.general}
            </div>
          )}

          <div className={cx('form-group')}>
            <label htmlFor="newPassword">New Password</label>
            <div className={cx('password-input-container')}>
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) {
                    setErrors({ ...errors, newPassword: null });
                  }
                }}
                placeholder="Enter your new password"
                className={cx('form-input', { invalid: errors.newPassword })}
                disabled={isLoading}
              />
              <button
                type="button"
                className={cx('toggle-password')}
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.newPassword && (
              <div className={cx('error-message')}>{errors.newPassword}</div>
            )}
          </div>

          <div className={cx('form-group')}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className={cx('password-input-container')}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: null });
                  }
                }}
                placeholder="Confirm your new password"
                className={cx('form-input', { invalid: errors.confirmPassword })}
                disabled={isLoading}
              />
              <button
                type="button"
                className={cx('toggle-password')}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword && (
              <div className={cx('error-message')}>{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className={cx('submit-button')}
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              'Update Password'
            )}
          </button>
        </form>

        <div className={cx('footer')}>
          <button 
            className={cx('back-button')} 
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

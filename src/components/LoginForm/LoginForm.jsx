/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faXmark,
    faEye,
    faEyeSlash,
    faSpinner,
    faCheck,
    faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { createPortal } from 'react-dom';
import styles from './LoginForm.module.scss';
import { useAuth } from '~/contexts/AuthContext';
import { useDebounce } from '~/hooks';
import { DEBOUNCE_DELAY } from '~/constants/common';
import * as authService from '~/services/apiServices/authService';

const cx = classNames.bind(styles);

// Global notification component using React Portal
const GlobalNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return createPortal(
        <div className={cx('notification', `notification-${type}`)}>
            {message}
        </div>,
        document.body,
    );
};

function LoginForm() {
    const {
        showLoginForm,
        isRegistering,
        toggleLoginForm,
        toggleRegisterMode,
        login,
        register,
    } = useAuth();

    // Login state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Field errors state
    const [fieldErrors, setFieldErrors] = useState({});

    // Register state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Debounced values for validation
    const debouncedLoginEmail = useDebounce(email, DEBOUNCE_DELAY);
    const debouncedLoginPassword = useDebounce(password, DEBOUNCE_DELAY);
    const debouncedFirstName = useDebounce(firstName, DEBOUNCE_DELAY);
    const debouncedLastName = useDebounce(lastName, DEBOUNCE_DELAY);
    const debouncedRegisterEmailForValidation = useDebounce(registerEmail, DEBOUNCE_DELAY);
    const debouncedRegisterPassword = useDebounce(registerPassword, DEBOUNCE_DELAY);
    const debouncedConfirmPassword = useDebounce(confirmPassword, DEBOUNCE_DELAY);

    // Email validation state
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [emailStatus, setEmailStatus] = useState(null); // null, 'checking', 'valid', 'invalid'

    // Common state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [globalNotification, setGlobalNotification] = useState(null);

    const formRef = useRef(null);
    const modalRef = useRef(null);

    const resetForm = () => {
        // Reset login form
        setEmail('');
        setPassword('');

        // Reset register form
        setFirstName('');
        setLastName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');

        // Reset email status
        setEmailStatus(null);
        setIsCheckingEmail(false);

        setFieldErrors({});
    };

    const handleClose = (e) => {
        resetForm();
        toggleLoginForm();
    };

    const validateLoginForm = (fieldName) => {
        const errors = {...fieldErrors};
        let isValid = true;

        if (fieldName === 'email' || !fieldName) {
            if (!email.trim()) {
                errors.email = 'Please enter your email';
                isValid = false;
            } else if (!isValidEmail(email)) {
                errors.email = 'Please enter a valid email';
                isValid = false;
            } else {
                delete errors.email;
            }
        }

        if (fieldName === 'password' || !fieldName) {
            if (!password) {
                errors.password = 'Please enter your password';
                isValid = false;
            } else {
                delete errors.password;
            }
        }

        setFieldErrors(errors);
        return isValid && Object.keys(errors).length === 0;
    };

    const validateRegisterForm = (fieldName) => {
        const errors = {...fieldErrors};
        let isValid = true;

        if (fieldName === 'firstName' || !fieldName) {
            if (!firstName.trim()) {
                errors.firstName = 'Please enter your first name';
                isValid = false;
            } else {
                delete errors.firstName;
            }
        }

        if (fieldName === 'lastName' || !fieldName) {
            if (!lastName.trim()) {
                errors.lastName = 'Please enter your last name';
                isValid = false;
            } else {
                delete errors.lastName;
            }
        }

        if (fieldName === 'registerEmail' || !fieldName) {
            if (!registerEmail.trim()) {
                errors.registerEmail = 'Please enter your email';
                isValid = false;
            } else if (!isValidEmail(registerEmail)) {
                errors.registerEmail = 'Please enter a valid email';
                isValid = false;
            } else if (emailStatus === 'invalid' && errors.registerEmail !== 'This email is already registered') {
                // Keep existing "already registered" error, otherwise clear
                 delete errors.registerEmail;
            } else if (emailStatus !== 'invalid') {
                delete errors.registerEmail;
            }
        }

        if (fieldName === 'registerPassword' || !fieldName) {
            if (!registerPassword) {
                errors.registerPassword = 'Please enter your password';
                isValid = false;
            } else if (registerPassword.length < 6) {
                errors.registerPassword = 'Password must be at least 6 characters';
                isValid = false;
            } else {
                delete errors.registerPassword;
            }
        }

        if (fieldName === 'confirmPassword' || !fieldName) {
            if (!confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
                isValid = false;
            } else if (registerPassword !== confirmPassword) {
                errors.confirmPassword = 'Password confirmation does not match';
                isValid = false;
            } else {
                delete errors.confirmPassword;
            }
        }

        setFieldErrors(errors);
        return isValid && Object.keys(errors).length === 0;
    };

    // Check email existence when debounced email changes
    useEffect(() => {
        const checkEmail = async () => {
            // Only check if email is valid and not empty
            if (debouncedRegisterEmailForValidation && isValidEmail(debouncedRegisterEmailForValidation)) {
                setIsCheckingEmail(true);
                setEmailStatus('checking');

                try {
                    const exists = await authService.checkEmailExists(
                        debouncedRegisterEmailForValidation,
                    );

                    if (exists) {
                        setEmailStatus('invalid');
                        setFieldErrors((prev) => ({
                            ...prev,
                            registerEmail: 'This email is already registered',
                        }));
                    } else {
                        setEmailStatus('valid');
                        setFieldErrors((prev) => {
                            const newErrors = { ...prev };
                            if (
                                newErrors.registerEmail ===
                                'This email is already registered'
                            ) {
                                delete newErrors.registerEmail;
                            }
                            return newErrors;
                        });
                    }
                } catch (error) {
                    console.error('Error checking email:', error);
                } finally {
                    setIsCheckingEmail(false);
                }
            } else {
                setEmailStatus(null);
            }
        };

        checkEmail();
    }, [debouncedRegisterEmailForValidation]);

    // Debounced validation for Login form
    useEffect(() => {
        if (email) validateLoginForm('email');
    }, [debouncedLoginEmail]);

    useEffect(() => {
        if (password) validateLoginForm('password');
    }, [debouncedLoginPassword]);

    // Debounced validation for Register form
    useEffect(() => {
        if (firstName) validateRegisterForm('firstName');
    }, [debouncedFirstName]);

    useEffect(() => {
        if (lastName) validateRegisterForm('lastName');
    }, [debouncedLastName]);

    useEffect(() => {
        if (registerEmail && emailStatus !== 'checking') validateRegisterForm('registerEmail');
    }, [debouncedRegisterEmailForValidation, emailStatus]);

    useEffect(() => {
        if (registerPassword) validateRegisterForm('registerPassword');
    }, [debouncedRegisterPassword]);

    useEffect(() => {
        if (confirmPassword) validateRegisterForm('confirmPassword');
    }, [debouncedConfirmPassword]);

    // Show notification function
    const showNotification = (message, type) => {
        if (type === 'success') {
            // For success notifications, show them globally
            setGlobalNotification({ message, type });
        } else {
            // For error notifications, show them in the modal
            setGlobalNotification({ message, type });
        }
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        if (!validateLoginForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Call login function from context
            const success = await login(email, password);

            if (success) {
                // Show notification and close form
                showNotification(
                    'Login successful! You are now logged in.',
                    'success',
                );
                // Close form with a small delay
                setTimeout(() => {
                    toggleLoginForm();
                }, 300);
            } else {
                showNotification(
                    'Login failed. Please check your information.',
                    'error',
                );
            }
        } catch (error) {
            showNotification(
                'An unexpected error occurred. Please try again.',
                'error',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();

        if (!validateRegisterForm() || emailStatus !== 'valid') {
            // Ensure all fields are validated before submitting
            validateRegisterForm();
            if (emailStatus !== 'valid' && registerEmail && isValidEmail(registerEmail) && !fieldErrors.registerEmail) {
                 setFieldErrors(prev => ({...prev, registerEmail: 'Please wait for email validation or fix the invalid email.'}));
            }
            showNotification(
                'Please enter valid information and ensure email is available.',
                'error',
            );
            return;
        }

        setIsLoading(true);

        try {
            // Call register function from context
            const result = await register(
                firstName,
                lastName,
                registerEmail,
                registerPassword,
            );

            if (result.success) {                // Show notification before closing the form
                showNotification(
                    'Registration successful! You are now logged in.',
                    'success',
                );

                // Small delay before closing form to ensure notification is seen
                setTimeout(() => {
                    toggleLoginForm();
                }, 300);
            } else {
                // Show specific error message
                if (result.message === 'Email already exists') {
                    setFieldErrors({
                        ...fieldErrors,
                        registerEmail: 'This email is already registered',
                    });
                } else {
                    showNotification(
                            'Registration failed. Please try again.',
                        'error',
                    );
                }
            }
        } catch (error) {
            showNotification(
                'An unexpected error occurred. Please try again.',
                'error',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isValidEmail = (email) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    };

    const switchToRegister = () => {
        resetForm();
        toggleRegisterMode();
    };

    const switchToLogin = () => {
        resetForm();
        toggleRegisterMode();
    };

    // Xử lý click outside để đóng form
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && modalRef.current === event.target) {
                handleClose();
            }
        };

        if (showLoginForm) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi form hiển thị
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = ''; // Bỏ ngăn cuộn khi unmount
        };
    }, [showLoginForm]);

    // Focus vào input đầu tiên khi form hiển thị
    useEffect(() => {
        if (showLoginForm && formRef.current) {
            // Timeout để đảm bảo animation đã chạy trước khi focus
            const timer = setTimeout(() => {
                const firstInput = formRef.current.querySelector(
                    isRegistering
                        ? 'input[name="firstName"]'
                        : 'input[name="email"]',
                );
                if (firstInput) firstInput.focus();
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [showLoginForm, isRegistering]);

    // Xử lý phím ESC để đóng form
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (showLoginForm) {
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [showLoginForm]);

    // Email status icon
    const getEmailStatusIcon = () => {
        if (!registerEmail || !isValidEmail(registerEmail)) return null;

        if (isCheckingEmail || emailStatus === 'checking') {
            return (
                <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    className={cx('email-status-icon')}
                />
            );
        } else if (emailStatus === 'valid') {
            return (
                <FontAwesomeIcon
                    icon={faCheck}
                    className={cx('email-status-icon', 'valid')}
                />
            );
        } else if (emailStatus === 'invalid') {
            return (
                <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className={cx('email-status-icon', 'invalid')}
                />
            );
        }

        return null;
    };

    return (
        <>
            {globalNotification && (
                <GlobalNotification
                    message={globalNotification.message}
                    type={globalNotification.type}
                    onClose={() => setGlobalNotification(null)}
                />
            )}

            {showLoginForm && (
                <div
                    ref={modalRef}
                    className={cx('overlay', { show: showLoginForm })}
                >
                    <div
                        ref={formRef}
                        className={cx('form-container', {
                            show: showLoginForm,
                        })}
                    >
                        <div className={cx('form-header')}>
                            <h2 className={cx('form-title')}>
                                {isRegistering
                                    ? 'Sign up for TikTok'
                                    : 'Log in to TikTok'}
                            </h2>
                            <button
                                className={cx('close-button')}
                                onClick={handleClose}
                                tabIndex={1}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        {!isRegistering ? (
                            // Form đăng nhập
                            <form
                                onSubmit={handleSubmitLogin}
                                className={cx('form')}
                            >
                                <div className={cx('form-group')}>
                                    <label htmlFor="username">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (fieldErrors.email) {
                                                setFieldErrors({
                                                    ...fieldErrors,
                                                    email: '',
                                                });
                                            }
                                        }}
                                        placeholder="Enter your email"
                                        className={cx('form-input', {
                                            invalid: fieldErrors.email,
                                        })}
                                        tabIndex={2}
                                        disabled={isLoading}
                                    />
                                    {fieldErrors.email && (
                                        <div className={cx('field-error')}>
                                            {fieldErrors.email}
                                        </div>
                                    )}
                                </div>

                                <div className={cx('form-group')}>
                                    <label htmlFor="password">Password</label>
                                    <div
                                        className={cx(
                                            'password-input-container',
                                        )}
                                    >
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                if (fieldErrors.password) {
                                                    setFieldErrors({
                                                        ...fieldErrors,
                                                        password: '',
                                                    });
                                                }
                                            }}
                                            placeholder="Enter your password"
                                            className={cx('form-input', {
                                                invalid: fieldErrors.password,
                                            })}
                                            tabIndex={3}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className={cx('toggle-password')}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            disabled={isLoading}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    showPassword
                                                        ? faEyeSlash
                                                        : faEye
                                                }
                                            />
                                        </button>
                                    </div>
                                    {fieldErrors.password && (
                                        <div className={cx('field-error')}>
                                            {fieldErrors.password}
                                        </div>
                                    )}
                                </div>

                                <div className={cx('forgot-password')}>
                                    <a href="#" tabIndex={4}>
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className={cx('login-button')}
                                    tabIndex={5}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                        />
                                    ) : (
                                        'Log in'
                                    )}
                                </button>

                                <div className={cx('form-footer')}>
                                    <p>Don't have an account?</p>
                                    <button
                                        type="button"
                                        className={cx('register-link')}
                                        onClick={switchToRegister}
                                        tabIndex={6}
                                        disabled={isLoading}
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Form đăng ký
                            <form
                                onSubmit={handleSubmitRegister}
                                className={cx('form')}
                            >
                                <div className={cx('name-fields-container')}>
                                    <div
                                        className={cx(
                                            'form-group',
                                            'name-field',
                                        )}
                                    >
                                        <label htmlFor="firstName">
                                            First Name
                                        </label>
                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                                if (fieldErrors.firstName) {
                                                    setFieldErrors({
                                                        ...fieldErrors,
                                                        firstName: '',
                                                    });
                                                }
                                            }}
                                            placeholder="First name"
                                            className={cx('form-input', {
                                                invalid: fieldErrors.firstName,
                                            })}
                                            tabIndex={3}
                                            disabled={isLoading}
                                        />
                                        {fieldErrors.firstName && (
                                            <div className={cx('field-error')}>
                                                {fieldErrors.firstName}
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={cx(
                                            'form-group',
                                            'name-field',
                                        )}
                                    >
                                        <label htmlFor="lastName">
                                            Last Name
                                        </label>
                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                                if (fieldErrors.lastName) {
                                                    setFieldErrors({
                                                        ...fieldErrors,
                                                        lastName: '',
                                                    });
                                                }
                                            }}
                                            placeholder="Last name"
                                            className={cx('form-input', {
                                                invalid: fieldErrors.lastName,
                                            })}
                                            tabIndex={4}
                                            disabled={isLoading}
                                        />
                                        {fieldErrors.lastName && (
                                            <div className={cx('field-error')}>
                                                {fieldErrors.lastName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={cx('form-group')}>
                                    <label htmlFor="registerEmail">Email</label>
                                    <div
                                        className={cx('email-input-container')}
                                    >
                                        <input
                                            id="registerEmail"
                                            name="registerEmail"
                                            type="email"
                                            value={registerEmail}
                                            onChange={(e) => {
                                                setRegisterEmail(
                                                    e.target.value,
                                                );
                                                // Clear email-specific error
                                                setFieldErrors((prev) => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.registerEmail;
                                                    return newErrors;
                                                });
                                                setEmailStatus(null); // Reset email status on new input
                                            }}
                                            placeholder="abcxyz@gmail.com"
                                            className={cx('form-input', {
                                                invalid:
                                                    fieldErrors.registerEmail,
                                                valid: emailStatus === 'valid',
                                            })}
                                            tabIndex={5}
                                            disabled={isLoading}
                                        />
                                        <div className={cx('email-status')}>
                                            {getEmailStatusIcon()}
                                        </div>
                                    </div>
                                    {fieldErrors.registerEmail && (
                                        <div className={cx('field-error')}>
                                            {fieldErrors.registerEmail}
                                        </div>
                                    )}
                                </div>

                                <div className={cx('form-group')}>
                                    <label htmlFor="registerPassword">
                                        Password
                                    </label>
                                    <div
                                        className={cx(
                                            'password-input-container',
                                        )}
                                    >
                                        <input
                                            id="registerPassword"
                                            name="registerPassword"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={registerPassword}
                                            onChange={(e) => {
                                                setRegisterPassword(
                                                    e.target.value,
                                                );
                                                if (
                                                    fieldErrors.registerPassword
                                                ) {
                                                    setFieldErrors({
                                                        ...fieldErrors,
                                                        registerPassword: '',
                                                    });
                                                }
                                            }}
                                            placeholder="Enter your password"
                                            className={cx('form-input', {
                                                invalid:
                                                    fieldErrors.registerPassword,
                                            })}
                                            tabIndex={6}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className={cx('toggle-password')}
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            disabled={isLoading}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    showPassword
                                                        ? faEyeSlash
                                                        : faEye
                                                }
                                            />
                                        </button>
                                    </div>
                                    {fieldErrors.registerPassword && (
                                        <div className={cx('field-error')}>
                                            {fieldErrors.registerPassword}
                                        </div>
                                    )}
                                </div>

                                <div className={cx('form-group')}>
                                    <label htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div
                                        className={cx(
                                            'password-input-container',
                                        )}
                                    >
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(
                                                    e.target.value,
                                                );
                                                if (
                                                    fieldErrors.confirmPassword
                                                ) {
                                                    setFieldErrors({
                                                        ...fieldErrors,
                                                        confirmPassword: '',
                                                    });
                                                }
                                            }}
                                            placeholder="Re-enter your password"
                                            className={cx('form-input', {
                                                invalid:
                                                    fieldErrors.confirmPassword,
                                            })}
                                            tabIndex={7}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className={cx('toggle-password')}
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            disabled={isLoading}
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    showConfirmPassword
                                                        ? faEyeSlash
                                                        : faEye
                                                }
                                            />
                                        </button>
                                    </div>
                                    {fieldErrors.confirmPassword && (
                                        <div className={cx('field-error')}>
                                            {fieldErrors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className={cx('login-button')}
                                    tabIndex={8}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <FontAwesomeIcon
                                            icon={faSpinner}
                                            spin
                                        />
                                    ) : (
                                        'Sign up'
                                    )}
                                </button>

                                <div className={cx('form-footer')}>
                                    <p>Already have an account?</p>
                                    <button
                                        type="button"
                                        className={cx('register-link')}
                                        onClick={switchToLogin}
                                        tabIndex={9}
                                        disabled={isLoading}
                                    >
                                        Log in
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default LoginForm;

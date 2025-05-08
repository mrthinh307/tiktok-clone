import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import styles from './LoginForm.module.scss';
import { useAuth } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Register state
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Common state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const formRef = useRef(null);
    const modalRef = useRef(null);

    const resetForm = () => {
        // Reset login form
        setUsername('');
        setPassword('');

        // Reset register form
        setRegisterUsername('');
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');

        setError('');
    };

    const handleClose = () => {
        resetForm();
        toggleLoginForm();
    };

    const handleSubmitLogin = (e) => {
        e.preventDefault();

        setError('');

        // Kiểm tra validation đơn giản
        if (!username.trim()) {
            setError('Vui lòng nhập tên đăng nhập');
            return;
        }

        if (!password) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }

        // Gọi hàm login từ context
        const success = login(username, password);

        if (!success) {
            setError(
                'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
            );
        }
    };

    const handleSubmitRegister = (e) => {
        e.preventDefault();

        setError('');

        // Validate register form
        if (!registerUsername.trim()) {
            setError('Vui lòng nhập tên đăng nhập');
            return;
        }

        if (!registerName.trim()) {
            setError('Vui lòng nhập tên hiển thị');
            return;
        }

        if (!registerEmail.trim()) {
            setError('Vui lòng nhập email');
            return;
        } else if (!isValidEmail(registerEmail)) {
            setError('Vui lòng nhập email hợp lệ');
            return;
        }

        if (!registerPassword) {
            setError('Vui lòng nhập mật khẩu');
            return;
        }

        if (registerPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (!confirmPassword) {
            setError('Vui lòng xác nhận mật khẩu');
            return;
        }

        if (registerPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Gọi hàm register từ context
        const success = register(
            registerUsername,
            registerName,
            registerEmail,
            registerPassword,
        );

        if (!success) {
            setError('Đăng ký không thành công. Vui lòng thử lại.');
        }
    };

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
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
                        ? 'input[name="registerUsername"]'
                        : 'input[name="username"]',
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

    if (!showLoginForm) return null;

    return (
        <div ref={modalRef} className={cx('overlay', { show: showLoginForm })}>
            <div
                ref={formRef}
                className={cx('form-container', { show: showLoginForm })}
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
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {error && <div className={cx('error-message')}>{error}</div>}

                {!isRegistering ? (
                    // Form đăng nhập
                    <form onSubmit={handleSubmitLogin} className={cx('form')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className={cx('form-input')}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="password">Password</label>
                            <div className={cx('password-input-container')}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className={cx('form-input')}
                                />
                                <button
                                    type="button"
                                    className={cx('toggle-password')}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className={cx('forgot-password')}>
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="submit" className={cx('login-button')}>
                            Log in
                        </button>

                        <div className={cx('form-footer')}>
                            <p>Don't have an account?</p>
                            <button
                                type="button"
                                className={cx('register-link')}
                                onClick={switchToRegister}
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
                        <div className={cx('form-group')}>
                            <label htmlFor="registerUsername">Username</label>
                            <input
                                id="registerUsername"
                                name="registerUsername"
                                type="text"
                                value={registerUsername}
                                onChange={(e) =>
                                    setRegisterUsername(e.target.value)
                                }
                                placeholder="tiktok123"
                                className={cx('form-input')}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="registerName">Name</label>
                            <input
                                id="registerName"
                                name="registerName"
                                type="text"
                                value={registerName}
                                onChange={(e) =>
                                    setRegisterName(e.target.value)
                                }
                                placeholder="Micheal Oliver"
                                className={cx('form-input')}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="registerEmail">Email</label>
                            <input
                                id="registerEmail"
                                name="registerEmail"
                                type="email"
                                value={registerEmail}
                                onChange={(e) =>
                                    setRegisterEmail(e.target.value)
                                }
                                placeholder="abcxyz@gmail.com"
                                className={cx('form-input')}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="registerPassword">Password</label>
                            <div className={cx('password-input-container')}>
                                <input
                                    id="registerPassword"
                                    name="registerPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={registerPassword}
                                    onChange={(e) =>
                                        setRegisterPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className={cx('form-input')}
                                />
                                <button
                                    type="button"
                                    className={cx('toggle-password')}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <div className={cx('password-input-container')}>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Re-enter your password"
                                    className={cx('form-input')}
                                />
                                <button
                                    type="button"
                                    className={cx('toggle-password')}
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
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
                        </div>

                        <button type="submit" className={cx('login-button')}>
                            Sign up
                        </button>

                        <div className={cx('form-footer')}>
                            <p>Already have an account?</p>
                            <button
                                type="button"
                                className={cx('register-link')}
                                onClick={switchToLogin}
                            >
                                Log in
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default LoginForm;

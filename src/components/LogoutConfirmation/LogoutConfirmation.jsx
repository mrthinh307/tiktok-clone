import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './LogoutConfirmation.module.scss';

const cx = classNames.bind(styles);

function LogoutConfirmation({ onConfirm, onCancel }) {
    const [isVisible, setIsVisible] = useState(false);

    // Animation effect when component mounts
    useEffect(() => {
        // Small delay to trigger the animation
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    const handleConfirm = () => {
        setIsVisible(false);
        // Delay the actual confirm callback to allow animation to complete
        setTimeout(() => {
            onConfirm();
        }, 300);
    };

    const handleCancel = () => {
        setIsVisible(false);
        // Delay the actual cancel callback to allow animation to complete
        setTimeout(() => {
            onCancel();
        }, 300);
    };

    return createPortal(
        <div className={cx('overlay', { active: isVisible })}>
            <div className={cx('dialog', { active: isVisible })}>
                <div className={cx('header')}>
                    <h3>Log out</h3>
                </div>
                <div className={cx('body')}>
                    <p>Are you sure you want to log out?</p>
                </div>
                <div className={cx('buttons')}>
                    <button className={cx('cancel-btn')} onClick={handleCancel}>
                        Cancel
                    </button>
                    <button
                        className={cx('confirm-btn')}
                        onClick={handleConfirm}
                    >
                        Log out
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

LogoutConfirmation.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default LogoutConfirmation;

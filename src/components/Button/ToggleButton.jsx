import classNames from 'classnames/bind';
import styles from './ToggleButton.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ToggleButton() {
    const [isActive, setIsActive] = useState(false);

    const handleClick = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={cx('toggle-button', {'active': isActive})} onClick={handleClick}>
            <span className={cx('span-switch-icon', {'active': isActive})}></span>
        </div>
    );
}

export default ToggleButton;

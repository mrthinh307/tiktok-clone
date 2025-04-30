import classNames from 'classnames/bind';
import styles from './ToggleButton.scss';
import { useAutoScroll } from '~/contexts/AutoScrollContext';

const cx = classNames.bind(styles);

function ToggleButton() {
    const { isAutoScrollEnabled, toggleAutoScroll } = useAutoScroll();

    return (
        <div className={cx('toggle-button', {'active': isAutoScrollEnabled})} onClick={toggleAutoScroll}>
            <span className={cx('span-switch-icon', {'active': isAutoScrollEnabled})}></span>
        </div>
    );
}

export default ToggleButton;
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';

const cx = classNames.bind(styles);

function Menu({ children, items = [], className }) {
    const itemsSize = items.length;
    const renderItems = () => {
        return items.map((item, index) => {
            return index !== itemsSize - 1 ? (
                <MenuItem key={index} data={item} />
            ) : (
                <MenuItem
                    key={index}
                    data={item}
                    className={cx('menu-item-separator')}
                />
            );
        });
    };

    return (
        <HeadlessTippy
            interactive={true}
            animation={false}
            appendTo={() => document.body}
            placement="bottom-end"
            render={(attrs) => (
                <div className={cx('menu-items')} tabIndex="-1" {...attrs}>
                    <PopperWrapper className={cx('popper-wrapper', className)}>
                        {renderItems()}
                    </PopperWrapper>
                </div>
            )}
        >
            {children}
        </HeadlessTippy>
    );
}

export default Menu;

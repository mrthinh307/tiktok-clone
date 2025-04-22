import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import Header from './Header';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function Menu({
    children,
    items = [],
    className,
    onChange = defaultFn,
    hideOnClick = false,
    ...props
}) {
    const [history, setHistory] = useState([{ data: items }]);

    const renderItems = (props) => {
        return history[history.length - 1].data.map((item, index) => {
            const isParent = !!item.children;
            return (
                <MenuItem
                    key={index}
                    data={item}
                    buttonSize={item.buttonSize || props.buttonSize}
                    iconSize={item.iconSize || props.iconSize}
                    titleSize={item.titleSize || props.titleSize}
                    hoverType={item.hoverType || props.hoverType}
                    fontType={item.fontType || props.fontType}
                    onClick={() => {
                        if (isParent) {
                            setHistory((prev) => [...prev, item.children]);
                        } else {
                            onChange(item);
                        }
                    }}
                />
            );
        });
    };

    return (
        <HeadlessTippy
            interactive={true}
            hideOnClick={hideOnClick}
            offset={[12, 12]}
            delay={[0, props.hiddenDelayTime || 0]}
            animation={false}
            appendTo={() => document.body}
            placement="bottom-end"
            render={(attrs) => (
                <div className={cx('menu-items')} tabIndex="-1" {...attrs}>
                    <PopperWrapper
                        className={cx(
                            'popper-wrapper',
                            { 'has-header': history.length > 1 },
                            className,
                        )}
                    >
                        {history.length > 1 && (
                            <Header
                                title={history[history.length - 1].title}
                                onBack={() => {
                                    setHistory((prev) =>
                                        prev.slice(0, prev.length - 1),
                                    );
                                }}
                            />
                        )}
                        {renderItems(props)}
                    </PopperWrapper>
                </div>
            )}
            onHidden={() => setHistory((prev) => prev.slice(0, 1))}
        >
            {children}
        </HeadlessTippy>
    );
}

export default Menu;

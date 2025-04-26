import PropTypes from 'prop-types';
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
                    buttonPadding={item.buttonPadding || props.buttonPadding}
                    iconSize={item.iconSize || props.iconSize}
                    titleSize={item.titleSize || props.titleSize}
                    hoverType={item.hoverType || props.hoverType}
                    fontType={item.fontType || props.fontType}
                    onClick={() => {
                        // Next menu
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

    const handleBack = () => {
        setHistory((prev) => prev.slice(0, prev.length - 1))
    };

    const renderResult = (attrs) => (
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
                        onBack={handleBack}
                    />
                )}
                {renderItems(props)}
            </PopperWrapper>
        </div>
    );

    //  Reset to first menu when hidden
    const handleReset = () => {
        setHistory((prev) => prev.slice(0, 1));
    };

    return (
        <HeadlessTippy
            interactive={true}
            hideOnClick={hideOnClick}
            offset={[12, 4]}
            delay={[0, props.hiddenDelayTime || 0]}
            animation={false}
            appendTo={() => document.body}
            placement="bottom-end"
            render={renderResult}
            onHidden={handleReset}
        >
            {children}
        </HeadlessTippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    className: PropTypes.string,
    onChange: PropTypes.func,
    hideOnClick: PropTypes.bool,
    hiddenDelayTime: PropTypes.number,
};

export default Menu;

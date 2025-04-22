import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    buttonSize,
    iconSize,
    titleSize,
    hoverType,
    fontType,
    children,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps
}) {
    let Comp = 'button';
    const props = {
        onClick,
        ...passProps,
    };

    // Remove event listener when btn is disabled
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    const classes = cx(
        'wrapper',
        `button-${buttonSize}`,
        `hover-${hoverType}`,
        `font-${fontType}`,
        {
            [className]: className,
            primary,
            outline,
            text,
            disabled,
            rounded,
        },
    );

    return (
        <Comp className={classes} {...props}>
            {leftIcon && (
                <span className={cx('icon', `icon-${iconSize}`)}>
                    {leftIcon}
                </span>
            )}
            <span className={cx('title', `title-${titleSize}`)}>
                {children}
            </span>
            {rightIcon && (
                <span className={cx('icon', `icon-${iconSize}`)}>
                    {rightIcon}
                </span>
            )}
        </Comp>
    );
}

Button.prototypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    buttonSize: PropTypes.string,
    iconSize: PropTypes.string,
    titleSize: PropTypes.string,
    hoverType: PropTypes.string,
    fontType: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onClick: PropTypes.func,
};

export default Button;

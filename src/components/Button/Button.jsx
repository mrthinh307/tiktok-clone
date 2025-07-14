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
  collapsed = false,
  buttonPadding,
  iconSize,
  titleSize,
  hoverType,
  fontType,
  children,
  leftIcon,
  rightIcon,
  onClick,
  className,
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
    `padding-${buttonPadding}`,
    `hover-${hoverType}`,
    `font-${fontType}`,
    {
      [className]: className,
      primary,
      outline,
      text,
      disabled,
      rounded,
      collapsed,
    },
  );

  return (
    <Comp {...props} className={classes}>
      {leftIcon && (
        <span className={cx('icon', `icon-${iconSize}`)}>{leftIcon}</span>
      )}
      <span
        className={cx('title', `title-${titleSize}`, {
          'has-right-icon': rightIcon,
        })}
      >
        {children}
        {rightIcon && (
          <span className={cx('icon', 'right-icon')}>{rightIcon}</span>
        )}
      </span>
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
  buttonPadding: PropTypes.string,
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

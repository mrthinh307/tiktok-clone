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
  onClick,
  onChange = defaultFn,
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
          primary={item.primary || props.primary}
          rounded={item.rounded || props.rounded}
          outline={item.outline || props.outline}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
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
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const renderResult = (attrs) => (
    <div
      className={cx('menu-wrapper')}
      tabIndex="-1"
      {...attrs}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
    >
      <PopperWrapper
        className={cx(
          'popper-wrapper',
          { 'has-header': history.length > 1 },
          className,
        )}
        onClick={(e) => e.stopPropagation()}
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
      trigger={props.trigger || undefined}
      hideOnClick={props.hideOnClick || false}
      offset={props.offset || [12, 8]}
      delay={[0, props.hiddenDelayTime || 0]}
      // animation={true}
      appendTo={document.body}
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
  onClick: PropTypes.func,
  hiddenDelayTime: PropTypes.number,
};

export default Menu;

import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ToggleButton.module.scss';

const cx = classNames.bind(styles);

function ToggleButton({
  isActive,
  onChange,
  useContext = false,
  contextHook = null,
  contextStateKey = 'isActive',
  contextToggleKey = 'toggle',
}) {
  // State local
  const [localActive, setLocalActive] = useState(false);

  // Use context
  let contextValue = null;
  let contextToggle = null;

  if (useContext && contextHook) {
    try {
      const contextData = contextHook();
      contextValue = contextData[contextStateKey];
      contextToggle = contextData[contextToggleKey];
    } catch (error) {
      console.error('Error using context in ToggleButton:', error);
    }
  }

  // Determine which active state to use
  const active =
    // 1. Ưu tiên props từ bên ngoài
    isActive !== undefined
      ? isActive
      : // 2. Nếu không có props, thử dùng context
        useContext && contextValue !== null
        ? contextValue
        : // 3. Cuối cùng, dùng state local
          localActive;

  // Xử lý khi toggle
  const handleToggle = () => {
    if (onChange) {
      // Nếu có handler từ bên ngoài, gọi handler đó
      onChange(!active);
    } else if (useContext && contextToggle) {
      // Nếu dùng context và có hàm toggle
      contextToggle();
    } else {
      // Mặc định dùng state local
      setLocalActive(!localActive);
    }
  };

  return (
    <div
      className={cx('toggle-button', { active: active })}
      onClick={handleToggle}
    >
      <span className={cx('span-switch-icon', { active: active })}></span>
    </div>
  );
}

ToggleButton.propTypes = {
  isActive: PropTypes.bool,
  onChange: PropTypes.func,
  useContext: PropTypes.bool,
  contextHook: PropTypes.func,
  contextStateKey: PropTypes.string,
  contextToggleKey: PropTypes.string,
};

export default ToggleButton;

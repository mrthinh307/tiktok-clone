import cx from 'clsx';
import styles from './EmptyState.module.scss';

function EmptyState({ icon, title, description, className }) {
  return (
    <div className={cx(styles['empty-state'], className)}>
      {icon && <div className={cx(styles['empty-icon'])}>{icon}</div>}
      <div className={cx(styles['empty-title'])}>{title}</div>
      <div className={cx(styles['empty-description'])}>{description}</div>
    </div>
  );
}

export default EmptyState;

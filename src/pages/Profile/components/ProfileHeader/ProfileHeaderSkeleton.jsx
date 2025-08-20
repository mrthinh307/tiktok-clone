import cx from 'clsx';
import styles from './ProfileHeader.module.scss';

function ProfileHeaderSkeleton() {
  return (
    <div className={cx(styles['profile-header'])}>
      {/* Avatar Skeleton */}
      <div className={cx(styles['avatar-container'])}>
        <div className={cx(styles.avatar, styles.skeleton)} />
      </div>

      {/* User Info Skeleton */}
      <div className={cx(styles['user-info'])}>
        {/* Username and Display Name Skeleton */}
        <div className={cx(styles['user-details'])}>
          <div
            className={cx(
              styles.username,
              styles.skeleton,
              styles['skeleton-text'],
            )}
            style={{ width: '180px', height: '29px' }}
          />
          <div
            className={cx(
              styles['display-name'],
              styles.skeleton,
              styles['skeleton-text'],
            )}
            style={{ width: '120px', height: '22px' }}
          />
        </div>

        {/* Action Buttons Skeleton */}
        <div className={cx(styles['action-buttons'])}>
          <div
            className={cx(styles['edit-profile-btn'], styles.skeleton)}
            style={{ width: '108px', height: '40px' }}
          />
          <div
            className={cx(styles['promote-post-btn'], styles.skeleton)}
            style={{ width: '108px', height: '40px' }}
          />
          <div className={cx(styles['action-icon'], styles.skeleton)} />
          <div className={cx(styles['action-icon'], styles.skeleton)} />
        </div>

        {/* Stats Skeleton */}
        <div className={cx(styles['stats-container'])}>
          <div className={cx(styles['stat-item'])}>
            <div
              className={cx(
                styles['stat-number'],
                styles.skeleton,
                styles['skeleton-text'],
              )}
              style={{ width: '40px', height: '22px' }}
            />
            <div
              className={cx(
                styles['stat-label'],
                styles.skeleton,
                styles['skeleton-text'],
              )}
              style={{ width: '60px', height: '19px' }}
            />
          </div>
          <div className={cx(styles['stat-item'])}>
            <div
              className={cx(
                styles['stat-number'],
                styles.skeleton,
                styles['skeleton-text'],
              )}
              style={{ width: '40px', height: '22px' }}
            />
            <div
              className={cx(
                styles['stat-label'],
                styles.skeleton,
                styles['skeleton-text'],
              )}
              style={{ width: '65px', height: '19px' }}
            />
          </div>
          <div className={cx(styles['stat-item'])}>
            <div
              className={cx(
                styles['stat-number'],
                styles.skeleton,
                styles['skeleton-text'],
              )}
              style={{ width: '40px', height: '22px' }}
            />
            <div
              className={cx(
                styles['stat-label'],
                styles.skeleton,
                styles['skeleton-text'],
              )}
              style={{ width: '40px', height: '19px' }}
            />
          </div>
        </div>

        {/* Bio Skeleton */}
        <div>
          <div
            className={cx(styles.bio, styles.skeleton, styles['skeleton-text'])}
            style={{ width: '300px', height: '19px', marginBottom: '4px' }}
          />
          <div
            className={cx(styles.bio, styles.skeleton, styles['skeleton-text'])}
            style={{ width: '250px', height: '19px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileHeaderSkeleton;

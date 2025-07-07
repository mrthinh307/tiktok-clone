import React from 'react';
import classNames from 'classnames/bind';
import styles from '../Upload.module.scss';
import { CloseIcon } from '~/assets/images/icons';

const cx = classNames.bind(styles);

function DiscardConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className={cx('modal-overlay')} onClick={onCancel}>
      <div className={cx('modal-content')} onClick={(e) => e.stopPropagation()}>
        <div className={cx('modal-header')}>
          <h3 className={cx('modal-title')}>Discard video?</h3>
          <button className={cx('modal-close')} onClick={onCancel}>
            <CloseIcon />
          </button>
        </div>

        <div className={cx('modal-body')}>
          <p className={cx('modal-message')}>
            Your video upload will be discarded and all changes will be lost.
            This action cannot be undone.
          </p>
        </div>

        <div className={cx('modal-actions')}>
          <button
            className={cx('modal-button', 'cancel-button')}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={cx('modal-button', 'confirm-button')}
            onClick={onConfirm}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiscardConfirmModal;

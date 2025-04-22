import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import Tippy from '@tippyjs/react';

const cx = classNames.bind(styles);

function ContentItem({ data }) {
    const renderChildren = (children) => {
        if (!children) return null;

        return children.map((child, index) => (
            <div key={index} className={cx('content-group')}>
                {child.icon && (
                    <div className={cx('content-icon')}>{child.icon}</div>
                )}
                <div>
                    <div
                        className={cx('content-text', {
                            'strong-text': child.strongTitle,
                        })}
                    >
                        {child.title}
                    </div>
                    <div className={cx('content-desc')}>{child.desc}</div>
                </div>
                {child.action && (
                    <div
                        className={cx(
                            'content-action',
                            `${child.action.type}-action`,
                        )}
                        onClick={child.action.onClick}
                    >
                        {!!child.action.text && (
                            <span className={cx('text-action')}>
                                {child.action.text}
                            </span>
                        )}
                        {child.action.content}
                    </div>
                )}
            </div>
        ));
    };

    const renderItems = (items) => {
        return items.map((item, index) => (
            <div
                key={index}
                className={cx('content-item', { 'no-title': !item.title })}
            >
                {item.title && (
                    <div className={cx('subtitle-container')}>
                        <div className={cx('content-subtitle')}>
                            {item.title}
                        </div>
                        {item.desc && item.desc.length > 0 && (
                            <div className={cx('content-desc')}>
                                {item.desc}
                            </div>
                        )}
                        {item.action && (
                            <div
                                className={cx(
                                    'content-action',
                                    `${item.action.type}-action`,
                                )}
                                onClick={item.action.onClick}
                            >
                                {!!item.action.text && (
                                    <span className={cx('text-action')}>
                                        {item.action.text}
                                    </span>
                                )}
                                {item.action.content}
                            </div>
                        )}
                    </div>
                )}
                {item.children && renderChildren(item.children)}
            </div>
        ));
    };

    return (
        <div className={cx('content-wrapper')}>
            <div className={cx('content-container')}>
                <div className={cx('content-title')}>
                    {data.title}
                    {data.tooltip && (
                        <Tippy
                            content={
                                <span className={cx('tooltip-box')}>
                                    {data.tooltip.desc}
                                </span>
                            }
                            maxWidth="none"
                        >
                            <div className={cx('tooltip-icon')}>
                                {data.tooltip.icon}
                            </div>
                        </Tippy>
                    )}
                </div>
                {renderItems(data.items)}
            </div>
        </div>
    );
}

ContentItem.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        tooltip: PropTypes.shape({
            desc: PropTypes.string,
            icon: PropTypes.node,
        }),
        items: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                desc: PropTypes.string,
                action: PropTypes.shape({
                    type: PropTypes.string,
                    text: PropTypes.string,
                    onClick: PropTypes.func,
                    content: PropTypes.node,
                }),
                children: PropTypes.arrayOf(
                    PropTypes.shape({
                        icon: PropTypes.node,
                        title: PropTypes.string,
                        desc: PropTypes.string,
                        strongTitle: PropTypes.bool,
                        action: PropTypes.shape({
                            type: PropTypes.string,
                            text: PropTypes.string,
                            onClick: PropTypes.func,
                            content: PropTypes.node,
                        }),
                    }),
                ),
            }),
        ),
    }).isRequired,
};

export default ContentItem;

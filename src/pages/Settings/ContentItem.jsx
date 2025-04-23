import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import Tippy from '@tippyjs/react';

const cx = classNames.bind(styles);

// Component tooltip
const ContentTooltip = ({ tooltip }) => (
    <Tippy
        content={<span className={cx('tooltip-box')}>{tooltip.desc}</span>}
        maxWidth="none"
        placement="top"
        delay={[100, 200]}
    >
        <div className={cx('tooltip-icon')}>{tooltip.icon}</div>
    </Tippy>
);

// Component Action (shared between item and child)
const ContentAction = ({ action }) => (
    <div
        className={cx('content-action', `${action.type}-action`)}
        onClick={action.onClick}
    >
        {!!action.text && (
            <span className={cx('text-action')}>{action.text}</span>
        )}
        {action.content}
    </div>
);

// Component for subtitle container
const ContentSubtitle = ({ item }) => (
    <div className={cx('subtitle-container')}>
        <div className={cx('content-subtitle')}>{item.title}</div>
        {item.desc && item.desc.length > 0 && (
            <div className={cx('content-desc')}>{item.desc}</div>
        )}
        {item.action && <ContentAction action={item.action} />}
    </div>
);

// Component for each child item of ContentItemSingle
const ContentChild = ({ child }) => (
    <div className={cx('content-group')}>
        {child.icon && <div className={cx('content-icon')}>{child.icon}</div>}
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
        {child.action && <ContentAction action={child.action} />}
    </div>
);

// Component for each content item
const ContentItemSingle = ({ item }) => (
    <div className={cx('content-item', { 'no-title': !item.title })}>
        {item.title && <ContentSubtitle item={item} />}
        {item.children &&
            item.children.map((child, index) => (
                <ContentChild key={index} child={child} />
            ))}
    </div>
);

// main Component
function ContentItem({ data }) {
    return (
        <div className={cx('content-wrapper')}>
            <div className={cx('content-container')}>
                <div className={cx('content-title')}>
                    {data.title}
                    {data.tooltip && <ContentTooltip tooltip={data.tooltip} />}
                </div>

                {data.items &&
                    data.items.map((item, index) => (
                        <ContentItemSingle key={index} item={item} />
                    ))}
            </div>
        </div>
    );
}

// PropTypes for each component
ContentTooltip.propTypes = {
    tooltip: PropTypes.shape({
        desc: PropTypes.string,
        icon: PropTypes.node,
    }).isRequired,
};

ContentAction.propTypes = {
    action: PropTypes.shape({
        type: PropTypes.string,
        text: PropTypes.string,
        onClick: PropTypes.func,
        content: PropTypes.node,
    }).isRequired,
};

ContentChild.propTypes = {
    child: PropTypes.shape({
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
    }).isRequired,
};

ContentSubtitle.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string.isRequired,
        desc: PropTypes.string,
        action: PropTypes.object,
    }).isRequired,
};

ContentItemSingle.propTypes = {
    item: PropTypes.shape({
        title: PropTypes.string,
        desc: PropTypes.string,
        action: PropTypes.object,
        children: PropTypes.array,
    }).isRequired,
};

// PropTypes for ContentItem component
ContentItem.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
        tooltip: PropTypes.shape({
            desc: PropTypes.string,
            icon: PropTypes.node,
        }),
        items: PropTypes.array,
    }).isRequired,
};

export default ContentItem;

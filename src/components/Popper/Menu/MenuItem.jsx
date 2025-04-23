import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({
    data,
    buttonPadding,
    iconSize,
    titleSize,
    hoverType,
    fontType,
    onClick,
    active,
}) {
    return (
        <Button
            className={cx('menu-item',{
                seperate: data.seperate,
                active: active,
            })}
            buttonPadding={buttonPadding}
            iconSize={iconSize}
            titleSize={titleSize}
            hoverType={hoverType}
            fontType={fontType}
            onClick={onClick}
            leftIcon={data.icon}
        >
            {data.title}
        </Button>
    );
}

MenuItem.propTypes = {
    data: PropTypes.shape({
        icon: PropTypes.node,
        title: PropTypes.string.isRequired,
        seperate: PropTypes.bool,
    }).isRequired,
    buttonPadding: PropTypes.string,
    iconSize: PropTypes.string,
    titleSize: PropTypes.string,
    hoverType: PropTypes.string,
    fontType: PropTypes.string,
    onClick: PropTypes.func,
    active: PropTypes.bool,
}

export default MenuItem;

import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({
    data,
    buttonSize,
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
            buttonSize={buttonSize}
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

export default MenuItem;

import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({ data, buttonSize, iconSize, titleSize, hoverType, fontType, onClick }) {
    return (
        <Button
            buttonSize={buttonSize}
            iconSize={iconSize}
            titleSize={titleSize}
            hoverType={hoverType}
            fontType={fontType}
            className={cx({seperate: data.seperate})}
            onClick={onClick}
            leftIcon={data.icon}
        >
            {data.title}
        </Button>
    );
}

export default MenuItem;

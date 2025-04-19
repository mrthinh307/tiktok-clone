import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { useContext } from 'react';
import { ConfigureButtonContext } from '~/components/AccountItem/index';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({ data, className }) {
    const { buttonSize, iconSize, hoverType } =
        useContext(ConfigureButtonContext) || {};

    return (
        <Button
            buttonSize={buttonSize || 'medium'}
            iconSize={iconSize || 'small'}
            hoverType={hoverType || 'background'}
            leftIcon={data.icon}
            className={cx({[className]: className})
            }
        >
            {data.title}
        </Button>
    );
}

export default MenuItem;

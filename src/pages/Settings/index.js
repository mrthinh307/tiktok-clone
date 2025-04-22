import classNames from 'classnames/bind';
import styles from './Setting.module.scss';
import ContentItem from './ContentItem';
import { ArrowBackIcon } from '~/assets/images/icons';
import { SETTING_CONTENT_ITEMS } from './constants';
import Sidebar from './Sidebar';

const cx = classNames.bind(styles);



const renderContents = (items) => {
    return items.map((item, index) => {
        return <ContentItem key={index} data={item} />;
    });
};

function Setting() {
    return (
        <div className={cx('setting-wrapper')}>
            <div className={cx('setting-container')}>
                <ArrowBackIcon className={cx('back-button')} />
                <div className={cx('setting-main')}>
                    <Sidebar />
                    <div className={cx('setting-content', 'hide-scrollbar')}>
                        {renderContents(SETTING_CONTENT_ITEMS)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Setting;

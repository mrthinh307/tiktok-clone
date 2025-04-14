import SideBar from './SideBar';

function DefaultLayout({ children }) {
    return (
        <div>
            <SideBar />
            <div className="content">{children}</div>
        </div>
    );
}

export default DefaultLayout;

import { useParams } from 'react-router-dom';

function Profile() {
    const { nickname } = useParams();

    return (
        <div>
            <h2>Profile Page</h2>
            {nickname && (
                <div>
                    <h3>@{nickname}</h3>
                    <p>Đây là trang profile của {nickname}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;

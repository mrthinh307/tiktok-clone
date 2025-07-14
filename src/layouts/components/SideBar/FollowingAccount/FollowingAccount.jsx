import { Link } from 'react-router-dom';

function FollowingAccount({ user }) {
  return (
    <Link
      to={`/user/${user.nickname}`}
      rel="noopener noreferrer"
      className="w-full flex items-center rounded-[8px] hover:bg-[#f2f2f2] transition-colors duration-200 py-[4px]"
    >
      <img
        src={user.avatar_url}
        alt="Avatar"
        className="w-[26px] h-[26px] rounded-full mr-[12px] ml-[8px] object-cover"
      />
      <div className="flex flex-col">
        <span className="text-[1.4rem] font-bold leading-[18px]">
          {user.fullName}
        </span>
        <span className="text-[1.4rem] leading-[18px]">{user.nickname}</span>
      </div>
    </Link>
  );
}

export default FollowingAccount;

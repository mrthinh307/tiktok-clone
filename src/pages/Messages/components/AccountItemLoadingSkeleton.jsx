function AccountItemLoadingSkeleton() {
  return (
    <div className="relative w-full h-[72px] flex items-center justify-start pl-[16px] pr-[20px] cursor-pointer flex-shrink-0 animate-pulse">
      {/* Avatar skeleton */}
      <div className="w-[48px] h-[48px] relative">
        <div className="w-full h-full rounded-full bg-gray-200"></div>
        {/* Online status skeleton */}
        <div className="absolute bottom-[-2px] right-0 w-[1.4rem] h-[1.4rem] rounded-full border-2 border-white bg-gray-200"></div>
      </div>

      {/* Content skeleton */}
      <div className="pl-[12px] flex-1 space-y-2">
        {/* Name skeleton */}
        <div className="h-[18px] bg-gray-200 rounded max-w-[140px]"></div>

        {/* Last message skeleton */}
        <div className="flex items-center space-x-2">
          <div className="h-[14px] bg-gray-200 rounded flex-1 max-w-[180px]"></div>
        </div>
      </div>
    </div>
  );
}

export default AccountItemLoadingSkeleton;

import React from 'react';

const ChatLoadingSkeleton = () => {
  return (
    <div className="space-y-[1.6rem] animate-pulse">
      {/* 4 message skeletons để không quá height */}
      {[1, 2].map((index) => (
        <div key={index} className="flex items-start gap-[0.8rem]">
          {/* Avatar skeleton */}
          <div className="w-[3.2rem] h-[3.2rem] bg-gray-200 rounded-full flex-shrink-0"></div>

          {/* Message content skeleton */}
          <div className="flex-1">
            <div
              className={`bg-gray-100 rounded-[0.8rem] p-[12px] ${
                index % 2 === 0 ? 'w-[280px]' : 'w-[380px]'
              }`}
            >
              <div className="h-[16px] bg-gray-200 rounded mb-2"></div>
              <div className="h-[16px] bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}

      {/* 2 right-aligned messages */}
      {[1, 2].map((index) => (
        <div
          key={`right-${index}`}
          className="flex items-start gap-[0.8rem] justify-end"
        >
          {/* Message content skeleton */}
          <div
            className={`bg-gray-100 rounded-[0.8rem] p-[12px] ${
              index % 2 === 0 ? 'w-[250px]' : 'w-[190px]'
            }`}
          >
            <div className="h-[16px] bg-gray-200 rounded mb-2"></div>
            <div className="h-[16px] bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Avatar skeleton */}
          <div className="w-[3.2rem] h-[3.2rem] bg-gray-200 rounded-full flex-shrink-0"></div>
        </div>
      ))}

      {[1, 2].map((index) => (
        <div key={index} className="flex items-start gap-[0.8rem]">
          {/* Avatar skeleton */}
          <div className="w-[3.2rem] h-[3.2rem] bg-gray-200 rounded-full flex-shrink-0"></div>

          {/* Message content skeleton */}
          <div className="flex-1">
            <div
              className={`bg-gray-100 rounded-[0.8rem] p-[12px] ${
                index % 2 === 1 ? 'w-[220px]' : 'w-[180px]'
              }`}
            >
              <div className="h-[16px] bg-gray-200 rounded mb-2"></div>
              <div className="h-[16px] bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}

      {[1].map((index) => (
        <div
          key={`right-${index}`}
          className="flex items-start gap-[0.8rem] justify-end"
        >
          {/* Message content skeleton */}
          <div className={` bg-gray-100 rounded-[0.8rem] p-[12px] w-[150px]`}>
            <div className="h-[16px] bg-gray-200 rounded mb-2"></div>
            <div className="h-[16px] bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Avatar skeleton */}
          <div className="w-[3.2rem] h-[3.2rem] bg-gray-200 rounded-full flex-shrink-0"></div>
        </div>
      ))}

      {[1].map((index) => (
        <div key={index} className="flex items-start gap-[0.8rem]">
          {/* Avatar skeleton */}
          <div className="w-[3.2rem] h-[3.2rem] bg-gray-200 rounded-full flex-shrink-0"></div>

          {/* Message content skeleton */}
          <div className="flex-1">
            <div className={` bg-gray-100 rounded-[0.8rem] p-[12px] w-[300px]`}>
              <div className="h-[16px] bg-gray-200 rounded mb-2"></div>
              <div className="h-[16px] bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatLoadingSkeleton;

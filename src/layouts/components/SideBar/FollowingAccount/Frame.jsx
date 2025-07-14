function Frame() {
  return (
    <div className="w-full flex items-center rounded-[8px] py-[4px]">
      <div className="w-[28px] h-[28px] rounded-full mr-[12px] ml-[8px] bg-gray-200"></div>
      <div className="flex flex-col flex-1 gap-[4px]">
        <div className="w-full h-[14px] bg-gray-200 rounded-[4px]"></div>
        <div className="w-[60%] h-[14px] bg-gray-200 rounded-[4px]"></div>
      </div>
    </div>
  );
}

export default Frame;

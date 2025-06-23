function Frame() {
    return (
        <div className="w-[226px] h-[302px] rounded-[8px] mb-[18px] mr-[18px] block bg-gray-200 relative overflow-hidden">
            {/* Content skeleton structure matching SuggestAccount */}
            <div className="w-full h-full relative">
                {/* Main background image area */}
                <div className="w-full h-full bg-gray-100 rounded-[8px]"></div>
            </div>

            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
    );
}

export default Frame;

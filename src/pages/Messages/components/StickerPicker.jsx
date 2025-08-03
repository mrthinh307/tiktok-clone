import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { STICKER_CATEGORIES } from '~/constants/common';

const StickerPicker = ({ onSelectSticker }) => {
  const hasCategories = STICKER_CATEGORIES && STICKER_CATEGORIES.length > 0;
  const [activeCategory, setActiveCategory] = useState(
    hasCategories ? STICKER_CATEGORIES[0].name : null,
  );

  if (!hasCategories) {
    return (
      <div className="...">
        <p className="text-gray-500">No stickers available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-7">
          {STICKER_CATEGORIES.find(
            (cat) => cat.name === activeCategory,
          )?.stickers.map((sticker) => (
            <motion.button
              key={sticker}
              onClick={() => onSelectSticker(sticker)}
              className="text-[2.4rem] rounded-lg hover:bg-gray-100 transition-colors mx-[6px] my-[5px] w-[40px] h-[40px]"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {sticker}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="h-[5rem] flex-shrink-0 bg-gray-50 border-t border-gray-200 flex items-center px-[1.6rem] gap-[1.6rem]">
        {STICKER_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`p-[0.8rem] rounded-lg text-gray-500 ${
              activeCategory === cat.name ? 'bg-gray-200' : ''
            }`}
          >
            <span className="text-2xl">{cat.stickers[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

StickerPicker.propTypes = {
  onSelectSticker: PropTypes.func.isRequired,
};

export default StickerPicker;

import React from 'react';

function NewsTicker({ news }) {
  return (
    <div className="bg-[#030712] border border-[#112240] rounded-xl px-5 py-2.5 flex items-center gap-4 text-xs font-semibold overflow-hidden relative">
      <span className="text-violet-400 font-bold tracking-wider uppercase shrink-0 border-r border-[#112240] pr-4">
        Market News
      </span>
      <marquee className="text-[#94A3B8] font-medium" scrollamount="4">
        15:20  •  {news}
      </marquee>
    </div>
  );
}

export default NewsTicker;

import React from 'react';

function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#060D19]/60 border border-[#112240]/80 rounded-xl p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:border-[#1E3A8A]/40 ${className}`}>
      {children}
    </div>
  );
}

export default Card;

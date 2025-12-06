import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full flex flex-col items-center justify-center pt-8 pb-4 px-4">
      <div className="bg-white/20 backdrop-blur-lg p-4 rounded-3xl shadow-2xl border border-white/30 transform hover:scale-105 transition-transform duration-300">
        <img 
          src="https://i.ibb.co.com/ccSkPzQ/Hemontu-Inc-Logo.png" 
          alt="Hemontu Inc Logo" 
          className="h-24 w-auto object-contain drop-shadow-md"
        />
      </div>
      <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg bengali-text">
        HemoOCR
      </h1>
      <p className="mt-2 text-white/90 text-lg md:text-xl font-light tracking-wide text-center">
        The World's Foremost Paleographer
      </p>
    </header>
  );
};

export default Header;
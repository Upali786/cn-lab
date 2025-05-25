import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm">DESIGNED AND DEVELOPED BY IEEE-NBKRIST</p>
          <p className="text-xs mt-1 text-gray-400">© {new Date().getFullYear()} NBKR Institute of Science and Technology</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
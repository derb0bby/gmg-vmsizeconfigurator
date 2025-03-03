import React from 'react';
import { Server } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-[#ee2d68] to-[#d41e56] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center">
          <Server className="h-10 w-10 mr-4" />
          <div>
            <h1 className="text-3xl font-bold">VM Size Configurator</h1>
            <p className="mt-2 text-white opacity-90">
              Find the optimal virtual machine configuration for your workload
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

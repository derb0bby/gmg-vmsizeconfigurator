import React from 'react';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

interface CustomRequirementsProps {
  cpu: number;
  ram: number;
  storage: number;
  onCpuChange: (value: number) => void;
  onRamChange: (value: number) => void;
  onStorageChange: (value: number) => void;
}

const CustomRequirements: React.FC<CustomRequirementsProps> = ({
  cpu,
  ram,
  storage,
  onCpuChange,
  onRamChange,
  onStorageChange
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Custom Requirements</h2>
      <p className="text-sm text-gray-500 mb-4">
        Adjust these values if you have specific requirements beyond the selected applications.
      </p>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Cpu className="h-4 w-4 mr-2" />
            CPU Cores: {cpu}
          </label>
          <input
            type="range"
            min="1"
            max="32"
            value={cpu}
            onChange={(e) => onCpuChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>32</span>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MemoryStick className="h-4 w-4 mr-2" />
            RAM (GB): {ram}
          </label>
          <input
            type="range"
            min="1"
            max="64"
            value={ram}
            onChange={(e) => onRamChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>16</span>
            <span>32</span>
            <span>48</span>
            <span>64</span>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <HardDrive className="h-4 w-4 mr-2" />
            Storage (GB): {storage}
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={storage}
            onChange={(e) => onStorageChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10</span>
            <span>250</span>
            <span>500</span>
            <span>750</span>
            <span>1000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomRequirements;

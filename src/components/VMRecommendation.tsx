import React from 'react';
import { VMSize, Application } from '../types';
import { Cpu, MemoryStick, HardDrive, Usb, Server } from 'lucide-react';

interface VMRecommendationProps {
  recommendedVM: VMSize | null;
  requiredCpu: number;
  requiredRam: number;
  requiredStorage: number;
  requiresUsb: boolean;
  alternativeVMs: VMSize[];
  selectedApplication: Application | null;
}

const VMRecommendation: React.FC<VMRecommendationProps> = ({
  recommendedVM,
  requiredCpu,
  requiredRam,
  requiredStorage,
  requiresUsb,
  alternativeVMs,
  selectedApplication
}) => {
  if (!recommendedVM || !selectedApplication) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Server className="h-5 w-5 text-[#ee2d68] mr-2" />
          <h2 className="text-xl font-semibold text-[#333]">Recommended VM Configuration</h2>
        </div>
        <p className="text-gray-600">
          Select an application to get a VM recommendation.
        </p>
      </div>
    );
  }

  const renderVMCard = (vm: VMSize, isRecommended: boolean = false) => (
    <div className={`border rounded-lg p-4 ${isRecommended ? 'border-[#ee2d68] bg-[#F5F5F5]' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-[#333] flex items-center">
            {vm.name}
            {isRecommended && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ee2d68] text-white">
                Recommended
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{vm.description}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
          <Cpu className="h-3 w-3 mr-1 text-[#ee2d68]" /> {vm.cpu} cores
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
          <MemoryStick className="h-3 w-3 mr-1 text-[#ee2d68]" /> {vm.ram} GB
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
          <HardDrive className="h-3 w-3 mr-1 text-[#ee2d68]" /> {vm.storage} GB
        </span>
        {vm.hasUsbPort && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
            <Usb className="h-3 w-3 mr-1 text-[#ee2d68]" /> USB Port
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Server className="h-5 w-5 text-[#ee2d68] mr-2" />
        <h2 className="text-xl font-semibold text-[#333]">Recommended VM Configuration</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-[#333]">Minimal Requirements for {selectedApplication.name}</h3>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
            <Cpu className="h-4 w-4 mr-1 text-[#ee2d68]" /> {requiredCpu} cores
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
            <MemoryStick className="h-4 w-4 mr-1 text-[#ee2d68]" /> {requiredRam} GB RAM
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
            <HardDrive className="h-4 w-4 mr-1 text-[#ee2d68]" /> {requiredStorage} GB Storage
          </span>
          {requiresUsb && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
              <Usb className="h-4 w-4 mr-1 text-[#ee2d68]" /> USB Port Required
            </span>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-[#333]">Recommended VM</h3>
        {renderVMCard(recommendedVM, true)}
      </div>
      
      {alternativeVMs.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-[#333]">Alternative Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alternativeVMs.map(vm => renderVMCard(vm))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VMRecommendation;

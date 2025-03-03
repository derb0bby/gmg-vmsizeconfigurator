import React from 'react';
import { VMSize } from '../types';
import { Check, AlertCircle, Cpu, MemoryStick, HardDrive, DollarSign } from 'lucide-react';

interface VMRecommendationProps {
  recommendedVM: VMSize | null;
  requiredCpu: number;
  requiredRam: number;
  requiredStorage: number;
  alternativeVMs: VMSize[];
}

const VMRecommendation: React.FC<VMRecommendationProps> = ({
  recommendedVM,
  requiredCpu,
  requiredRam,
  requiredStorage,
  alternativeVMs
}) => {
  if (!recommendedVM) {
    return (
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
          <h2 className="text-xl font-semibold text-yellow-700">No Suitable VM Found</h2>
        </div>
        <p className="mt-2 text-yellow-600">
          Your requirements exceed our largest VM configuration. Please consider reducing your requirements or contact us for a custom solution.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recommended VM Configuration</h2>
      
      <div className="bg-white border border-green-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-green-50 px-6 py-4 border-b border-green-200">
          <div className="flex items-center">
            <Check className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-green-800">{recommendedVM.name}</h3>
          </div>
          <p className="mt-1 text-sm text-green-600">{recommendedVM.description}</p>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 flex items-center">
                <Cpu className="h-4 w-4 mr-1" /> CPU
              </span>
              <span className="text-lg font-medium">{recommendedVM.cpu} cores</span>
              <span className={`text-xs ${requiredCpu > recommendedVM.cpu ? 'text-red-500' : 'text-green-500'}`}>
                Required: {requiredCpu} cores
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 flex items-center">
                <MemoryStick className="h-4 w-4 mr-1" /> RAM
              </span>
              <span className="text-lg font-medium">{recommendedVM.ram} GB</span>
              <span className={`text-xs ${requiredRam > recommendedVM.ram ? 'text-red-500' : 'text-green-500'}`}>
                Required: {requiredRam} GB
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 flex items-center">
                <HardDrive className="h-4 w-4 mr-1" /> Storage
              </span>
              <span className="text-lg font-medium">{recommendedVM.storage} GB</span>
              <span className={`text-xs ${requiredStorage > recommendedVM.storage ? 'text-red-500' : 'text-green-500'}`}>
                Required: {requiredStorage} GB
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" /> Price
              </span>
              <span className="text-lg font-medium">${recommendedVM.price}/month</span>
            </div>
          </div>
        </div>
      </div>
      
      {alternativeVMs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Alternative Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternativeVMs.map((vm) => (
              <div key={vm.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all">
                <h4 className="font-medium">{vm.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{vm.description}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">CPU:</span>
                    <span>{vm.cpu} cores</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">RAM:</span>
                    <span>{vm.ram} GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Storage:</span>
                    <span>{vm.storage} GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span>${vm.price}/month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VMRecommendation;

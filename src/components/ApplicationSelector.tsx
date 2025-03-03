import React from 'react';
import { Application } from '../types';
import { Check, Cpu, MemoryStick, HardDrive, Usb } from 'lucide-react';

interface ApplicationSelectorProps {
  applications: Application[];
  selectedApplications: string[];
  onSelectApplication: (id: string) => void;
}

const ApplicationSelector: React.FC<ApplicationSelectorProps> = ({
  applications,
  selectedApplications,
  onSelectApplication
}) => {
  // Filter to only show color applications
  const colorApplications = applications.filter(app => 
    ['color-proof', 'open-color', 'color-server-conv-multi', 'color-server-digital'].includes(app.id)
  );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-[#333]">Select an Application</h2>
      <p className="text-sm text-gray-600 mb-4">
        Choose one application to get a VM recommendation based on your specific requirements.
      </p>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-[#333]">Color Management Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {colorApplications.map((app) => (
            <div
              key={app.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedApplications.includes(app.id)
                  ? 'border-[#ee2d68] bg-[#F5F5F5]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectApplication(app.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#333]">{app.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                </div>
                {selectedApplications.includes(app.id) && (
                  <Check className="text-[#ee2d68] h-5 w-5" />
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                  <Cpu className="h-3 w-3 mr-1 text-[#ee2d68]" /> {app.cpuRequirement} cores
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                  <MemoryStick className="h-3 w-3 mr-1 text-[#ee2d68]" /> {app.ramRequirement} GB
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                  <HardDrive className="h-3 w-3 mr-1 text-[#ee2d68]" /> {app.storageRequirement} GB
                </span>
                {app.hasUsbRequirement && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                    <Usb className="h-3 w-3 mr-1 text-[#ee2d68]" /> USB Required
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSelector;

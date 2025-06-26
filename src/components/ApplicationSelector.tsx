import React from 'react';
import { Application, ApplicationParameter } from '../types';
import { Check, Cpu, MemoryStick, HardDrive, Usb } from 'lucide-react';

interface ApplicationSelectorProps {
  applications: Application[];
  selectedApplications: string[];
  onSelectApplication: (id: string) => void;
  parameters: ApplicationParameter[];
  parameterValues: {
    [applicationId: string]: {
      [parameterId: string]: number | string[];
    };
  };
  onParameterChange: (applicationId: string, parameterId: string, value: number | string[]) => void;
}

const ApplicationSelector: React.FC<ApplicationSelectorProps> = ({
  applications,
  selectedApplications,
  onSelectApplication,
  parameters = [], // Provide default empty array
  parameterValues,
  onParameterChange
}) => {
  const colorApplications = (applications || []).filter(app => 
    ['color-proof', 'open-color', 'color-server-conv-multi', 'color-server-digital'].includes(app.id)
  );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-[#333]">Select Applications</h2>
      <p className="text-sm text-gray-600 mb-4">
        Choose one or more applications to get VM recommendations based on your specific requirements.
      </p>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-[#333]">Color Management Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {colorApplications.map((app) => {
            const appParameters = parameters.filter(param => param.applicationId === app.id);
            
            return (
              <div
                key={app.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedApplications.includes(app.id)
                    ? 'border-[#ee2d68] bg-[#F5F5F5]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div 
                  className="flex justify-between items-start"
                  onClick={() => onSelectApplication(app.id)}
                >
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

                {selectedApplications.includes(app.id) && appParameters.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-4">
                      {appParameters.map(param => {
                        const value = parameterValues[app.id]?.[param.id] ?? param.defaultValue;
                        
                        if (param.type === 'number') {
                          return (
                            <div key={param.id} className="flex flex-col">
                              <label className="block text-sm font-medium text-[#333] mb-1">
                                {param.name}: {value}
                              </label>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500 mr-2">{param.min}</span>
                                <input
                                  type="range"
                                  min={param.min}
                                  max={param.max}
                                  value={value as number}
                                  onChange={(e) => onParameterChange(app.id, param.id, parseInt(e.target.value))}
                                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ee2d68]"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-xs text-gray-500 ml-2">{param.max}</span>
                              </div>
                            </div>
                          );
                        } else if (param.type === 'multipleChoice') {
                          return (
                            <div key={param.id} className="flex flex-col">
                              <label className="block text-sm font-medium text-[#333] mb-2">
                                {param.name}
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {(param.options || []).map(option => (
                                  <button
                                    key={option}
                                    type="button"
                                    className={`px-3 py-1 text-sm rounded-full ${
                                      (value as string[]).includes(option)
                                        ? 'bg-[#ee2d68] text-white'
                                        : 'bg-[#F5F5F5] text-[#333] hover:bg-gray-200'
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const currentValue = value as string[];
                                      const newValue = currentValue.includes(option)
                                        ? currentValue.filter(v => v !== option)
                                        : [...currentValue, option];
                                      onParameterChange(app.id, param.id, newValue);
                                    }}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationSelector;

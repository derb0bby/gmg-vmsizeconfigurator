import React from 'react';
import { Application, ApplicationParameter, VMSize } from '../types';
import { Cpu, MemoryStick, HardDrive, RotateCcw } from 'lucide-react';
import { vmSizes } from '../data/vmSizes';
import { calculateRequirements, findOptimalVM } from '../utils/vmCalculator';

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

  const getRecommendedVM = (appId: string): VMSize | null => {
    // Calculate requirements for this single application
    const baseRequirements = calculateRequirements(applications, [appId]);
    
    // Find optimal VM for this application
    return findOptimalVM(
      vmSizes,
      baseRequirements.cpu,
      baseRequirements.ram,
      baseRequirements.storage,
      baseRequirements.requiresUsb,
      [appId],
      parameterValues
    );
  };

  const resetApplicationParameters = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const appParameters = parameters.filter(param => param.applicationId === appId);
    
    appParameters.forEach(param => {
      onParameterChange(appId, param.id, param.defaultValue);
    });
  };

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-600">
        The following recommendations are based on our internal testing and hands-on experience with typical industry workloads. Please use this configurator to estimate the hardware requirements for your specific setup. We recognize that every production environment is unique. If your experience differs from our recommendations or if you have further suggestions, we welcome your feedback!
      </p>
			<br></br>
			<p className="text-sm text-gray-600 mb-4">
				Important: To ensure reliable performance, we advise installing only one GMG application per system or virtual machine. In cases with very low workloads (few files or profiles), it may be possible to run more than one application. If you are unsure, please contact us for guidance.
      </p>
      
      <div className="mb-8">
        {/* <h2 className="text-[1.125rem] font-medium mb-4 text-[#333]">Color Management Applications</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {colorApplications.map((app) => {
            const appParameters = parameters.filter(param => param.applicationId === app.id);
            const recommendedVM = getRecommendedVM(app.id);
            
            return (
              <div
                key={app.id}
                className="border border-gray-400 rounded-md p-4 relative flex flex-col"
                onClick={() => onSelectApplication(app.id)}
              >
                {appParameters.length > 0 && (
                  <button
                    onClick={(e) => resetApplicationParameters(app.id, e)}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Reset parameters"
                  >
                    <RotateCcw className="h-4 w-4 text-gray-600" />
                  </button>
                )}
                
                <div className="flex justify-between items-start">
                  <div className="pr-8">
                    <div className="mb-2">
                      <h3 className="font-medium text-[#333] text-[1.125rem]">
                        {app.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                  </div>
                </div>

                {/* <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                    <Cpu className="h-3 w-3 mr-1 text-[#ee2d68]" /> {app.cpuRequirement} cores
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                    <MemoryStick className="h-3 w-3 mr-1 text-[#ee2d68]" /> {app.ramRequirement} GB
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                    <HardDrive className="h-3 w-3 mr-1 text-[#ee2d68]" /> {app.storageRequirement} GB
                  </span>
                </div> */}

                {appParameters.length > 0 && (
                  <div className="mt-4 mb-4 pt-2 flex-grow">
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
                                />
                                <span className="text-xs text-gray-500 ml-2">{param.max}</span>
                              </div>
                            </div>
                          );
                        } else if (param.type === 'multipleChoice') {
                          return (
                            <div key={param.id} className="flex flex-col">
                              {/* Add descriptive text specifically for OpenColor connector selection */}
                              {app.id === 'open-color' && param.id === 'connectors' && (
                                <p className="font-medium text-sm text-gray-600 mb-6">
                                  Select all applications that will be connected to OpenColor:
                                </p>
                              )}
                              
                              {/* Display parameter name with buttons inline */}
                              <div className="flex items-center flex-wrap gap-2">
                                <span className="text-sm font-medium text-[#333] mr-2">
                                  {param.name}:
                                </span>
                                {(param.options || []).map(option => (
                                  <button
                                    key={option}
                                    type="button"
                                    className={`px-3 py-1 text-sm rounded-full ${
                                      (value as string[]).includes(option)
                                        ? 'bg-[#ee2d68] text-white'
                                        : 'bg-[#F5F5F5] text-[#333] hover:bg-gray-200'
                                    }`}
                                    onClick={() => {
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

                {recommendedVM && (
                  <div className="mt-auto pt-4">
                    <div className="bg-gray-50 rounded-md p-3 border border-[#ee2d68]">
                      <h4 className="text-sm font-medium text-[#333] mb-2 flex items-center">
                        Recommended hardware configuration
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ee2d68] text-white">
                          {recommendedVM.name}
                        </span>
                      </h4>
                      {/* <p className="text-xs text-gray-600 mb-2">{recommendedVM.description}</p> */}
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                          <Cpu className="h-3 w-3 mr-1 text-[#ee2d68]" /> {recommendedVM.cpu} cores (Intel)
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                          <MemoryStick className="h-3 w-3 mr-1 text-[#ee2d68]" /> {recommendedVM.ram} GB
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
                          <HardDrive className="h-3 w-3 mr-1 text-[#ee2d68]" /> {recommendedVM.storage} GB
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mb-10 mt-10">
        <h2 className="text-[1.125rem] font-medium text-[#333] mb-2">Additional Information:</h2>
        <ul className="text-base text-gray-700 space-y-2">
          <li>
            <a
              href="https://customercare.gmgcolor.com/hc/en-us/articles/13490223476379-Which-ports-and-URLs-are-used-by-GMG-OpenColor#:~:text=Firewall%20configuration%3A%20List%20of%20required%20ports%20and%20host%20names"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ee2d68] underline"
            >
              Ports and host names for alls products (requires login to helpcenter)
            </a>
          </li>
          <li>
            <a
              href="https://customercare.gmgcolor.com/hc/en-us/articles/40238234986267-Supported-measuring-devices-across-GMG-products"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ee2d68] underline"
            >
              Supported measuring devices for all products
            </a>
          </li>
          <li>
            <a
              href="https://customercare.gmgcolor.com/hc/en-us/articles/35026827200923-Supported-proof-printers-proof-media-and-print-modes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ee2d68] underline"
            >
              Supported proof printers and proof media for GMG ColorProof
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApplicationSelector;

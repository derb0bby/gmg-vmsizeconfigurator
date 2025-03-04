import React from 'react';
import { ApplicationParameter } from '../types';

interface ApplicationParametersProps {
  selectedApplications: string[];
  parameters: ApplicationParameter[];
  parameterValues: {
    [applicationId: string]: {
      [parameterId: string]: number | string[];
    };
  };
  onParameterChange: (applicationId: string, parameterId: string, value: number | string[]) => void;
}

const ApplicationParameters: React.FC<ApplicationParametersProps> = ({
  selectedApplications,
  parameters,
  parameterValues,
  onParameterChange
}) => {
  if (selectedApplications.length === 0) {
    return null;
  }

  // Get parameters for the selected applications
  const relevantParameters = parameters.filter(param =>
    selectedApplications.includes(param.applicationId)
  );

  if (relevantParameters.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-[#333]">Application Parameters</h2>
      <p className="text-sm text-gray-600 mb-4">
        Adjust the parameters below to customize your VM recommendation.
      </p>

      <div className="space-y-6">
        {selectedApplications.map(appId => {
          const appParameters = parameters.filter(param => param.applicationId === appId);
          
          if (appParameters.length === 0) {
            return null;
          }

          return (
            <div key={appId} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-[#333] mb-3">
                {appParameters[0].applicationId.charAt(0).toUpperCase() + appParameters[0].applicationId.slice(1).replace(/-/g, ' ')} Parameters
              </h3>
              
              <div className="space-y-4">
                {appParameters.map(param => {
                  const value = parameterValues[appId]?.[param.id] ?? param.defaultValue;
                  
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
                            onChange={(e) => onParameterChange(appId, param.id, parseInt(e.target.value))}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ee2d68]"
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
                          {param.options.map(option => (
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
                                onParameterChange(appId, param.id, newValue);
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
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationParameters;

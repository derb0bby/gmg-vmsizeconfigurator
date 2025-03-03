import React from 'react';
import { Application } from '../types';
import { Check, Info } from 'lucide-react';

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
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Select Applications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedApplications.includes(app.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectApplication(app.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{app.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{app.description}</p>
              </div>
              {selectedApplications.includes(app.id) && (
                <Check className="text-blue-500 h-5 w-5" />
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                CPU: {app.cpuRequirement} cores
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                RAM: {app.ramRequirement} GB
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Storage: {app.storageRequirement} GB
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationSelector;

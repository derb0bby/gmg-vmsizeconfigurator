import React, { useState } from 'react';
import Header from './components/Header';
import ApplicationSelector from './components/ApplicationSelector';
import { applications } from './data/applications';
import { applicationParameters } from './data/applicationParameters';
import { ApplicationParameterValues } from './types';
import { RotateCcw } from 'lucide-react';

function App() {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [parameterValues, setParameterValues] = useState<ApplicationParameterValues>({});

  const handleApplicationSelect = (id: string) => {
    setSelectedApplications(prev => {
      if (prev.includes(id)) {
        return prev.filter(appId => appId !== id);
      }
      return [...prev, id];
    });
  };

  const handleParameterChange = (applicationId: string, parameterId: string, value: number | string[]) => {
    setParameterValues(prev => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        [parameterId]: value
      }
    }));
  };

  const handleReset = () => {
    setSelectedApplications([]);
    setParameterValues({});
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#333]">GMG System Requirement Configurator</h2>
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#ee2d68] bg-white border border-[#ee2d68] rounded-md hover:bg-[#ee2d68] hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>

        <ApplicationSelector
          applications={applications}
          selectedApplications={selectedApplications}
          onSelectApplication={handleApplicationSelect}
          parameters={applicationParameters}
          parameterValues={parameterValues}
          onParameterChange={handleParameterChange}
        />
      </main>
    </div>
  );
}

export default App;

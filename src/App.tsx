import React, { useState, useEffect } from 'react';
import { applications } from './data/applications';
import { vmSizes } from './data/vmSizes';
import { applicationParameters } from './data/applicationParameters';
import { ApplicationParameterValues } from './types';
import Header from './components/Header';
import ApplicationSelector from './components/ApplicationSelector';
import ApplicationParameters from './components/ApplicationParameters';
import VMRecommendation from './components/VMRecommendation';
import { calculateRequirements, findOptimalVM, findAlternativeVMs } from './utils/vmCalculator';
import { Server, RefreshCw } from 'lucide-react';

function App() {
  // Filter to only include color applications
  const colorApplications = applications.filter(app => 
    ['color-proof', 'open-color', 'color-server-conv-multi', 'color-server-digital'].includes(app.id)
  );
  
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [parameterValues, setParameterValues] = useState<ApplicationParameterValues>({});
  
  const [requiredCpu, setRequiredCpu] = useState(1);
  const [requiredRam, setRequiredRam] = useState(2);
  const [requiredStorage, setRequiredStorage] = useState(20);
  const [requiresUsb, setRequiresUsb] = useState(false);
  
  const [recommendedVM, setRecommendedVM] = useState<typeof vmSizes[0] | null>(null);
  const [alternativeVMs, setAlternativeVMs] = useState<typeof vmSizes>([]);
  
  const handleSelectApplication = (id: string) => {
    // If the same application is clicked, deselect it
    if (selectedApplication === id) {
      setSelectedApplication('');
      return;
    }
    
    // Otherwise, select the new application
    setSelectedApplication(id);
    
    // Initialize parameter values for the newly selected application
    const appParams = applicationParameters.filter(param => param.applicationId === id);
    
    if (appParams.length > 0) {
      const newParamValues = { ...parameterValues };
      
      if (!newParamValues[id]) {
        newParamValues[id] = {};
      }
      
      appParams.forEach(param => {
        if (newParamValues[id][param.id] === undefined) {
          newParamValues[id][param.id] = param.defaultValue;
        }
      });
      
      setParameterValues(newParamValues);
    }
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
    setSelectedApplication('');
    setParameterValues({});
  };
  
  useEffect(() => {
    if (!selectedApplication) {
      // Reset requirements if no application is selected
      setRequiredCpu(1);
      setRequiredRam(2);
      setRequiredStorage(20);
      setRequiresUsb(false);
      setRecommendedVM(null);
      setAlternativeVMs([]);
      return;
    }
    
    // Get the selected application's minimal requirements
    const app = colorApplications.find(a => a.id === selectedApplication);
    
    if (app) {
      setRequiredCpu(app.cpuRequirement);
      setRequiredRam(app.ramRequirement);
      setRequiredStorage(app.storageRequirement);
      setRequiresUsb(app.hasUsbRequirement);
      
      // Find optimal VM based on application parameters
      const optimal = findOptimalVM(
        vmSizes, 
        app.cpuRequirement, 
        app.ramRequirement, 
        app.storageRequirement, 
        app.hasUsbRequirement, 
        [selectedApplication], 
        parameterValues
      );
      setRecommendedVM(optimal);
      
      // Find alternative VMs
      const alternatives = findAlternativeVMs(
        vmSizes, 
        optimal, 
        app.cpuRequirement, 
        app.ramRequirement, 
        app.storageRequirement, 
        app.hasUsbRequirement
      );
      setAlternativeVMs(alternatives);
    }
  }, [selectedApplication, parameterValues]);
  
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#333]">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Server className="h-6 w-6 text-[#ee2d68] mr-2" />
              <h2 className="text-2xl font-bold text-[#333]">Configure Your VM</h2>
            </div>
            
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#333] bg-white hover:bg-[#F5F5F5]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
          
          <ApplicationSelector
            applications={colorApplications}
            selectedApplications={selectedApplication ? [selectedApplication] : []}
            onSelectApplication={handleSelectApplication}
          />
          
          {selectedApplication && (
            <ApplicationParameters
              selectedApplications={[selectedApplication]}
              parameters={applicationParameters}
              parameterValues={parameterValues}
              onParameterChange={handleParameterChange}
            />
          )}
        </div>
        
        <VMRecommendation
          recommendedVM={recommendedVM}
          requiredCpu={requiredCpu}
          requiredRam={requiredRam}
          requiredStorage={requiredStorage}
          requiresUsb={requiresUsb}
          alternativeVMs={alternativeVMs}
          selectedApplication={selectedApplication ? colorApplications.find(a => a.id === selectedApplication) : null}
        />
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            VM Size Configurator © {new Date().getFullYear()} - Find the perfect VM for your workload
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

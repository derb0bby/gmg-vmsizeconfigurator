import React, { useState, useEffect } from 'react';
import { applications } from './data/applications';
import { vmSizes } from './data/vmSizes';
import { applicationParameters } from './data/applicationParameters';
import { ApplicationParameterValues, Application } from './types';
import Header from './components/Header';
import ApplicationSelector from './components/ApplicationSelector';
import ApplicationParameters from './components/ApplicationParameters';
import VMRecommendation from './components/VMRecommendation';
import { calculateRequirements, findOptimalVM, findAlternativeVMs } from './utils/vmCalculator';
import { Server, RefreshCw, Plus, X } from 'lucide-react';

function App() {
  // Filter to only include color applications
  const colorApplications = applications.filter(app => 
    ['color-proof', 'open-color', 'color-server-conv-multi', 'color-server-digital'].includes(app.id)
  );
  
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [parameterValues, setParameterValues] = useState<ApplicationParameterValues>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  // Requirements and recommendations for each application
  const [appRequirements, setAppRequirements] = useState<{
    [appId: string]: {
      cpu: number;
      ram: number;
      storage: number;
      usb: boolean;
      recommendedVM: typeof vmSizes[0] | null;
      alternativeVMs: typeof vmSizes;
    }
  }>({});
  
  const handleSelectApplication = (id: string) => {
    // If the application is already selected, do nothing
    if (selectedApplications.includes(id)) {
      return;
    }
    
    // Add the application to selected applications
    const newSelectedApps = [...selectedApplications, id];
    setSelectedApplications(newSelectedApps);
    
    // Set as active tab if it's the first one or if no active tab
    if (newSelectedApps.length === 1 || !activeTab) {
      setActiveTab(id);
    }
    
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
  
  const handleRemoveApplication = (id: string) => {
    // Remove the application from selected applications
    const newSelectedApps = selectedApplications.filter(appId => appId !== id);
    setSelectedApplications(newSelectedApps);
    
    // If the active tab is being removed, set a new active tab
    if (activeTab === id) {
      setActiveTab(newSelectedApps.length > 0 ? newSelectedApps[0] : null);
    }
    
    // Remove the application's requirements
    const newAppRequirements = { ...appRequirements };
    delete newAppRequirements[id];
    setAppRequirements(newAppRequirements);
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
    setActiveTab(null);
    setAppRequirements({});
  };
  
  useEffect(() => {
    // Update requirements and recommendations for each selected application
    const newAppRequirements = { ...appRequirements };
    
    selectedApplications.forEach(appId => {
      const app = colorApplications.find(a => a.id === appId);
      
      if (app) {
        // Find optimal VM based on application parameters
        const optimal = findOptimalVM(
          vmSizes, 
          app.cpuRequirement, 
          app.ramRequirement, 
          app.storageRequirement, 
          app.hasUsbRequirement, 
          [appId], 
          parameterValues
        );
        
        // Find alternative VMs
        const alternatives = findAlternativeVMs(
          vmSizes, 
          optimal, 
          app.cpuRequirement, 
          app.ramRequirement, 
          app.storageRequirement, 
          app.hasUsbRequirement
        );
        
        newAppRequirements[appId] = {
          cpu: app.cpuRequirement,
          ram: app.ramRequirement,
          storage: app.storageRequirement,
          usb: app.hasUsbRequirement,
          recommendedVM: optimal,
          alternativeVMs: alternatives
        };
      }
    });
    
    setAppRequirements(newAppRequirements);
  }, [selectedApplications, parameterValues]);
  
  // Get the active application object
  const activeApplication = activeTab 
    ? colorApplications.find(app => app.id === activeTab) || null 
    : null;
  
  // Get the active application's requirements
  const activeRequirements = activeTab && appRequirements[activeTab] 
    ? appRequirements[activeTab] 
    : null;
  
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
            selectedApplications={selectedApplications}
            onSelectApplication={handleSelectApplication}
          />
        </div>
        
        {selectedApplications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            {/* Tabs */}
            <div className="flex border-b">
              {selectedApplications.map(appId => {
                const app = colorApplications.find(a => a.id === appId);
                return (
                  <div 
                    key={appId}
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                      activeTab === appId 
                        ? 'bg-white border-t border-l border-r border-b-0 border-gray-200 rounded-t-md' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setActiveTab(appId)}
                  >
                    <span className="mr-2">{app?.name || 'Application'}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveApplication(appId);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
              
              {/* Add new tab button */}
              <button 
                className="flex items-center justify-center w-10 h-10 bg-[#ee2d68] text-white"
                onClick={() => {
                  // Find first unselected application
                  const unselectedApp = colorApplications.find(app => !selectedApplications.includes(app.id));
                  if (unselectedApp) {
                    handleSelectApplication(unselectedApp.id);
                  }
                }}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            
            {/* Tab content */}
            <div className="p-6">
              {activeTab && (
                <>
                  {/* Application Parameters moved inside the tab content */}
                  <ApplicationParameters
                    selectedApplications={[activeTab]}
                    parameters={applicationParameters}
                    parameterValues={parameterValues}
                    onParameterChange={handleParameterChange}
                  />
                  
                  {activeRequirements && activeApplication && (
                    <div className="mt-8">
                      <VMRecommendation
                        recommendedVM={activeRequirements.recommendedVM}
                        requiredCpu={activeRequirements.cpu}
                        requiredRam={activeRequirements.ram}
                        requiredStorage={activeRequirements.storage}
                        requiresUsb={activeRequirements.usb}
                        alternativeVMs={activeRequirements.alternativeVMs}
                        selectedApplication={activeApplication}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-xs">
            GMG GmbH & Co. KG - © Copyright {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

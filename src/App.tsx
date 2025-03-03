import React, { useState, useEffect } from 'react';
import { applications } from './data/applications';
import { vmSizes } from './data/vmSizes';
import Header from './components/Header';
import ApplicationSelector from './components/ApplicationSelector';
import CustomRequirements from './components/CustomRequirements';
import VMRecommendation from './components/VMRecommendation';
import { calculateRequirements, findOptimalVM, findAlternativeVMs } from './utils/vmCalculator';
import { Server, RefreshCw } from 'lucide-react';

function App() {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [customCpu, setCustomCpu] = useState(1);
  const [customRam, setCustomRam] = useState(2);
  const [customStorage, setCustomStorage] = useState(20);
  
  const [requiredCpu, setRequiredCpu] = useState(1);
  const [requiredRam, setRequiredRam] = useState(2);
  const [requiredStorage, setRequiredStorage] = useState(20);
  
  const [recommendedVM, setRecommendedVM] = useState<typeof vmSizes[0] | null>(null);
  const [alternativeVMs, setAlternativeVMs] = useState<typeof vmSizes>([]);
  
  const handleSelectApplication = (id: string) => {
    setSelectedApplications(prev => 
      prev.includes(id) 
        ? prev.filter(appId => appId !== id) 
        : [...prev, id]
    );
  };
  
  const handleReset = () => {
    setSelectedApplications([]);
    setCustomCpu(1);
    setCustomRam(2);
    setCustomStorage(20);
  };
  
  useEffect(() => {
    // Calculate total requirements
    const { cpu, ram, storage } = calculateRequirements(
      applications,
      selectedApplications,
      customCpu,
      customRam,
      customStorage
    );
    
    setRequiredCpu(cpu);
    setRequiredRam(ram);
    setRequiredStorage(storage);
    
    // Find optimal VM
    const optimal = findOptimalVM(vmSizes, cpu, ram, storage);
    setRecommendedVM(optimal);
    
    // Find alternative VMs
    const alternatives = findAlternativeVMs(vmSizes, optimal, cpu, ram, storage);
    setAlternativeVMs(alternatives);
  }, [selectedApplications, customCpu, customRam, customStorage]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Server className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Configure Your VM</h2>
            </div>
            
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
          
          <ApplicationSelector
            applications={applications}
            selectedApplications={selectedApplications}
            onSelectApplication={handleSelectApplication}
          />
          
          <CustomRequirements
            cpu={customCpu}
            ram={customRam}
            storage={customStorage}
            onCpuChange={setCustomCpu}
            onRamChange={setCustomRam}
            onStorageChange={setCustomStorage}
          />
        </div>
        
        <VMRecommendation
          recommendedVM={recommendedVM}
          requiredCpu={requiredCpu}
          requiredRam={requiredRam}
          requiredStorage={requiredStorage}
          alternativeVMs={alternativeVMs}
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

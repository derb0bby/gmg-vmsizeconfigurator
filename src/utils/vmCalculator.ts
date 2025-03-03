import { Application, VMSize, ApplicationParameterValues } from '../types';

export const calculateRequirements = (
  applications: Application[],
  selectedApplicationIds: string[]
): { cpu: number; ram: number; storage: number; requiresUsb: boolean } => {
  // Start with minimum requirements
  let totalCpu = 1;
  let totalRam = 2;
  let totalStorage = 20;
  let requiresUsb = false;

  // Add requirements from selected applications
  selectedApplicationIds.forEach(id => {
    const app = applications.find(a => a.id === id);
    if (app) {
      totalCpu = Math.max(totalCpu, app.cpuRequirement);
      totalRam = Math.max(totalRam, app.ramRequirement);
      totalStorage += app.storageRequirement;
      
      // Check if any selected application requires USB
      if (app.hasUsbRequirement) {
        requiresUsb = true;
      }
    }
  });

  return {
    cpu: totalCpu,
    ram: totalRam,
    storage: totalStorage,
    requiresUsb
  };
};

export const determineVMSizeBasedOnParameters = (
  applicationId: string,
  parameterValues: ApplicationParameterValues
): 'small' | 'medium' | 'large' => {
  const appParams = parameterValues[applicationId] || {};
  
  switch (applicationId) {
    case 'color-proof': {
      const printerCount = appParams['printer-count'] as number || 1;
      const dailyProofs = appParams['daily-proofs'] as number || 50;
      
      if (printerCount >= 3 || dailyProofs >= 30) {
        return 'large';
      } else if (printerCount >= 2 || dailyProofs <= 30) {
        return 'medium';
      } else {
        return 'small';
      }
    }
    
    case 'open-color': {
      const connectors = appParams['connectors'] as string[] || ['ColorProof'];
      const connectorCount = connectors.length;
      
      if (connectorCount > 3) {
        return 'large';
      } else if (connectorCount <= 3 && connectorCount > 1) {
        return 'medium';
      } else {
        return 'small';
      }
    }
    
    case 'color-server-conv-multi':
    case 'color-server-digital': {
      const filesPerDay = applicationId === 'color-server-conv-multi' 
        ? appParams['files-per-day-conv-multi'] as number || 100
        : appParams['files-per-day-digital'] as number || 100;
      
      if (filesPerDay > 50) {
        return 'large';
      } else if (filesPerDay <= 50 && filesPerDay > 20) {
        return 'medium';
      } else {
        return 'small';
      }
    }
    
    default:
      return 'small';
  }
};

export const findOptimalVM = (
  vmSizes: VMSize[],
  requiredCpu: number,
  requiredRam: number,
  requiredStorage: number,
  requiresUsb: boolean,
  selectedApplicationIds: string[],
  parameterValues: ApplicationParameterValues
): VMSize | null => {
  // Filter VMs that meet USB requirement if needed
  const eligibleVMs = requiresUsb 
    ? vmSizes.filter(vm => vm.hasUsbPort === true)
    : vmSizes;
  
  // If no applications are selected, find the smallest VM that meets requirements
  if (selectedApplicationIds.length === 0) {
    const sortedVMs = [...eligibleVMs].sort((a, b) => 
      (a.cpu - b.cpu) || (a.ram - b.ram) || (a.storage - b.storage)
    );
    
    return sortedVMs.find(
      vm => vm.cpu >= requiredCpu && vm.ram >= requiredRam && vm.storage >= requiredStorage
    ) || null;
  }
  
  // Determine the required VM size based on application parameters
  let requiredSize: 'small' | 'medium' | 'large' = 'small';
  
  selectedApplicationIds.forEach(appId => {
    const appSize = determineVMSizeBasedOnParameters(appId, parameterValues);
    
    // Always use the largest required size
    if (appSize === 'large' || (appSize === 'medium' && requiredSize === 'small')) {
      requiredSize = appSize;
    }
  });
  
  // Find the VM that matches the required size
  return eligibleVMs.find(vm => vm.id === requiredSize) || null;
};

export const findAlternativeVMs = (
  vmSizes: VMSize[],
  recommendedVM: VMSize | null,
  requiredCpu: number,
  requiredRam: number,
  requiredStorage: number,
  requiresUsb: boolean
): VMSize[] => {
  if (!recommendedVM) return [];
  
  // Filter VMs that meet USB requirement if needed
  const eligibleVMs = requiresUsb 
    ? vmSizes.filter(vm => vm.hasUsbPort === true)
    : vmSizes;
  
  // Find VMs that meet requirements but are different from the recommended one
  return eligibleVMs
    .filter(
      vm => 
        vm.id !== recommendedVM.id && 
        vm.cpu >= requiredCpu && 
        vm.ram >= requiredRam && 
        vm.storage >= requiredStorage
    )
    .sort((a, b) => a.price - b.price)
    .slice(0, 2); // Limit to 2 alternatives
};

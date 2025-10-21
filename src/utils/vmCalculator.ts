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

export const calculateDotProofRAM = (
  applicationId: string,
  parameterValues: ApplicationParameterValues
): number => {
  if (applicationId !== 'color-proof') {
    return 0;
  }

  const appParams = parameterValues[applicationId] || {};
  const printerCount = appParams['printer-count'] as number || 1;
  const dotproofOptions = appParams['dotproof'] as string[] || [];
  
  // If DotProof is selected, add 4 GB RAM per printer count
  if (dotproofOptions.includes('DotProof')) {
    return printerCount * 4;
  }
  
  return 0;
};

export const determineVMSizeBasedOnParameters = (
  applicationId: string,
  parameterValues: ApplicationParameterValues
): 'small' | 'medium' | 'large' => {
  const appParams = parameterValues[applicationId] || {};
  
  switch (applicationId) {
    case 'color-proof': {
      const printerCount = appParams['printer-count'] as number || 1;
      const dailyProofs = appParams['daily-proofs'] as number || 10;
      
      // Adjusted thresholds to ensure default values result in 'small'
      if (printerCount >= 3 || dailyProofs > 30) {
        return 'large';
      } else if (printerCount >= 2 || dailyProofs > 20) {
        return 'medium';
      } else {
        return 'small';
      }
    }
    
    case 'open-color': {
      const connectors = appParams['connectors'] as string[] || ['ColorProof'];
      const connectorCount = connectors.length;
      
      // Ab 3 ausgewählten Connectoren empfehlen wir immer VM Size Large
      if (connectorCount >= 3) {
        return 'large';
      } else if (connectorCount > 1) {
        return 'medium';
      } else {
        return 'small';
      }
    }
    
    case 'color-server-conv-multi':
    case 'color-server-digital': {
      const filesPerDay = applicationId === 'color-server-conv-multi' 
        ? appParams['files-per-day-conv-multi'] as number || 10
        : appParams['files-per-day-digital'] as number || 10;
      
      if (filesPerDay > 50) {
        return 'large';
      } else if (filesPerDay > 20) {
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
  
  // Calculate additional RAM needed for DotProof
  let additionalRAM = 0;
  selectedApplicationIds.forEach(appId => {
    additionalRAM += calculateDotProofRAM(appId, parameterValues);
  });
  
  // Determine the required VM size based on application parameters
  let requiredSize: 'small' | 'medium' | 'large' = 'small';
  
  selectedApplicationIds.forEach(appId => {
    const appSize = determineVMSizeBasedOnParameters(appId, parameterValues);
    
    // Always use the largest required size
    if (appSize === 'large') {
      requiredSize = 'large';
    } else if (appSize === 'medium' && requiredSize === 'small') {
      requiredSize = 'medium';
    }
  });
  
  // Find the base VM that matches the required size
  let baseVM = eligibleVMs.find(vm => vm.id === requiredSize);
  
  if (!baseVM) {
    return null;
  }
  
  // If additional RAM is needed, check if we need to upgrade to a larger VM
  if (additionalRAM > 0) {
    const totalRAMNeeded = baseVM.ram + additionalRAM;
    
    // Find the smallest VM that can accommodate the total RAM requirement
    const vmsBySize = eligibleVMs.sort((a, b) => a.ram - b.ram);
    const upgradedVM = vmsBySize.find(vm => vm.ram >= totalRAMNeeded);
    
    if (upgradedVM) {
      // Create a modified VM object with the additional RAM displayed
      return {
        ...upgradedVM,
        ram: totalRAMNeeded
      };
    }
  }
  
  return baseVM;
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

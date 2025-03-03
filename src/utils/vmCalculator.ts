import { Application, VMSize, UserRequirements } from '../types';

export const calculateRequirements = (
  applications: Application[],
  selectedApplicationIds: string[],
  customCpu: number,
  customRam: number,
  customStorage: number
): { cpu: number; ram: number; storage: number } => {
  // Start with custom requirements as base
  let totalCpu = customCpu;
  let totalRam = customRam;
  let totalStorage = customStorage;

  // Add requirements from selected applications
  selectedApplicationIds.forEach(id => {
    const app = applications.find(a => a.id === id);
    if (app) {
      totalCpu = Math.max(totalCpu, app.cpuRequirement);
      totalRam = Math.max(totalRam, app.ramRequirement);
      totalStorage += app.storageRequirement;
    }
  });

  return {
    cpu: totalCpu,
    ram: totalRam,
    storage: totalStorage
  };
};

export const findOptimalVM = (
  vmSizes: VMSize[],
  requiredCpu: number,
  requiredRam: number,
  requiredStorage: number
): VMSize | null => {
  // Sort VMs by price (ascending)
  const sortedVMs = [...vmSizes].sort((a, b) => a.price - b.price);
  
  // Find the first VM that meets all requirements
  return sortedVMs.find(
    vm => vm.cpu >= requiredCpu && vm.ram >= requiredRam && vm.storage >= requiredStorage
  ) || null;
};

export const findAlternativeVMs = (
  vmSizes: VMSize[],
  recommendedVM: VMSize | null,
  requiredCpu: number,
  requiredRam: number,
  requiredStorage: number
): VMSize[] => {
  if (!recommendedVM) return [];
  
  // Find VMs that meet requirements but are different from the recommended one
  return vmSizes
    .filter(
      vm => 
        vm.id !== recommendedVM.id && 
        vm.cpu >= requiredCpu && 
        vm.ram >= requiredRam && 
        vm.storage >= requiredStorage
    )
    .sort((a, b) => a.price - b.price)
    .slice(0, 3); // Limit to 3 alternatives
};

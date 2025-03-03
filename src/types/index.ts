export interface Application {
  id: string;
  name: string;
  cpuRequirement: number;
  ramRequirement: number;
  storageRequirement: number;
  description: string;
}

export interface VMSize {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  storage: number;
  price: number;
  description: string;
}

export interface UserRequirements {
  cpu: number;
  ram: number;
  storage: number;
  selectedApplications: string[];
}

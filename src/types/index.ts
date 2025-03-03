export interface Application {
  id: string;
  name: string;
  cpuRequirement: number;
  ramRequirement: number;
  storageRequirement: number;
  description: string;
  hasUsbRequirement: boolean;
}

export interface VMSize {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  storage: number;
  price: number;
  description: string;
  hasUsbPort?: boolean;
}

export interface UserRequirements {
  cpu: number;
  ram: number;
  storage: number;
  selectedApplications: string[];
  requiresUsb: boolean;
}

export interface ApplicationParameter {
  id: string;
  applicationId: string;
  name: string;
  type: 'number' | 'multipleChoice';
  defaultValue: number | string[];
  options?: string[]; // For multiple choice parameters
  min?: number; // For number parameters
  max?: number; // For number parameters
}

export interface ApplicationParameterValues {
  [applicationId: string]: {
    [parameterId: string]: number | string[];
  };
}

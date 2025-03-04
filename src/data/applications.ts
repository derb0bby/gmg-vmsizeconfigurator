import { Application } from '../types';

export const applications: Application[] = [
  {
    id: 'color-proof',
    name: 'ColorProof',
    cpuRequirement: 4,
    ramRequirement: 8,
    storageRequirement: 512,
    description: 'Color proofing solution for accurate color representation',
    hasUsbRequirement: true
  },
  {
    id: 'open-color',
    name: 'OpenColor',
    cpuRequirement: 4,
    ramRequirement: 8,
    storageRequirement: 512,
    description: 'Color management and profiling solution',
    hasUsbRequirement: true
  },
  {
    id: 'color-server-conv-multi',
    name: 'ColorServer Conv / Multi',
    cpuRequirement: 8,
    ramRequirement: 16,
    storageRequirement: 512,
    description: 'Conversion and multi-channel color server for high-volume processing',
    hasUsbRequirement: true
  },
  {
    id: 'color-server-digital',
    name: 'ColorServer (Digital)',
    cpuRequirement: 8,
    ramRequirement: 16,
    storageRequirement: 512,
    description: 'Digital color server for digital printing workflows',
    hasUsbRequirement: true
  },
  {
    id: 'web-server',
    name: 'Web Server',
    cpuRequirement: 2,
    ramRequirement: 4,
    storageRequirement: 20,
    description: 'Basic web server for hosting websites and web applications',
    hasUsbRequirement: false
  },
  {
    id: 'database',
    name: 'Database Server',
    cpuRequirement: 4,
    ramRequirement: 8,
    storageRequirement: 100,
    description: 'Database server for storing and managing data',
    hasUsbRequirement: false
  },
  {
    id: 'ml-training',
    name: 'Machine Learning Training',
    cpuRequirement: 8,
    ramRequirement: 16,
    storageRequirement: 200,
    description: 'Environment for training machine learning models',
    hasUsbRequirement: false
  },
  {
    id: 'video-processing',
    name: 'Video Processing',
    cpuRequirement: 8,
    ramRequirement: 16,
    storageRequirement: 500,
    description: 'Server for video encoding, transcoding, and processing',
    hasUsbRequirement: false
  }
];

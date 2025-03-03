import { Application } from '../types';

export const applications: Application[] = [
  {
    id: 'web-server',
    name: 'Web Server',
    cpuRequirement: 2,
    ramRequirement: 4,
    storageRequirement: 20,
    description: 'Basic web server for hosting websites and web applications'
  },
  {
    id: 'database',
    name: 'Database Server',
    cpuRequirement: 4,
    ramRequirement: 8,
    storageRequirement: 100,
    description: 'Database server for storing and managing data'
  },
  {
    id: 'ml-training',
    name: 'Machine Learning Training',
    cpuRequirement: 8,
    ramRequirement: 16,
    storageRequirement: 200,
    description: 'Environment for training machine learning models'
  },
  {
    id: 'video-processing',
    name: 'Video Processing',
    cpuRequirement: 8,
    ramRequirement: 16,
    storageRequirement: 500,
    description: 'Server for video encoding, transcoding, and processing'
  },
  {
    id: 'game-server',
    name: 'Game Server',
    cpuRequirement: 4,
    ramRequirement: 8,
    storageRequirement: 100,
    description: 'Server for hosting multiplayer games'
  },
  {
    id: 'dev-environment',
    name: 'Development Environment',
    cpuRequirement: 4,
    ramRequirement: 8,
    storageRequirement: 50,
    description: 'Environment for software development and testing'
  },
  {
    id: 'analytics',
    name: 'Analytics Platform',
    cpuRequirement: 8,
    ramRequirement: 16,
    storageRequirement: 200,
    description: 'Platform for data analytics and business intelligence'
  },
  {
    id: 'cms',
    name: 'Content Management System',
    cpuRequirement: 2,
    ramRequirement: 4,
    storageRequirement: 50,
    description: 'System for managing digital content'
  }
];

import { VMSize } from '../types';

export const vmSizes: VMSize[] = [
  {
    id: 'micro',
    name: 'Micro',
    cpu: 1,
    ram: 1,
    storage: 10,
    price: 5,
    description: 'Entry-level VM for basic tasks and development'
  },
  {
    id: 'small',
    name: 'Small',
    cpu: 2,
    ram: 4,
    storage: 50,
    price: 20,
    description: 'Small VM suitable for low-traffic websites and small applications'
  },
  {
    id: 'medium',
    name: 'Medium',
    cpu: 4,
    ram: 8,
    storage: 100,
    price: 40,
    description: 'Balanced VM for most business applications'
  },
  {
    id: 'large',
    name: 'Large',
    cpu: 8,
    ram: 16,
    storage: 250,
    price: 80,
    description: 'High-performance VM for demanding workloads'
  },
  {
    id: 'xlarge',
    name: 'X-Large',
    cpu: 16,
    ram: 32,
    storage: 500,
    price: 160,
    description: 'Enterprise-grade VM for high-traffic applications and databases'
  },
  {
    id: '2xlarge',
    name: '2X-Large',
    cpu: 32,
    ram: 64,
    storage: 1000,
    price: 320,
    description: 'Maximum performance VM for mission-critical applications'
  }
];

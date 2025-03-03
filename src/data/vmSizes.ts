import { VMSize } from '../types';

export const vmSizes: VMSize[] = [
  {
    id: 'small',
    name: 'Small',
    cpu: 4,
    ram: 8,
    storage: 512,
    price: 100,
    description: 'Core i7 / 4 CPUs, 8 GB RAM, 512 GB SSD',
    hasUsbPort: true
  },
  {
    id: 'medium',
    name: 'Medium',
    cpu: 8,
    ram: 16,
    storage: 512,
    price: 200,
    description: 'Core i7 / 8 CPUs, 16 GB RAM, 512 GB SSD',
    hasUsbPort: true
  },
  {
    id: 'large',
    name: 'Large',
    cpu: 8,
    ram: 32,
    storage: 1024,
    price: 300,
    description: 'Core i9 / 8 CPUs, 32 GB RAM, 1024 GB SSD',
    hasUsbPort: true
  }
];

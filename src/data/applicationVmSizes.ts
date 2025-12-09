import { ApplicationVMSizeMapping } from '../types';

// Per-application overrides for VM sizes (cpu/ram/storage per size)
// Basis sind die Werte aus `vmSizes`, hier können sie je Applikation angepasst werden.

export const applicationVmSizes: ApplicationVMSizeMapping = {
  'color-proof': {
    small: {
      cpu: 4,
      ram: 8,
      storage: 512,
    },
    medium: {
      cpu: 8,
      ram: 16,
      storage: 512,
    },
    large: {
      cpu: 8,
      ram: 32,
      storage: 1024,
    },
  },
  'open-color': {
    small: {
      cpu: 4,
      ram: 8,
      storage: 512,
    },
    medium: {
      cpu: 8,
      ram: 16,
      storage: 512,
    },
    large: {
      cpu: 8,
      ram: 32,
      storage: 1024,
    },
  },
  'color-server-conv-multi': {
    small: {
      cpu: 8,
      ram: 16,
      storage: 512,
    },
    medium: {
      cpu: 8,
      ram: 16,
      storage: 512,
    },
    large: {
      cpu: 12,
      ram: 32,
      storage: 1024,
    },
  },
};

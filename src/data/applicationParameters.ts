import { ApplicationParameter } from '../types';

export const applicationParameters: ApplicationParameter[] = [
  // ColorProof parameters
  {
    id: 'printer-count',
    applicationId: 'color-proof',
    name: 'Printer Count',
    type: 'number',
    defaultValue: 1,
    min: 1,
    max: 10
  },
  {
    id: 'daily-proofs',
    applicationId: 'color-proof',
    name: 'Daily Proofs',
    type: 'number',
    defaultValue: 5,
    min: 1,
    max: 100
  },
  
  // OpenColor parameters
  {
    id: 'connectors',
    applicationId: 'open-color',
    name: 'Connectors',
    type: 'multipleChoice',
    defaultValue: ['ColorProof'],
    options: ['ColorProof', 'PackZ', 'ArtPro+', 'Illustrator Plugin']
  },
  
  // ColorServer Conv / Multi parameters
  {
    id: 'files-per-day-conv-multi',
    applicationId: 'color-server-conv-multi',
    name: 'Files per Day',
    type: 'number',
    defaultValue: 10,
    min: 1,
    max: 100
  },
  
  // ColorServer (Digital) parameters
  {
    id: 'files-per-day-digital',
    applicationId: 'color-server-digital',
    name: 'Files per Day',
    type: 'number',
    defaultValue: 10,
    min: 1,
    max: 100
  }
];

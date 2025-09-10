import React from 'react';
import { VMSize, Application, ApplicationParameterValues } from '../types';
import { Cpu, MemoryStick, HardDrive, Usb, AlertCircle, HelpCircle } from 'lucide-react';
import { applications } from '../data/applications';
import { vmSizes } from '../data/vmSizes';
import { calculateRequirements, findOptimalVM, findAlternativeVMs } from '../utils/vmCalculator';

interface VMRecommendationProps {
  selectedApplications: string[];
  parameterValues: ApplicationParameterValues;
  customRequirements: {
    cpu: number;
    ram: number;
    storage: number;
  };
}

const VMRecommendation: React.FC<VMRecommendationProps> = ({
  selectedApplications,
  parameterValues,
  customRequirements
}) => {
  // Get selected application objects
  const selectedApps = applications.filter(app => selectedApplications.includes(app.id));

  // Calculate base requirements from applications
  const baseRequirements = calculateRequirements(applications, selectedApplications);

  // Combine with custom requirements
  const finalRequirements = {
    cpu: Math.max(baseRequirements.cpu, customRequirements.cpu),
    ram: Math.max(baseRequirements.ram, customRequirements.ram),
    storage: Math.max(baseRequirements.storage, customRequirements.storage),
    requiresUsb: baseRequirements.requiresUsb
  };

  // Find recommended VM
  const recommendedVM = findOptimalVM(
    vmSizes,
    finalRequirements.cpu,
    finalRequirements.ram,
    finalRequirements.storage,
    finalRequirements.requiresUsb,
    selectedApplications,
    parameterValues
  );

  // Find alternative VMs
  const alternativeVMs = findAlternativeVMs(
    vmSizes,
    recommendedVM,
    finalRequirements.cpu,
    finalRequirements.ram,
    finalRequirements.storage,
    finalRequirements.requiresUsb
  );

  if (selectedApplications.length === 0) {
    return (
      <div className="mt-8">
        <p className="text-gray-600">
          Select an application to get a hardware configuration recommendation.
        </p>
      </div>
    );
  }

  // Application-specific FAQs
  const getFAQs = (application: Application) => {
    // Default FAQs for all applications
    const defaultFAQs = [
      {
        title: "How are hardware configuration recommendations calculated?",
        content: "Our hardware configuration recommendations are calculated based on the minimum hardware requirements for your selected application, adjusted according to the parameters you've specified. We analyze factors such as concurrent users, expected workload, and specific application features to determine the optimal configuration that balances performance and cost-efficiency."
      }
    ];

    // Application-specific FAQs
    switch (application.id) {
      case 'color-proof':
        return [
          ...defaultFAQs,
          {
            title: "Does ColorProof require special hardware?",
            content: "ColorProof requires a USB port for connecting to color measurement devices. The VM must have USB passthrough capability enabled. For optimal color accuracy, we recommend using a VM with dedicated GPU resources when working with high-resolution images or when color accuracy is critical for your workflow."
          }
        ];
      
      case 'open-color':
        return [
          ...defaultFAQs,
          {
            title: "Can OpenColor be used in a cloud environment?",
            content: "Yes, OpenColor can be deployed in a cloud environment, but requires USB passthrough for color measurement devices. Ensure your cloud provider supports this feature. For best results, we recommend using a VM with at least 8GB RAM and 4 CPU cores when working with large color libraries or processing multiple color profiles simultaneously."
          }
        ];
      
      default:
        return defaultFAQs;
    }
  };

  const renderVMCard = (vm: VMSize, isRecommended: boolean = false) => (
    <div className={`border rounded-lg p-4 ${isRecommended ? 'border-[#ee2d68] bg-[#F5F5F5]' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-[#333] flex items-center">
            {vm.name}
            {isRecommended && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ee2d68] text-white">
                Recommended
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{vm.description}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
          <Cpu className="h-3 w-3 mr-1 text-[#ee2d68]" /> {vm.cpu} cores
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
          <MemoryStick className="h-3 w-3 mr-1 text-[#ee2d68]" /> {vm.ram} GB
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
          <HardDrive className="h-3 w-3 mr-1 text-[#ee2d68]" /> {vm.storage} GB
        </span>
        {vm.hasUsbPort && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F5F5F5] text-[#333]">
            <Usb className="h-3 w-3 mr-1 text-[#ee2d68]" /> USB Port
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {recommendedVM && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-[#333]">Recommended hardware configuration</h3>
          {renderVMCard(recommendedVM, true)}
        </div>
      )}
      
      {alternativeVMs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-[#333]">Alternative Options</h3>
          <div className="space-y-4">
            {alternativeVMs.map((vm, index) => renderVMCard(vm))}
          </div>
        </div>
      )}
      
      {selectedApps.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <HelpCircle className="h-5 w-5 text-[#ee2d68] mr-2" />
            <h3 className="text-lg font-medium text-[#333]">Frequently Asked Questions</h3>
          </div>
          
          <div className="space-y-6">
            {selectedApps.map(app => 
              getFAQs(app).map((faq, index) => (
                <div key={`${app.id}-${index}`} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h4 className="font-medium text-[#333] mb-2">{faq.title}</h4>
                  <p className="text-sm text-gray-600">{faq.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VMRecommendation;

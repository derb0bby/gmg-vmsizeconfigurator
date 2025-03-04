import React from 'react';
import { VMSize, Application } from '../types';
import { Cpu, MemoryStick, HardDrive, Usb, Server, AlertCircle, HelpCircle } from 'lucide-react';

interface VMRecommendationProps {
  recommendedVM: VMSize | null;
  requiredCpu: number;
  requiredRam: number;
  requiredStorage: number;
  requiresUsb: boolean;
  alternativeVMs: VMSize[];
  selectedApplication: Application | null;
}

const VMRecommendation: React.FC<VMRecommendationProps> = ({
  recommendedVM,
  requiredCpu,
  requiredRam,
  requiredStorage,
  requiresUsb,
  alternativeVMs,
  selectedApplication
}) => {
  if (!recommendedVM || !selectedApplication) {
    return (
      <div>
        <p className="text-gray-600">
          Select an application to get a VM recommendation.
        </p>
      </div>
    );
  }

  // Application-specific FAQs
  const getFAQs = (application: Application) => {
    // Default FAQs for all applications
    const defaultFAQs = [
      {
        title: "How are VM recommendations calculated?",
        content: "Our VM recommendations are calculated based on the minimum hardware requirements for your selected application, adjusted according to the parameters you've specified. We analyze factors such as concurrent users, expected workload, and specific application features to determine the optimal VM configuration that balances performance and cost-efficiency."
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
          },
          {
            title: "How many concurrent users can ColorProof support?",
            content: "ColorProof is designed primarily as a single-user application. While multiple users can access the application through remote desktop sessions, we recommend limiting concurrent users to avoid performance degradation. For multi-user environments, consider deploying separate VMs for each user or implementing a session management solution."
          }
        ];
      
      case 'open-color':
        return [
          ...defaultFAQs,
          {
            title: "Can OpenColor be used in a cloud environment?",
            content: "Yes, OpenColor can be deployed in a cloud environment, but requires USB passthrough for color measurement devices. Ensure your cloud provider supports this feature. For best results, we recommend using a VM with at least 8GB RAM and 4 CPU cores when working with large color libraries or processing multiple color profiles simultaneously."
          },
          {
            title: "How should I configure storage for OpenColor?",
            content: "OpenColor benefits from fast storage access, especially when working with large color libraries. We recommend using SSD storage for the application and its data. The base requirement of 512GB provides enough space for the application and typical color libraries, but consider additional storage if you work with extensive color archives or maintain historical color data."
          }
        ];
      
      case 'color-server-conv-multi':
      case 'color-server-digital':
        return [
          ...defaultFAQs,
          {
            title: "How does ColorServer scale with workload?",
            content: "ColorServer is designed to scale with increasing workloads. The base recommendation of 8 CPU cores and 16GB RAM is suitable for processing up to 1000 color conversions per hour. For higher volumes, we recommend scaling vertically by adding more CPU cores and RAM. For very high volumes (10,000+ conversions per hour), consider implementing a load-balanced cluster of multiple ColorServer instances."
          },
          {
            title: "What network configuration is optimal for ColorServer?",
            content: "ColorServer performs best with low-latency network connections, especially when processing files from network storage or when integrated with workflow automation systems. We recommend at least 1Gbps network connectivity, with 10Gbps preferred for high-volume environments. For cloud deployments, ensure the VM is in the same region as your storage and other integrated services."
          },
          {
            title: "Can ColorServer run in a containerized environment?",
            content: "While ColorServer can technically run in containers like Docker, we recommend VM deployment for production use. This ensures consistent performance and simplifies USB device passthrough for dongle authentication. If containerization is required for your workflow, ensure proper resource allocation and persistent storage configuration."
          }
        ];
      
      default:
        return [
          ...defaultFAQs,
          {
            title: "Can I run multiple applications on the same VM?",
            content: "Yes, you can run multiple applications on the same VM, but you'll need to ensure the VM has sufficient resources to handle the combined requirements. For production environments, we recommend selecting a VM with specifications that exceed the sum of individual application requirements by at least 20% to account for overhead and ensure smooth operation during peak usage."
          },
          {
            title: "What if my workload changes over time?",
            content: "As your workload grows, you may need to scale your VM accordingly. Most cloud providers allow you to resize your VM with minimal downtime. We recommend monitoring your resource utilization regularly and upgrading your VM when CPU or memory consistently exceeds 70% utilization during normal operations. For seasonal workloads, consider using auto-scaling solutions that can adjust resources based on demand."
          }
        ];
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

  // Get application-specific FAQs
  const faqs = getFAQs(selectedApplication);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-[#333]">Minimal Requirements for {selectedApplication.name}</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
            <Cpu className="h-4 w-4 mr-1 text-[#ee2d68]" /> {requiredCpu} cores
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
            <MemoryStick className="h-4 w-4 mr-1 text-[#ee2d68]" /> {requiredRam} GB RAM
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
            <HardDrive className="h-4 w-4 mr-1 text-[#ee2d68]" /> {requiredStorage} GB Storage
          </span>
          {requiresUsb && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F5F5F5] text-[#333]">
              <Usb className="h-4 w-4 mr-1 text-[#ee2d68]" /> USB Port Required
            </span>
          )}
        </div>
        
        {/* Added explanatory text about caveats */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Important considerations:</strong> These requirements represent the minimum specifications needed for basic functionality. For optimal performance with larger workloads, consider selecting a VM with higher specifications than the minimum. Performance may vary based on concurrent operations, file sizes, and specific workflows.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-[#333]">Recommended VM</h3>
        {renderVMCard(recommendedVM, true)}
      </div>
      
      {/* Application-specific FAQs */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <HelpCircle className="h-5 w-5 text-[#ee2d68] mr-2" />
          <h3 className="text-lg font-medium text-[#333]">Frequently Asked Questions</h3>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className={index < faqs.length - 1 ? "border-b border-gray-200 pb-4" : "pb-4"}>
              <h4 className="font-medium text-[#333] mb-2">{faq.title}</h4>
              <p className="text-sm text-gray-600">{faq.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VMRecommendation;

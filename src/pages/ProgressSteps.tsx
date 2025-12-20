import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Shopping Cart' },
    { id: 2, name: 'Payment And Delivery' },
    { id: 3, name: 'Order Received' }
  ];

  return (
    <div className="flex items-center justify-between mb-8 max-w-md">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === step.id 
                ? 'bg-orange-500 text-white' 
                : currentStep > step.id 
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step.id ? (
                <Check className="w-4 h-4" />
              ) : (
                step.id
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-12 h-px bg-gray-300 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
import React from 'react';

const Stepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                currentStep === step
                  ? 'bg-blue-600 text-white'
                  : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
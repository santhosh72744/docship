import React from "react";
import "./StepNavigator.css";




export default function StepNavigator({ currentStep, onStepClick }) {
  const steps = [
    { id: 1, label: "Estimate" },
    { id: 2, label: "Shipment Details"},
    { id: 3, label: "Payment" },
    { id: 4, label: "Label"},
  ];

  return (
    <div className="step-nav">
      {steps.map((step, index) => (
        <div key={step.id} className="step-wrapper">
          <div
            className={`step-btn 
              ${currentStep === step.id ? "active" : ""}
              ${step.id < currentStep ? "clickable" : ""}
            `}
            onClick={() => {
              if (step.id < currentStep) onStepClick(step.id);
            }}
          >
            {step.icon}
            <span>{step.label}</span>
          </div>

          {index < steps.length - 1 && <span className="step-arrow">›</span>}
        </div>
      ))}
    </div>
  );
}

import React from 'react';

function ToggleSwitch({ value, onChange, options }) {
  return (
    <div className="relative bg-gray-100 rounded-lg p-1 flex">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            value === option.value
              ? `text-white shadow-sm ${
                  option.color === 'green' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default ToggleSwitch;
import React from 'react';

const FormInput = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  options = [], // For select/radio
  radioDirection = 'horizontal', // horizontal or vertical
  rows = 3, // For textarea
}) => {
  const baseInputClasses = `w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
    error
      ? 'border-red-500 focus:ring-red-200'
      : 'border-gray-300 focus:border-blue-500'
  } ${className}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseInputClasses} resize-none`}
            style={{ minHeight: `${rows * 25}px` }}
          />
        );

      case 'select':
        return (
          <div className="relative">
            <select
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              className={`${baseInputClasses} appearance-none cursor-pointer bg-white`}
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="py-2"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className={`flex gap-4 ${radioDirection === 'vertical' ? 'flex-col' : 'flex-wrap'}`}>
            {options.map((option) => (
              <label key={option.value} className="inline-flex items-center">
                <input
                  type="radio"
                  name={option.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={disabled || option.disabled}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;

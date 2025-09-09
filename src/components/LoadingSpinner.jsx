import React from 'react';

const LoadingSpinner = ({
  size = 'medium',
  color = 'white',
  text = 'Loading...',
  fullScreen = false,
  overlay = false
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinnerColor = color === 'white' ? '#ffffff' : color === 'red' ? '#e50914' : color;

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : ''}`}>
      <div
        className={`animate-spin rounded-full border-4 border-gray-300 border-t-transparent ${sizeClasses[size]}`}
        style={{
          borderColor: `${spinnerColor}33`,
          borderTopColor: spinnerColor
        }}
      />
      {text && (
        <p
          className="mt-4 text-center"
          style={{
            color: spinnerColor,
            fontSize: size === 'small' ? '0.875rem' : '1rem',
            fontWeight: '500'
          }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)'
        }}
      >
        {spinner}
      </div>
    );
  }

  if (fullScreen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#141414' }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
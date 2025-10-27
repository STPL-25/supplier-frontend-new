import React from 'react';

const ContentLoader = ({ variant = "skeleton" }) => {
  const variants = {
    skeleton: (
      <div className="p-6 max-w-full mx-auto">
        {/* Header Section */}
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3" />
          <div className="h-4 bg-gray-200 rounded-md w-3/4" />
        </div>

        {/* Content Section - Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    wave: (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-8 bg-blue-500 rounded-full"
              style={{
                animation: 'wave 1s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        <style >{`
          @keyframes wave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(2); }
          }
        `}</style>
      </div>
    ),

    shimmer: (
      <div className="p-6 max-w-full mx-auto">
        <div className="relative overflow-hidden">
          {/* Content placeholder */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded-md w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg" />
              ))}
            </div>
            <div className="h-48 bg-gray-200 rounded-lg" />
          </div>
          {/* Shimmer effect */}
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 1.5s infinite',
              transform: 'translateX(-100%)'
            }}
          />
        </div>
        <style jsx>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    ),

    blocks: (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 bg-blue-500 rounded"
              style={{
                animation: 'pulse 0.8s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
                opacity: 0.3
              }}
            />
          ))}
        </div>
        <style jsx>{`
          @keyframes pulse {
            50% { transform: scale(1.2); opacity: 1; }
          }
        `}</style>
      </div>
    )
  };

  return variants[variant] || variants.skeleton;
};

export default ContentLoader;
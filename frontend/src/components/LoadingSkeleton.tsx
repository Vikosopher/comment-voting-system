import { memo } from 'react';

function LoadingSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading comments">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="bg-white rounded-lg shadow p-4 animate-pulse"
          aria-hidden="true"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(LoadingSkeleton);

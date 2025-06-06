import { memo } from 'react';

type SortOption = 'newest' | 'top';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

function SortControls({ sortBy, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center space-x-4 mb-6" role="group" aria-label="Sort comments">
      <span className="text-gray-600">Sort by:</span>
      <div className="flex space-x-2">
        <button
          onClick={() => onSortChange('newest')}
          aria-pressed={sortBy === 'newest'}
          className={`px-4 py-2 rounded-md transition-colors ${
            sortBy === 'newest'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Newest
        </button>
        <button
          onClick={() => onSortChange('top')}
          aria-pressed={sortBy === 'top'}
          className={`px-4 py-2 rounded-md transition-colors ${
            sortBy === 'top'
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Top Voted
        </button>
      </div>
    </div>
  );
}

export default memo(SortControls);

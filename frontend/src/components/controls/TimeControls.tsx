'use client';

import { useAppStore } from '@/store/useAppStore';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const YEARS = Array.from({ length: 30 }, (_, i) => 1993 + i);

export default function TimeControls() {
  const { 
    selectedYear, 
    selectedMonth, 
    setSelectedYear, 
    setSelectedMonth 
  } = useAppStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Year
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          {YEARS.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Month
        </label>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, index) => (
            <button
              key={month}
              onClick={() => setSelectedMonth(index + 1)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                selectedMonth === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

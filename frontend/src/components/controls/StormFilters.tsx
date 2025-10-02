'use client';

import { useAppStore } from '@/store/useAppStore';

const BASINS = [
  { value: 'NA', label: 'North Atlantic' },
  { value: 'EP', label: 'East Pacific' },
  { value: 'WP', label: 'West Pacific' },
  { value: 'NI', label: 'North Indian' },
  { value: 'SI', label: 'South Indian' },
  { value: 'SP', label: 'South Pacific' },
];

const CATEGORIES = [
  { value: 'TS', label: 'Tropical Storm' },
  { value: '1', label: 'Category 1' },
  { value: '2', label: 'Category 2' },
  { value: '3', label: 'Category 3' },
  { value: '4', label: 'Category 4' },
  { value: '5', label: 'Category 5' },
];

export default function StormFilters() {
  const { 
    stormFilters, 
    setStormFilter, 
    clearStormFilters 
  } = useAppStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Storm Filters
        </h3>
        <button
          onClick={clearStormFilters}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Storm Name
        </label>
        <input
          type="text"
          value={stormFilters.name}
          onChange={(e) => setStormFilter('name', e.target.value)}
          placeholder="Search by name..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Year
        </label>
        <input
          type="number"
          value={stormFilters.year || ''}
          onChange={(e) => setStormFilter('year', e.target.value ? Number(e.target.value) : null)}
          placeholder="Filter by year..."
          min="1851"
          max="2023"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Basin
        </label>
        <select
          value={stormFilters.basin || ''}
          onChange={(e) => setStormFilter('basin', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Basins</option>
          {BASINS.map(basin => (
            <option key={basin.value} value={basin.value}>
              {basin.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <select
          value={stormFilters.category || ''}
          onChange={(e) => setStormFilter('category', e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

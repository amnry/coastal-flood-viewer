'use client';

import { getProbabilityColor } from '@/lib/forecastUtils';

export default function ForecastLegend() {
  const probabilityLevels = [
    { probability: 90, label: '90-100%' },
    { probability: 70, label: '70-89%' },
    { probability: 50, label: '50-69%' },
    { probability: 30, label: '30-49%' },
    { probability: 10, label: '10-29%' },
    { probability: 5, label: '5-9%' },
  ];

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Wind Probability Forecast
      </h4>
      <div className="space-y-2">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Five-day chance of receiving sustained 34+ knot (39+ mph) winds
        </div>
        {probabilityLevels.map((level) => (
          <div key={level.probability} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-sm border border-gray-300 dark:border-gray-600"
              style={{ 
                backgroundColor: getProbabilityColor(level.probability),
                opacity: 0.7 
              }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {level.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

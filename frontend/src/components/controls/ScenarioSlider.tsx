'use client';

import { useAppStore } from '@/store/useAppStore';

export default function ScenarioSlider() {
  const { scenarioMeters, setScenarioMeters } = useAppStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Sea Level Rise: {scenarioMeters.toFixed(1)}m
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={scenarioMeters}
          onChange={(e) => setScenarioMeters(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0m</span>
          <span>1m</span>
          <span>2m</span>
          <span>3m</span>
          <span>4m</span>
          <span>5m</span>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>This represents additional sea level rise beyond current levels.</p>
        <p className="mt-1">
          <strong>Current scenario:</strong> {scenarioMeters === 0 ? 'Present day' : `+${scenarioMeters}m SLR`}
        </p>
      </div>
    </div>
  );
}

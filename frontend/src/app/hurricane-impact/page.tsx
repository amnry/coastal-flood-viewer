'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import StormFilters from '@/components/controls/StormFilters';
import ForecastLegend from '@/components/controls/ForecastLegend';
import AnalyticsPanel from '@/components/panels/AnalyticsPanel';
import { useAppStore } from '@/store/useAppStore';
import '@/styles/storm-visualization.css';

// Dynamically import map components to avoid SSR issues
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">Loading map...</div>
});

const EnhancedStormVisualization = dynamic(() => import('@/components/map/layers/EnhancedStormVisualization'), {
  ssr: false
});

export default function HurricaneImpactPage() {
  const { sidebarOpen, setSidebarOpen, activeLayers, toggleLayer, selectedStorm } = useAppStore();
  const [selectedTab, setSelectedTab] = useState<'filters' | 'analytics' | 'storm'>('filters');

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Hurricane Impact Simulator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  onClick={() => setSelectedTab('filters')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    selectedTab === 'filters'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Filters
                </button>
                <button
                  onClick={() => setSelectedTab('analytics')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    selectedTab === 'analytics'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Analytics
                </button>
                {selectedStorm && (
                  <button
                    onClick={() => setSelectedTab('storm')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      selectedTab === 'storm'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Storm
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedTab === 'filters' ? (
                <div className="p-6 space-y-6">
                  {/* Layer Controls */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Layers
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.storms}
                          onChange={() => toggleLayer('storms')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Hurricane Tracks
                        </span>
                      </label>
                    </div>
                  </div>

                  <StormFilters />

                  {/* Forecast Legend */}
                  <ForecastLegend />

                  {/* Storm Categories Legend */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Storm Categories
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-4 h-1 bg-green-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Tropical Storm</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-1 bg-yellow-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Category 1</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-1 bg-orange-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Category 2</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-1 bg-red-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Category 3</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-1 bg-pink-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Category 4</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-1 bg-purple-500 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Category 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedTab === 'analytics' ? (
                <AnalyticsPanel />
              ) : selectedTab === 'storm' && selectedStorm ? (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {selectedStorm.name} ({selectedStorm.year})
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Max Category</div>
                            <div className="text-xl font-semibold text-gray-900 dark:text-white">
                              {selectedStorm.maxCategory}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Max Wind Speed</div>
                            <div className="text-xl font-semibold text-gray-900 dark:text-white">
                              {selectedStorm.maxWindSpeed} mph
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Track Length</div>
                            <div className="text-xl font-semibold text-gray-900 dark:text-white">
                              {selectedStorm.trackLength.toFixed(1)} km
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Landfall</div>
                            <div className="text-xl font-semibold text-gray-900 dark:text-white">
                              {selectedStorm.landfall ? 'Yes' : 'No'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <InteractiveMap center={[25.0, -80.0]} zoom={6}>
            <EnhancedStormVisualization />
          </InteractiveMap>
        </div>
      </div>
    </div>
  );
}

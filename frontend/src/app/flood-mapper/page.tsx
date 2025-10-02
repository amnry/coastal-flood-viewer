'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ScenarioSlider from '@/components/controls/ScenarioSlider';
import AnalyticsPanel from '@/components/panels/AnalyticsPanel';
import { useAppStore } from '@/store/useAppStore';

// Dynamically import map components to avoid SSR issues
const InteractiveMap = dynamic(() => import('@/components/map/InteractiveMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">Loading map...</div>
});

const TileLayerFlood = dynamic(() => import('@/components/map/layers/TileLayerFlood'), {
  ssr: false
});

export default function FloodMapperPage() {
  const { sidebarOpen, setSidebarOpen, activeLayers, toggleLayer } = useAppStore();
  const [selectedTab, setSelectedTab] = useState<'controls' | 'analytics'>('controls');

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Coastal Elevation & Flood Mapper
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
                  onClick={() => setSelectedTab('controls')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    selectedTab === 'controls'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Controls
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
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {selectedTab === 'controls' ? (
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
                          checked={activeLayers.dem}
                          onChange={() => toggleLayer('dem')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Digital Elevation Model
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeLayers.flood}
                          onChange={() => toggleLayer('flood')}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Flood Depth
                        </span>
                      </label>
                    </div>
                  </div>

                  <ScenarioSlider />

                  {/* Legend */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Legend
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Elevation (m)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-200 dark:bg-red-800 rounded mr-2"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Flood Depth (m)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <AnalyticsPanel />
              )}
            </div>
          </div>
        )}

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <InteractiveMap center={[40.7128, -74.0060]} zoom={8}>
            <TileLayerFlood />
          </InteractiveMap>
        </div>
      </div>
    </div>
  );
}

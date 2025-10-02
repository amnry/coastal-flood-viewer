import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Coastal Flood Viewer
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Explore sea level rise, coastal elevation, and hurricane impacts with interactive visualizations
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/explorer"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Sea Level Explorer
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Interactive visualization of sea level anomalies over time with satellite data
                </p>
              </div>
            </Link>

            <Link
              href="/flood-mapper"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Flood Mapper
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Coastal elevation and flood depth visualization with scenario modeling
                </p>
              </div>
            </Link>

            <Link
              href="/hurricane-impact"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Hurricane Impact
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Storm track visualization with impact zones and historical data
                </p>
              </div>
            </Link>

            <Link
              href="/catalog"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Data Catalog
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Browse available datasets and metadata for coastal flood analysis
                </p>
              </div>
            </Link>

            <Link
              href="/about"
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  About
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Learn about our methods, data sources, and scientific approach
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Start
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get started by exploring sea level data or mapping coastal flood risks
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/explorer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Explore Sea Level Data
              </Link>
              <Link
                href="/flood-mapper"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Map Flood Risks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
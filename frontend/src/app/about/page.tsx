export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            About Coastal Flood Viewer
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Coastal Flood Viewer is a production-grade web application designed to help researchers, 
              policymakers, and the public understand coastal flood risks through interactive visualizations 
              of sea level rise, coastal elevation, and hurricane impacts.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Built with modern web technologies and following SOLID principles, the application provides 
              accessible, SEO-friendly tools for exploring complex coastal data in an intuitive interface.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Data Sources
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Satellite altimetry data (Jason-1, Jason-2, Jason-3)</li>
                <li>• Coastal DEM from Google Earth Engine</li>
                <li>• IBTrACS hurricane track data</li>
                <li>• NOAA sea level rise projections</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Technology Stack
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• Next.js 14 with App Router</li>
                <li>• TypeScript & Tailwind CSS</li>
                <li>• Leaflet for interactive maps</li>
                <li>• ECharts for data visualization</li>
                <li>• Zustand for state management</li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Methods
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                <strong>Sea Level Anomaly Processing:</strong> Monthly satellite altimetry data is processed 
                using xarray and pandas to extract sea level anomalies at specific locations. The data is 
                then tiled for efficient web visualization.
              </p>
              <p>
                <strong>Coastal Elevation Modeling:</strong> Digital elevation models are sourced from 
                Google Earth Engine assets and processed into Cloud Optimized GeoTIFFs (COGs) for 
                high-performance web mapping.
              </p>
              <p>
                <strong>Hurricane Track Analysis:</strong> Historical hurricane data from IBTrACS is 
                processed and simplified for web visualization, including storm categorization and 
                impact zone calculations.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Citations
            </h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-medium">Sea Level Data:</p>
                <p>Legeais, J. F., et al. (2018). An improved and homogeneous altimeter sea level record from the ESA Climate Change Initiative. Earth System Science Data, 10(1), 281-301.</p>
              </div>
              <div>
                <p className="font-medium">Hurricane Data:</p>
                <p>Knapp, K. R., et al. (2010). The International Best Track Archive for Climate Stewardship (IBTrACS). Bulletin of the American Meteorological Society, 91(3), 363-376.</p>
              </div>
              <div>
                <p className="font-medium">Coastal DEM:</p>
                <p>Kulp, S. A., & Strauss, B. H. (2019). New elevation data triple estimates of global vulnerability to sea-level rise and coastal flooding. Nature Communications, 10(1), 1-12.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact & Support
            </h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>For questions about the data or methodology, please contact the project maintainer.</p>
              <p>For technical issues or feature requests, please open an issue on the project repository.</p>
              <p className="mt-4">
                <strong>License:</strong> MIT License - see LICENSE file for details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Catalog, Dataset } from '@/types/catalog';
import { dataClient } from '@/lib/dataClient';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const data = await dataClient.getCatalog();
        setCatalog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load catalog');
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">Error</div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Data Catalog
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Browse available datasets and metadata for coastal flood analysis
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {catalog?.datasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DatasetCard({ dataset }: { dataset: Dataset }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {dataset.title}
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          {dataset.license}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {dataset.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Source:</span>
          <span className="text-gray-900 dark:text-white">{dataset.source}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Coverage:</span>
          <span className="text-gray-900 dark:text-white">
            {dataset.coverage.start} to {dataset.coverage.end}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Updated:</span>
          <span className="text-gray-900 dark:text-white">{dataset.updated}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {dataset.links.preview && (
          <a
            href={dataset.links.preview}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Preview
          </a>
        )}
        {dataset.links.docs && (
          <a
            href={dataset.links.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Documentation
          </a>
        )}
        {dataset.links.doi && (
          <a
            href={`https://doi.org/${dataset.links.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            DOI
          </a>
        )}
      </div>
    </div>
  );
}

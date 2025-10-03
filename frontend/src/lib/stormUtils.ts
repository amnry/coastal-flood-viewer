import { StormCollection } from '@/types/storm';

export function extractUniqueStormNames(stormData: StormCollection): string[] {
  const names = stormData.features.map(storm => storm.properties.name);
  return Array.from(new Set(names)).sort();
}

export function extractUniqueYears(stormData: StormCollection): number[] {
  const years = stormData.features.map(storm => storm.properties.year);
  return Array.from(new Set(years)).sort((a, b) => b - a); // Sort descending (newest first)
}

export function filterStormNames(stormNames: string[], searchTerm: string): string[] {
  if (!searchTerm) return stormNames;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return stormNames.filter(name => 
    name.toLowerCase().includes(lowerSearchTerm)
  );
}

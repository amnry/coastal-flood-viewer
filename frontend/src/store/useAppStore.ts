import { create } from 'zustand';
import { MapClickData, TimeSeries } from '@/types/analytics';
import { StormSummary } from '@/types/storm';

interface AppState {
  // Time controls
  selectedYear: number;
  selectedMonth: number;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  
  // Scenario controls
  scenarioMeters: number;
  setScenarioMeters: (meters: number) => void;
  
  // Active layers
  activeLayers: {
    sla: boolean;
    dem: boolean;
    flood: boolean;
    storms: boolean;
  };
  toggleLayer: (layer: keyof AppState['activeLayers']) => void;
  
  // Storm filters
  stormFilters: {
    year: number | null;
    name: string;
    category: string | null;
    basin: string | null;
  };
  setStormFilter: (filter: keyof AppState['stormFilters'], value: string | number | null) => void;
  clearStormFilters: () => void;
  
  // Storm metadata
  availableStormNames: string[];
  availableYears: number[];
  setAvailableStormNames: (names: string[]) => void;
  setAvailableYears: (years: number[]) => void;
  
  // Map interaction
  clickedPoint: MapClickData | null;
  setClickedPoint: (point: MapClickData | null) => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Selected storm
  selectedStorm: StormSummary | null;
  setSelectedStorm: (storm: StormSummary | null) => void;
  
  // Mock data method
  getMockTimeSeries: (lat: number, lon: number) => Promise<TimeSeries>;
}

export const useAppStore = create<AppState>((set) => ({
  // Time controls
  selectedYear: 2020,
  selectedMonth: 6, // June
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  
  // Scenario controls
  scenarioMeters: 0,
  setScenarioMeters: (meters) => set({ scenarioMeters: meters }),
  
  // Active layers
  activeLayers: {
    sla: true,
    dem: false,
    flood: false,
    storms: false,
  },
  toggleLayer: (layer) => set((state) => ({
    activeLayers: {
      ...state.activeLayers,
      [layer]: !state.activeLayers[layer],
    },
  })),
  
  // Storm filters
  stormFilters: {
    year: null,
    name: '',
    category: null,
    basin: null,
  },
  setStormFilter: (filter, value) => set((state) => ({
    stormFilters: {
      ...state.stormFilters,
      [filter]: value,
    },
  })),
  clearStormFilters: () => set({
    stormFilters: {
      year: null,
      name: '',
      category: null,
      basin: null,
    },
  }),
  
  // Storm metadata
  availableStormNames: [],
  availableYears: [],
  setAvailableStormNames: (names) => set({ availableStormNames: names }),
  setAvailableYears: (years) => set({ availableYears: years }),
  
  // Map interaction
  clickedPoint: null,
  setClickedPoint: (point) => set({ clickedPoint: point }),
  
  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Selected storm
  selectedStorm: null,
  setSelectedStorm: (storm) => set({ selectedStorm: storm }),
  
  // Mock data method
  getMockTimeSeries: async (lat: number, lon: number) => {
    const { dataClient } = await import('@/lib/dataClient');
    return dataClient.getMockTimeSeries(lat, lon);
  },
}));

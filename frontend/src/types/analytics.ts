import { z } from 'zod';

export const TimeSeriesPointSchema = z.object({
  date: z.string(),
  value: z.number(),
});

export const TimeSeriesSchema = z.object({
  data: z.array(TimeSeriesPointSchema),
  unit: z.string(),
  variable: z.string(),
  location: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
});

export const AnalyticsStatsSchema = z.object({
  mean: z.number(),
  median: z.number(),
  min: z.number(),
  max: z.number(),
  trend: z.number(), // mm/year
  recentChange: z.number(), // change in last 5 years
});

export type TimeSeriesPoint = z.infer<typeof TimeSeriesPointSchema>;
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;
export type AnalyticsStats = z.infer<typeof AnalyticsStatsSchema>;

// Map click data
export interface MapClickData {
  lat: number;
  lon: number;
  elevation?: number;
  seaLevel?: number;
  timeSeries?: TimeSeries;
  stats?: AnalyticsStats;
}

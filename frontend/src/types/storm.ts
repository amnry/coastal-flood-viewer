import { z } from 'zod';

export const StormFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: z.object({
    type: z.literal('LineString'),
    coordinates: z.array(z.array(z.number())),
  }),
  properties: z.object({
    name: z.string(),
    year: z.number(),
    basin: z.string(),
    sids: z.array(z.string()),
    nature: z.array(z.string()),
    wind_speed: z.array(z.number()),
    pressure: z.array(z.number()),
    category: z.array(z.string()),
    landfall: z.boolean(),
    track_length: z.number(),
  }),
});

export const StormCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(StormFeatureSchema),
});

export type StormFeature = z.infer<typeof StormFeatureSchema>;
export type StormCollection = z.infer<typeof StormCollectionSchema>;

// Simplified storm data for UI
export interface StormSummary {
  id: string;
  name: string;
  year: number;
  basin: string;
  maxCategory: string;
  maxWindSpeed: number;
  trackLength: number;
  landfall: boolean;
}

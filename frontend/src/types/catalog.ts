import { z } from 'zod';

export const DatasetSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  source: z.string(),
  coverage: z.object({
    start: z.string(),
    end: z.string(),
  }),
  license: z.string(),
  updated: z.string(),
  links: z.object({
    preview: z.string().optional(),
    tiles: z.string().optional(),
    docs: z.string().optional(),
    doi: z.string().optional(),
  }),
});

export const CatalogSchema = z.object({
  datasets: z.array(DatasetSchema),
});

export type Dataset = z.infer<typeof DatasetSchema>;
export type Catalog = z.infer<typeof CatalogSchema>;

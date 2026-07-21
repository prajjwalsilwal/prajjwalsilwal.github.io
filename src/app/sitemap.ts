import type { MetadataRoute } from 'next';
import { caseStudies } from '@/content/work';
import { profile } from '@/content/profile';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${profile.siteUrl}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${profile.siteUrl}/work/${c.slug}/`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}

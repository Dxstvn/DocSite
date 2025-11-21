import { MetadataRoute } from 'next'

// Helper function to generate both English and Spanish URLs
function createBilingualEntry(
  path: string,
  baseUrl: string,
  lastModified: Date,
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
  priority: number
): MetadataRoute.Sitemap {
  return [
    // English version (no prefix)
    {
      url: path === '/' ? baseUrl : `${baseUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    },
    // Spanish version (/es prefix)
    {
      url: `${baseUrl}/es${path}`,
      lastModified,
      changeFrequency,
      priority,
    },
  ]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://doc-site-sepia.vercel.app'
  const lastModified = new Date()

  return [
    // Primary Pages (Priority: 1.0)
    ...createBilingualEntry('/', baseUrl, lastModified, 'monthly', 1.0),
    ...createBilingualEntry('/about', baseUrl, lastModified, 'monthly', 1.0),
    ...createBilingualEntry('/contact', baseUrl, lastModified, 'monthly', 1.0),

    // Service Hub Pages (Priority: 0.9)
    ...createBilingualEntry('/education', baseUrl, lastModified, 'monthly', 0.9),
    ...createBilingualEntry('/screening', baseUrl, lastModified, 'monthly', 0.9),
    ...createBilingualEntry('/nutrition', baseUrl, lastModified, 'monthly', 0.9),
    ...createBilingualEntry('/mindfulness', baseUrl, lastModified, 'monthly', 0.9),

    // Education Pages (Priority: 0.8)
    ...createBilingualEntry('/education/depression', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/education/anxiety', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/education/adhd', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/education/bipolar', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/education/ptsd', baseUrl, lastModified, 'monthly', 0.8),

    // Screening Tool Pages (Priority: 0.8)
    ...createBilingualEntry('/screening/phq-9', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/screening/gad-7', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/screening/asrs', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/screening/mdq', baseUrl, lastModified, 'monthly', 0.8),
    ...createBilingualEntry('/screening/pcl-5', baseUrl, lastModified, 'monthly', 0.8),

    // Nutrition Pages (Priority: 0.7)
    ...createBilingualEntry('/nutrition/depression', baseUrl, lastModified, 'monthly', 0.7),
    ...createBilingualEntry('/nutrition/anxiety', baseUrl, lastModified, 'monthly', 0.7),
    ...createBilingualEntry('/nutrition/focus', baseUrl, lastModified, 'monthly', 0.7),
    ...createBilingualEntry('/nutrition/supplements', baseUrl, lastModified, 'monthly', 0.7),

    // Legal Pages (Priority: 0.5)
    ...createBilingualEntry('/privacy', baseUrl, lastModified, 'yearly', 0.5),
    ...createBilingualEntry('/terms', baseUrl, lastModified, 'yearly', 0.5),
  ]
}

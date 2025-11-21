import React from 'react'

interface StructuredDataProps {
  data: Record<string, unknown>
}

/**
 * StructuredData component for rendering JSON-LD structured data
 *
 * This component renders Schema.org structured data for search engines.
 * It takes a data object and renders it as a script tag with type="application/ld+json".
 *
 * @example
 * <StructuredData data={{
 *   "@context": "https://schema.org",
 *   "@type": "Organization",
 *   name: "Bergen Mind & Wellness",
 *   ...
 * }} />
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

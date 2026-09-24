/** Arama motorları için yapısal veri (schema.org). `<` kaçışı XSS'e karşı Next.js belgelerindeki öneri. */
export function JsonLd({ veri }: { veri: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(veri).replace(/</g, '\\u003c') }}
    />
  )
}

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'DECORA Civil & Interiors'

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Dynamic SEO — sets title, description, Open Graph, Twitter cards,
 * canonical URL and optional JSON-LD schema per page.
 */
export default function Seo({
  title,
  description,
  image,
  type = 'website',
  schema = null,
}) {
  const location = useLocation()
  const url = `${window.location.origin}${location.pathname}`
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Building Excellence. Designing Experiences.`
  const desc =
    description ||
    'Premium civil construction, interior design, aluminum & glass solutions, renovations and modern building solutions.'
  const ogImage =
    image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'

  useEffect(() => {
    document.title = fullTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: desc })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: desc })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage })
    upsertLink('canonical', url)

    let script
    if (schema) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      script.setAttribute('data-page-schema', 'true')
      document.head.appendChild(script)
    }

    return () => {
      if (script?.parentNode) script.parentNode.removeChild(script)
    }
  }, [fullTitle, desc, ogImage, url, type, schema])

  return null
}

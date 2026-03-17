import { useEffect, useRef, useState } from 'react'

export default function SmartImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  onError,
}) {
  const [loaded, setLoaded] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(priority)
  const ref = useRef(null)

  useEffect(() => {
    if (priority) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [priority])

  return (
    <div
      ref={ref}
      style={{ width, height }}
      className={`relative overflow-hidden ${className}`}
    >
      <img
        src={shouldLoad ? src : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'low'}
        sizes={sizes}
        style={{ width: '100%', height: 'auto', objectFit: 'inherit', display: 'block' }}
        className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={onError}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}
    </div>
  )
}

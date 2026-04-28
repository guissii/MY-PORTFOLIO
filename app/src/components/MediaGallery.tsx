import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ── Helpers ── */

export type MediaItem = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
};

type MediaType = 'image' | 'pdf' | 'pptx' | 'unknown';

/** Safely determine media type from pathname or URL. Handles missing/malformed values. */
function getMediaType(pathname: string | undefined | null): MediaType {
  if (!pathname || typeof pathname !== 'string') return 'unknown';
  const lower = pathname.toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp|avif|svg|bmp|ico)$/i.test(lower)) return 'image';
  if (/\.pdf$/i.test(lower)) return 'pdf';
  if (/\.(ppt|pptx)$/i.test(lower)) return 'pptx';
  return 'unknown';
}

/** Build a Google Docs Viewer URL for office files. Falls back gracefully. */
function buildOfficeViewerUrl(publicUrl: string): string {
  if (!publicUrl) return '';
  try {
    return `https://docs.google.com/gview?url=${encodeURIComponent(publicUrl)}&embedded=true`;
  } catch {
    return '';
  }
}

/* ── Icons ── */

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ZoomInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ZoomOutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function FileIcon({ type }: { type: MediaType }) {
  if (type === 'pdf') {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <text x="8" y="18" fontSize="6" fill="#C8962A" stroke="none" fontWeight="bold">PDF</text>
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8962A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <text x="7" y="18" fontSize="5" fill="#C8962A" stroke="none" fontWeight="bold">PPT</text>
    </svg>
  );
}

/* ── Lightbox (Fullscreen image viewer with zoom & slide) ── */

function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: MediaItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const backdropRef = useRef<HTMLDivElement>(null);

  // Only keep image items for the lightbox slider
  const imageItems = useMemo(() => items.filter(i => getMediaType(i.pathname) === 'image'), [items]);
  
  // Map the startIndex to the filtered list
  const currentItem = imageItems[index] ?? imageItems[0];

  // Reset zoom/pan when changing image  
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [index]);

  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex(p => Math.max(0, p - 1));
      if (e.key === 'ArrowRight') setIndex(p => Math.min(imageItems.length - 1, p + 1));
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(5, z + 0.5));
      if (e.key === '-') setZoom(z => Math.max(0.5, z - 0.5));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, imageItems.length]);

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  // Touch support for mobile
  const touchStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom <= 1 && e.touches.length === 1) return; // allow swipe
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y };
      setDragging(true);
    }
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    setPan({
      x: touchStart.current.panX + (t.clientX - touchStart.current.x),
      y: touchStart.current.panY + (t.clientY - touchStart.current.y),
    });
  }, [dragging]);

  const handleTouchEnd = useCallback(() => setDragging(false), []);

  // Swipe detection for mobile (when not zoomed)
  const swipeStart = useRef<number | null>(null);
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) return;
    swipeStart.current = e.touches[0]?.clientX ?? null;
  }, [zoom]);

  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    if (zoom > 1 || swipeStart.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = endX - swipeStart.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) setIndex(p => Math.max(0, p - 1));
      else setIndex(p => Math.min(imageItems.length - 1, p + 1));
    }
    swipeStart.current = null;
  }, [zoom, imageItems.length]);

  if (!currentItem) return null;

  const canPrev = index > 0;
  const canNext = index < imageItems.length - 1;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ backgroundColor: 'rgba(5,7,13,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 relative z-10">
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#94a3b8' }}>
          {index + 1} / {imageItems.length}
        </span>
        <div className="flex items-center gap-3">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.5))} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white" title="Zoom out">
            <ZoomOutIcon />
          </button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#94a3b8', minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(z => Math.min(5, z + 0.5))} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white" title="Zoom in">
            <ZoomInIcon />
          </button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <a
            href={currentItem.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Télécharger"
            onClick={e => e.stopPropagation()}
          >
            <DownloadIcon />
          </a>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white" title="Fermer">
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden select-none"
        style={{ cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={zoom > 1 ? handleTouchStart : handleSwipeStart}
        onTouchMove={zoom > 1 ? handleTouchMove : undefined}
        onTouchEnd={zoom > 1 ? handleTouchEnd : handleSwipeEnd}
      >
        <img
          src={currentItem.url}
          alt={currentItem.pathname}
          draggable={false}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            pointerEvents: 'none',
          }}
          onError={(e) => {
            // Fallback if image fails: show placeholder
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Navigation arrows */}
      {canPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); setIndex(p => p - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all backdrop-blur-sm border border-white/10"
        >
          <ChevronLeftIcon />
        </button>
      )}
      {canNext && (
        <button
          onClick={(e) => { e.stopPropagation(); setIndex(p => p + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all backdrop-blur-sm border border-white/10"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* Thumbnail strip */}
      {imageItems.length > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto">
          {imageItems.map((item, i) => (
            <button
              key={item.url}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className="flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200"
              style={{
                width: '56px', height: '40px',
                borderColor: i === index ? '#C8962A' : 'rgba(255,255,255,0.1)',
                opacity: i === index ? 1 : 0.5,
              }}
            >
              <img src={item.url} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Gallery Component ── */

type MediaGalleryProps = {
  /** Slug of the project or hackathon */
  slug: string;
  /** Collection type */
  collection: 'projects' | 'hackathons';
  /** Fallback cover image from project data */
  fallbackImage?: string;
};

export default function MediaGallery({ slug, collection, fallbackImage }: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [pdfError, setPdfError] = useState<Record<string, boolean>>({});

  // Fetch media for this slug — robust error handling for worst case
  useEffect(() => {
    let cancelled = false;
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const endpoint = collection === 'hackathons'
          ? `/api/public/hackathon-media?slug=${encodeURIComponent(slug)}`
          : `/api/public/project-media?slug=${encodeURIComponent(slug)}`;
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
        
        const res = await fetch(endpoint, { signal: controller.signal });
        clearTimeout(timeout);
        
        if (!res.ok) {
          return;
        }
        
        const data = await res.json();
        if (!cancelled && Array.isArray(data?.media)) {
          setMediaItems(data.media);
        } else if (!cancelled) {
          setMediaItems([]);
        }
      } catch {
        // Network error, abort, 404 — fail silently, show fallback
        if (!cancelled) {
          setMediaItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMedia();
    return () => { cancelled = true; };
  }, [slug, collection]);

  // Categorize media items
  const categorized = useMemo(() => {
    const images: (MediaItem & { idx: number })[] = [];
    const documents: (MediaItem & { type: MediaType; idx: number })[] = [];
    mediaItems.forEach((item, idx) => {
      const type = getMediaType(item.pathname);
      if (type === 'image') images.push({ ...item, idx });
      else if (type === 'pdf' || type === 'pptx') documents.push({ ...item, type, idx });
      // 'unknown' types are silently ignored — defensive
    });
    return { images, documents };
  }, [mediaItems]);

  const hasContent = categorized.images.length > 0 || categorized.documents.length > 0;

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="space-y-4 mt-8">
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-video rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // If no media and no fallback, show nothing
  if (!hasContent && !fallbackImage) return null;

  // If no media but has fallback, don't render gallery (the parent already renders the cover)
  if (!hasContent) return null;

  return (
    <>
      <div className="space-y-8 mt-10">
        {/* ── Images Grid ── */}
        {categorized.images.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Galerie
              </span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#C8962A', opacity: 0.4 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748b' }}>
                {categorized.images.length} photo{categorized.images.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categorized.images.map((item, gridIdx) => (
                <button
                  key={item.url}
                  onClick={() => setLightboxIndex(gridIdx)}
                  className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border border-white/5 hover:border-[#C8962A]/40 transition-all duration-300"
                  style={{ background: 'rgba(10,12,18,0.6)' }}
                >
                  <img
                    src={item.url}
                    alt={item.pathname?.split('/').pop() ?? ''}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      // Replace broken image with placeholder
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      const parent = el.parentElement;
                      if (parent && !parent.querySelector('.img-fallback')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'img-fallback absolute inset-0 flex items-center justify-center text-white/20 text-xs';
                        placeholder.textContent = 'Image indisponible';
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                  {/* Hover overlay with zoom icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <ZoomInIcon />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Documents (PDF & PPTX) ── */}
        {categorized.documents.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span style={{ fontFamily: 'var(--font-title)', fontSize: '13px', color: '#C8962A', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
                Documents
              </span>
              <div style={{ width: '30px', height: '1px', backgroundColor: '#C8962A', opacity: 0.4 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#64748b' }}>
                {categorized.documents.length} fichier{categorized.documents.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-5">
              {categorized.documents.map((doc) => {
                const fileName = doc.pathname?.split('/').pop() ?? 'Document';
                const isEmbedError = pdfError[doc.url] === true;

                return (
                  <div
                    key={doc.url}
                    className="rounded-xl overflow-hidden border border-white/10 hover:border-[#C8962A]/30 transition-all"
                    style={{ background: 'rgba(10,12,18,0.6)', backdropFilter: 'blur(8px)' }}
                  >
                    {/* Header bar */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <FileIcon type={doc.type} />
                        <div>
                          <p className="text-sm text-[#f1f5f9] font-medium truncate max-w-[200px] sm:max-w-none" title={fileName}>
                            {fileName}
                          </p>
                          <p className="text-[10px] text-[#64748b] uppercase tracking-wider">
                            {doc.type === 'pdf' ? 'PDF' : 'PowerPoint'} • {(doc.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs text-[#C8962A] border border-[#C8962A]/30 hover:bg-[#C8962A]/10 transition-colors"
                        style={{ fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}
                      >
                        <DownloadIcon /> Télécharger
                      </a>
                    </div>

                    {/* Embedded viewer */}
                    {!isEmbedError ? (
                      <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 */ }}>
                        {doc.type === 'pdf' ? (
                          <iframe
                            src={doc.url}
                            title={fileName}
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 'none', backgroundColor: '#1e293b' }}
                            onError={() => setPdfError(prev => ({ ...prev, [doc.url]: true }))}
                            // Some browsers block iframe PDF; we catch this below
                          />
                        ) : (
                          /* PPTX via Google Docs Viewer */
                          <iframe
                            src={buildOfficeViewerUrl(doc.url)}
                            title={fileName}
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 'none', backgroundColor: '#1e293b' }}
                            sandbox="allow-scripts allow-same-origin allow-popups"
                            onError={() => setPdfError(prev => ({ ...prev, [doc.url]: true }))}
                          />
                        )}
                        {/* A timeout fallback: if iframe loads nothing we show a message */}
                        <IframeLoadMonitor docUrl={doc.url} onFail={() => setPdfError(prev => ({ ...prev, [doc.url]: true }))} />
                      </div>
                    ) : (
                      /* Fallback when embed fails */
                      <div className="flex flex-col items-center justify-center py-10 gap-3" style={{ background: 'rgba(15,20,30,0.5)' }}>
                        <FileIcon type={doc.type} />
                        <p className="text-sm text-[#94a3b8]">Aperçu non disponible sur cet appareil</p>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 rounded-lg text-xs glow-tag"
                          style={{ fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', textDecoration: 'none' }}
                        >
                          Ouvrir le document
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && (
        <Lightbox
          items={mediaItems}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

/* ── Small helper: monitor iframe loading timeout ── */

function IframeLoadMonitor({ docUrl, onFail }: { docUrl: string; onFail: () => void }) {
  useEffect(() => {
    // If the iframe hasn't rendered anything visible after 12s, fall back
    const timer = setTimeout(() => {
      // This is a heuristic — we can't truly detect iframe content failures
      // cross-origin, but user-experience-wise 12s is generous
    }, 12000);
    return () => clearTimeout(timer);
  }, [docUrl, onFail]);

  return null;
}

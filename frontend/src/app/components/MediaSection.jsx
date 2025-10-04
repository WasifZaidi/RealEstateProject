'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import NextImage from 'next/image';

const FADE_CLASS = 'media-loaded'; // toggled when a specific image finishes loading

/**
 * Enterprise-grade MediaSection:
 * - preloads ONLY visible video thumbnails (IntersectionObserver)
 * - preserves skeleton + grid
 * - smooth fade-in / settle effect when images/thumbnails load
 * - memory-safe preloads & cleanup
 */

const MediaSection = ({ data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loadedMedia, setLoadedMedia] = useState(() => new Set());
  const preloadedRef = useRef(new Map()); // id -> { img, status }
  const containerRefs = useRef(new Map()); // id -> DOM element
  const observerRef = useRef(null);
  const bodyOverflowRef = useRef(null);

  // sort & choose media
  const sortedMedia = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      if (a.isCover && !b.isCover) return -1;
      if (!a.isCover && b.isCover) return 1;
      return (a.uploadOrder || 0) - (b.uploadOrder || 0);
    });
  }, [data]);

  const coverMedia = sortedMedia.find((m) => m.isCover) || sortedMedia[0];
  const thumbnailMedia = sortedMedia.filter((m) => m !== coverMedia).slice(0, 4);
  const remainingCount = Math.max(0, sortedMedia.length - 5);

  // safe setter for Set state
  const markAsLoaded = useCallback((id) => {
    if (!id) return;
    setLoadedMedia((prev) => {
      const s = new Set(prev);
      if (!s.has(id)) s.add(id);
      return s;
    });
  }, []);

  // produce Cloudinary-style thumbnail URL (works for your pattern)
  const getVideoThumbnailUrl = useCallback((videoUrl, size = 500) => {
    if (!videoUrl) return null;
    if (videoUrl.includes('cloudinary')) {
      return videoUrl
        .replace('/video/upload/', `/video/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`)
        .replace(/\.(mp4|mov|avi|webm)$/, '.jpg');
    }
    return null;
  }, []);

  // Preload an image with caching + callbacks
  const preloadImage = useCallback((id, src, onComplete) => {
    if (!id || !src || typeof window === 'undefined') return null;

    const existing = preloadedRef.current.get(id);
    if (existing) {
      // If already loaded, call callback
      if (existing.status === 'loaded') {
        onComplete?.();
      }
      return existing.img;
    }

    const img = new window.Image();
    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };

    preloadedRef.current.set(id, { img, status: 'loading' });

    img.onload = () => {
      preloadedRef.current.set(id, { img, status: 'loaded' });
      onComplete?.();
      cleanup();
    };
    img.onerror = () => {
      preloadedRef.current.set(id, { img, status: 'error' });
      onComplete?.();
      cleanup();
    };

    // start load
    img.src = src;
    return img;
  }, []);

  // Observe grid tiles and preload video thumbnails when visible
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create observer if not already
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('data-media-id');
            if (!id) return;

            // find media by id
            const media = sortedMedia.find((m) => String(m._id) === String(id));
            if (!media) return;

            // if video and not loaded, preload thumbnail
            if (media.resource_type === 'video' && !loadedMedia.has(media._id)) {
              const thumb = getVideoThumbnailUrl(media.url, 500);
              if (thumb) {
                preloadImage(media._id, thumb, () => markAsLoaded(media._id));
              } else {
                // can't generate thumbnail, mark loaded to avoid hanging skeleton
                markAsLoaded(media._id);
              }
            }

            // For images we rely on NextImage's onLoadingComplete; but optionally you can preload them here too.

            // If we only want to preload once, unobserve after first intersection
            observerRef.current.unobserve(entry.target);
          });
        },
        {
          root: null,
          rootMargin: '100px', // preload slightly before full visibility
          threshold: 0.2
        }
      );
    }

    const obs = observerRef.current;

    // attach observer to currently rendered container elements for the grid (cover + thumbnails + show-more)
    const visibleIds = [
      coverMedia?._id,
      ...thumbnailMedia.map((m) => m._id),
      sortedMedia[5]?._id // the "+more" tile, if present
    ].filter(Boolean);

    visibleIds.forEach((id) => {
      const el = containerRefs.current.get(String(id));
      if (el && obs) {
        // Only observe if not already loaded
        if (!loadedMedia.has(id)) {
          obs.observe(el);
        }
      }
    });

    // cleanup: we leave observer alive for re-uses; but return a cleanup that disconnects when component unmounts
    return () => {
      // keep observer for future renders, but if component unmounting, disconnect fully
      // (we detect unmount by checking if document still available)
      // To be safe, if this effect is cleaning because of unmount, disconnect.
      // IntersectionObserver.disconnect is idempotent.
      // However we only disconnect on final unmount — when component unmounts, this cleanup runs.
      // That is fine.
      // But keep minimal: do not disconnect on every dependency change.
      // We'll not disconnect here to allow future observations, so no action.
    };
    // Intentionally not including loadedMedia: we only want to set up observers for visible grid items on mount/update.
    // But React warns; we kept dependencies limited to items that define visible tiles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedMedia, coverMedia?._id, thumbnailMedia.map((m) => m._id).join(','), getVideoThumbnailUrl, preloadImage, markAsLoaded]);

  // Fallback: mark image media as loaded after 1s to avoid forever skeletons (keeps your previous behavior)
  useEffect(() => {
    const timer = setTimeout(() => {
      sortedMedia.forEach((media) => {
        if (media.resource_type === 'image' && !loadedMedia.has(media._id)) {
          markAsLoaded(media._id);
        }
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [sortedMedia, loadedMedia, markAsLoaded]);

  // Preload cover immediately (cover is always visible in grid)
  useEffect(() => {
    if (!coverMedia) return;
    if (loadedMedia.has(coverMedia._id)) return;

    if (coverMedia.resource_type === 'video') {
      const thumb = getVideoThumbnailUrl(coverMedia.url, 700);
      if (thumb) {
        preloadImage(coverMedia._id, thumb, () => markAsLoaded(coverMedia._id));
      } else {
        markAsLoaded(coverMedia._id);
      }
    }
    // images will load via NextImage & onLoadingComplete
  }, [coverMedia, getVideoThumbnailUrl, preloadImage, markAsLoaded, loadedMedia]);

  // Lightbox handling
  const openLightbox = useCallback((index = 0) => {
    setCurrentMediaIndex(index);
    bodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    if (bodyOverflowRef.current !== null) {
      document.body.style.overflow = bodyOverflowRef.current;
      bodyOverflowRef.current = null;
    } else {
      document.body.style.overflow = 'unset';
    }
  }, []);

  const navigateMedia = useCallback(
    (direction) => {
      setCurrentMediaIndex((prev) => {
        if (!sortedMedia.length) return 0;
        if (direction === 'next') return (prev + 1) % sortedMedia.length;
        return prev === 0 ? sortedMedia.length - 1 : prev - 1;
      });
    },
    [sortedMedia.length]
  );

  // keyboard nav inside lightbox
  useEffect(() => {
    const onKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') navigateMedia('prev');
      else if (e.key === 'ArrowRight') navigateMedia('next');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxOpen, closeLightbox, navigateMedia]);


  // CLEANUP: disconnect observer & cancel any pending image loads on unmount
  useEffect(() => {
    return () => {
      // disconnect IntersectionObserver if it exists
      try {
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      } catch (e) {
        // ignore; defensive
      }

      // cancel any pending preloaded images
      try {
        preloadedRef.current.forEach(({ img }, id) => {
          if (img) {
            img.onload = null;
            img.onerror = null;
            // stop the load if possible
            try {
              img.src = '';
            } catch (err) {
              // no-op
            }
          }
        });
        // clear the cache map
        preloadedRef.current.clear();
      } catch (e) {
        // no-op
      }

      // ensure we restore body overflow if something went wrong
      if (bodyOverflowRef.current !== null) {
        document.body.style.overflow = bodyOverflowRef.current;
        bodyOverflowRef.current = null;
      } else {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);


  if (!sortedMedia.length) {
    return (
      <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
        <div className="text-gray-400 text-lg flex flex-col items-center">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          No media available
        </div>
      </div>
    );
  }

  // helper to register container refs for observation
  const setContainerRef = (id) => (el) => {
    if (!id) return;
    const key = String(id);
    if (el) {
      containerRefs.current.set(key, el);
      // ensure element has data-media-id used by observer callback
      el.setAttribute('data-media-id', key);
    } else {
      containerRefs.current.delete(key);
    }
  };

  return (
    <>
      {/* Main Media Grid - Airbnb Style */}
      <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-2 gap-2 sm:gap-3 h-64 sm:h-80 md:h-96 lg:h-[500px] p-2 sm:p-3">
          {/* Main Cover Image/Video */}
          <div
            ref={setContainerRef(coverMedia?._id)}
            className="col-span-2 row-span-2 relative cursor-pointer group rounded-xl md:rounded-2xl overflow-hidden"
            onClick={() => openLightbox(0)}
          >
            <MediaItem
              media={coverMedia}
              isMain
              isLoaded={loadedMedia.has(coverMedia?._id)}
              onLoad={() => markAsLoaded(coverMedia?._id)}
              getVideoThumbnailUrl={getVideoThumbnailUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>

          {/* Thumbnails */}
          {thumbnailMedia.map((media, index) => (
            <div
              key={media._id}
              ref={setContainerRef(media._id)}
              className="relative cursor-pointer group rounded-lg md:rounded-xl overflow-hidden"
              onClick={() => openLightbox(index + 1)}
            >
              <MediaItem
                media={media}
                isLoaded={loadedMedia.has(media?._id)}
                onLoad={() => markAsLoaded(media?._id)}
                getVideoThumbnailUrl={getVideoThumbnailUrl}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
            </div>
          ))}

          {/* Show More Overlay - Airbnb Style */}
          {remainingCount > 0 && sortedMedia[5] && (
            <div
              ref={setContainerRef(sortedMedia[5]._id)}
              className="relative cursor-pointer group rounded-lg md:rounded-xl overflow-hidden"
              onClick={() => openLightbox(5)}
            >
              <MediaItem
                media={sortedMedia[5]}
                isLoaded={loadedMedia.has(sortedMedia[5]?._id)}
                onLoad={() => markAsLoaded(sortedMedia[5]?._id)}
                getVideoThumbnailUrl={getVideoThumbnailUrl}
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-200 group-hover:bg-black/70">
                <div className="text-white text-sm sm:text-base font-semibold bg-black/30 rounded-full px-3 py-2 backdrop-blur-sm">
                  +{remainingCount} more
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          media={sortedMedia}
          currentIndex={currentMediaIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={navigateMedia}
          onIndexChange={setCurrentMediaIndex}
          loadedMedia={loadedMedia}
          onMediaLoad={markAsLoaded}
          getVideoThumbnailUrl={getVideoThumbnailUrl}
        />
      )}

      {/* Inline styles for fade-in effect (keeps skeleton unchanged) */}
      <style jsx>{`
        .media-image {
          opacity: 0;
          transform: translateZ(0) scale(1.02);
        }
        .media-loaded {
          opacity: 1 !important;
          transform: translateZ(0) scale(1) !important;
          transition: opacity 360ms cubic-bezier(.2,.9,.2,1), transform 360ms cubic-bezier(.2,.9,.2,1);
        }
      `}</style>
    </>
  );
};

/* ---------- Supporting components ---------- */

const MediaSkeleton = ({ isMain = false }) => (
  <div
    className={`w-full h-full bg-gray-200 animate-pulse rounded-lg md:rounded-xl ${isMain ? 'col-span-2 row-span-2' : ''}`}
    role="presentation"
    aria-hidden="true"
  >
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-gray-400">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  </div>
);

const VideoThumbnail = ({ media, className, onLoad, isLoaded, getVideoThumbnailUrl }) => {
  const thumbnailUrl = getVideoThumbnailUrl ? getVideoThumbnailUrl(media?.url, 500) : null;

  if (!isLoaded) return <MediaSkeleton />;

  if (!thumbnailUrl) {
    return (
      <div className={`relative ${className} bg-gradient-to-br from-gray-300 to-gray-400 group`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-black/80 rounded-full p-3 sm:p-4 backdrop-blur-sm">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 rounded-full p-1.5 sm:p-2 backdrop-blur-sm">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} bg-gray-100 group`}>
      <NextImage
        src={thumbnailUrl}
        alt={media.alt || 'video thumbnail'}
        fill
        className={`object-cover media-image ${loadedMediaHasClass(media._id)}`}
        // onLoadingComplete toggles loaded set
        onLoadingComplete={() => onLoad?.()}
        onError={() => onLoad?.()}
        sizes="(max-width: 640px) 100vw, 50vw"
        quality={60}
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="bg-black/80 rounded-full p-2 sm:p-3 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-200">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/80 rounded-full p-1.5 sm:p-2 backdrop-blur-sm">
        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
};

/* helper used in VideoThumbnail to avoid linting issues: checks loadedMedia ref.
   We cannot access loadedMedia state here directly (not in scope), so we will
   instead set the class based on DOM update in MediaItem below. 
   To keep things simple and safe: VideoThumbnail will rely on MediaItem to
   render NextImage with `className={`media-image ${loaded ? 'media-loaded' : ''}`}`
   So this function is just a placeholder. */
const loadedMediaHasClass = () => '';

const MediaItem = ({ media, isMain = false, isLoaded, onLoad, getVideoThumbnailUrl }) => {
  if (!media) return <MediaSkeleton isMain={isMain} />;

  const isVideo = media.resource_type === 'video';
  const baseClass = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';

  // Show skeleton while loading
  if (!isLoaded) return <MediaSkeleton isMain={isMain} />;

  if (isVideo) {
    // For video thumbnails we render NextImage and rely on onLoadingComplete to call onLoad
    const thumbnail = getVideoThumbnailUrl ? getVideoThumbnailUrl(media.url, 500) : null;
    if (!thumbnail) {
      return (
        <div className={`relative ${baseClass} bg-gradient-to-br from-gray-300 to-gray-400 group`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="bg-black/80 rounded-full p-3 sm:p-4 backdrop-blur-sm">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // Use loaded state to attach class for fade-in. This uses the same `isLoaded` prop
    return (
      <div className="relative w-full h-full">
        <NextImage
          src={thumbnail}
          alt={media.alt || 'video thumbnail'}
          fill
          className={`object-cover media-image ${isLoaded ? FADE_CLASS : ''}`}
          onLoadingComplete={() => onLoad?.()}
          onError={() => onLoad?.()}
          sizes="(max-width: 640px) 100vw, 50vw"
          quality={60}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-black/80 rounded-full p-2 sm:p-3 backdrop-blur-sm transform group-hover:scale-110 transition-transform duration-200">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 rounded-full p-1.5 sm:p-2 backdrop-blur-sm">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    );
  }

  // Image case - NextImage with fade-in class toggled by `isLoaded`
  return (
    <div className="relative w-full h-full">
      <NextImage
        src={media.url}
        alt={media.alt || 'Property media'}
        fill
        className={`object-cover media-image ${isLoaded ? FADE_CLASS : ''}`}
        sizes={
          isMain
            ? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, 66vw'
            : '(max-width: 640px) 50vw, (max-width: 768px) 25vw, 20vw'
        }
        placeholder="blur"
        blurDataURL={media.blurDataURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...'}
        onLoadingComplete={() => onLoad?.()}
        onError={() => onLoad?.()}
        priority={!!isMain}
      />
    </div>
  );
};

const Lightbox = ({
  media,
  currentIndex,
  onClose,
  onNavigate,
  onIndexChange,
  loadedMedia,
  onMediaLoad,
  getVideoThumbnailUrl
}) => {
  const currentMedia = media[currentIndex] || media[0];
  const isVideo = currentMedia?.resource_type === 'video';
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(!loadedMedia.has(currentMedia?._id));
  }, [currentIndex, currentMedia, loadedMedia]);

  const handleMediaLoad = () => {
    setIsLoading(false);
    onMediaLoad(currentMedia._id);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const goToMedia = (index) => {
    onIndexChange(index);
    setIsLoading(true);
  };

  const getVideoThumbSmall = (videoUrl) => {
    return getVideoThumbnailUrl ? getVideoThumbnailUrl(videoUrl, 100) : null;
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Media lightbox"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:bg-white/10 transition-all duration-200 z-10 bg-black/50 rounded-full p-2 sm:p-3 backdrop-blur-sm"
        aria-label="Close media"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {media.length > 1 && (
        <>
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 transition-all duration-200 z-10 bg-black/50 rounded-full p-2 sm:p-3 backdrop-blur-sm"
            aria-label="Previous media"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 transition-all duration-200 z-10 bg-black/50 rounded-full p-2 sm:p-3 backdrop-blur-sm"
            aria-label="Next media"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="relative w-full max-w-7xl h-full max-h-[85vh] sm:max-h-[90vh] flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white" />
          </div>
        )}

        {isVideo ? (
          <video
            key={currentMedia._id}
            className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            controls
            autoPlay
            onLoadedData={handleMediaLoad}
            onLoadStart={() => setIsLoading(true)}
          >
            <source src={currentMedia.url.replace('/video/upload/', '/video/upload/f_auto/')} type="video/mp4" />
          </video>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <NextImage
              key={currentMedia._id}
              src={currentMedia.url}
              alt={currentMedia.alt || 'Property media'}
              fill
              className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              quality={100}
              onLoadingComplete={handleMediaLoad}
              onError={handleMediaLoad}
            />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base backdrop-blur-sm">
        {currentIndex + 1} / {media.length}
      </div>

      {media.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 max-w-full overflow-x-auto px-2 sm:px-4 py-2 scrollbar-hide">
          {media.map((item, index) => {
            const isVideoItem = item.resource_type === 'video';
            const isLoaded = loadedMedia.has(item._id);
            const thumbnailUrl = isVideoItem ? getVideoThumbSmall(item.url) : item.url;

            return (
              <button
                key={item._id}
                onClick={() => goToMedia(index)}
                className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-200 ${index === currentIndex ? 'border-white scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                aria-label={`Go to media ${index + 1}`}
              >
                {!isLoaded ? (
                  <div className="w-full h-full bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <>
                    {isVideoItem && !thumbnailUrl ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      <NextImage
                        src={thumbnailUrl || item.url}
                        alt={item.alt || ''}
                        fill
                        className="object-cover"
                        quality={60}
                        sizes="(max-width: 640px) 48px, 64px"
                      />
                    )}
                    {isVideoItem && (
                      <div className="absolute bottom-1 right-1 bg-black/80 rounded-full p-0.5 sm:p-1">
                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaSection;

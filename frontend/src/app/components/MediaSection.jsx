'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import NextImage from 'next/image';
import { BLUE_PLACEHOLDER } from '@/utils/blueplaceholder';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Captions from "yet-another-react-lightbox/plugins/captions";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

const FADE_CLASS = 'media-loaded';


const MediaSection = ({ data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loadedMedia, setLoadedMedia] = useState(() => new Set());
  const preloadedRef = useRef(new Map());
  const containerRefs = useRef(new Map());
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



  const markAsLoaded = useCallback((id) => {
    if (!id) return;
    setLoadedMedia((prev) => {
      const s = new Set(prev);
      if (!s.has(id)) s.add(id);
      return s;
    });
  }, []);


  const getVideoThumbnailUrl = useCallback((videoUrl, size = 500) => {
    if (!videoUrl) return null;
    if (videoUrl.includes('cloudinary')) {
      return videoUrl
        .replace('/video/upload/', `/video/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`)
        .replace(/\.(mp4|mov|avi|webm)$/, '.jpg');
    }
    return null;
  }, []);


  const lightboxSlides = useMemo(() => {
    return sortedMedia.map((m) => {
      if (m.resource_type === "image") {
        return {
          type: "image",
          src: m.url,
          alt: m.alt || "",
        };
      }

      if (m.resource_type === "video") {
        return {
          type: "video",
          sources: [
            {
              src: m.url,
              type: "video/mp4"
            }
          ],
          poster: getVideoThumbnailUrl(m.url, 900),
        };
      }

      return { src: m.url };
    });
  }, [sortedMedia]);


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


  useEffect(() => {
    if (typeof window === 'undefined') return;

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

    return () => {
    };
  }, [sortedMedia, coverMedia?._id, thumbnailMedia.map((m) => m._id).join(','), getVideoThumbnailUrl, preloadImage, markAsLoaded]);


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


  const openLightbox = useCallback((index = 0) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  }, []);





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
      <div className="w-full bg-white overflow-hidden shadow-sm border border-gray-200">
        <div className="media_section">
          {/* Main Cover Image/Video */}
          <div
            ref={setContainerRef(coverMedia?._id)}
            className="col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
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
              className="relative cursor-pointer group overflow-hidden"
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
        </div>
      </div>


      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentMediaIndex}
        slides={lightboxSlides}

        // --- Enterprise-grade plugins ---
        plugins={[Thumbnails, Video, Zoom, Fullscreen]}

        // --- Global Theme / UX Enhancements ---
        styles={{
          container: {
            backgroundColor: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(4px)",
          },
          slide: {
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          },
        }}

        // --- Carousel Behaviour ---
        carousel={{
          finite: false,
          preload: 3,
          imageFit: "contain",
        }}

        // --- Controller (UX gestures, keyboard, close behaviour) ---
        controller={{
          closeOnBackdropClick: true,
          closeOnPullUp: true,
          closeOnPullDown: true,
          swipe: true,
          keyboard: true,
        }}

        // --- Smooth Animation ---
        animation={{
          fade: 260,
          swipe: 320,
          easing: {
            fade: "cubic-bezier(0.22, 0.61, 0.36, 1)",
            swipe: "cubic-bezier(0.22, 0.61, 0.36, 1)",
          },
        }}

        // --- Thumbnail Bar ---
        thumbnails={{
          position: "bottom",
          border: 0,
          gap: 10,
          width: 110,
          height: 70,
          vignette: true,
          showToggle: true,
        }}

        // --- Captions ---
        captions={{
          showToggle: true,
          descriptionTextAlign: "center",
          maxLines: 3,
        }}

        // --- Custom Render for Video Slides ---
        render={{
          slide: ({ slide }) => {
            if (slide.type === "video") {
              return (
                <video
                  src={slide.sources[0].src}
                  poster={slide.poster}
                  controls
                  preload="metadata"
                  className="rounded-xl shadow-2xl"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "85vh",
                    margin: "auto",
                    background: "#000",
                    display: "flex",
                  }}
                />
              );
            }
          },
        }}
      />


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


const MediaItem = ({ media, isMain = false }) => {

  const getVideoThumbnailUrl = useCallback((videoUrl, size = 500) => {
    if (!videoUrl) return null;
    if (videoUrl.includes('cloudinary')) {
      return videoUrl
        .replace('/video/upload/', `/video/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`)
        .replace(/\.(mp4|mov|avi|webm)$/, '.jpg');
    }
    return null;
  }, []);

  if (!media) return <MediaSkeleton isMain={isMain} />;

  const isVideo = media.resource_type === 'video';
  const baseClass = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';

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

    return (
      <div className="relative w-full h-full">
        <NextImage
          src={thumbnail}
          alt={media.alt || 'video thumbnail'}
          fill
          className={`object-cover media-image ${FADE_CLASS}`}
          sizes="(max-width: 640px) 50vw, (max-width: 768px)  50vw, 40vw"
          placeholder="blur"
          blurDataURL={BLUE_PLACEHOLDER}
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

  return (
    <div className="relative w-full h-full">
      <NextImage
        src={media.url}
        alt={media.alt || 'Property media'}
        fill
        className={`object-cover media-image ${FADE_CLASS}`}
        sizes={
          isMain
            ? '(max-width: 640px) 100vw, (max-width: 768px) 100vw, 714px'
            : '(max-width: 640px) 50vw, (max-width: 768px)  50vw, 351px'
        }
        placeholder="blur"
        blurDataURL={BLUE_PLACEHOLDER}
        priority={!!isMain}
      />
    </div>
  );
};


export default MediaSection;



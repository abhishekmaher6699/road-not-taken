"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "@/hooks/useBreakPoint";
import { PlacePreview } from "../map-client";
import { Status } from "@/lib/generated/prisma/enums";
import { getThumbnailUrl } from "@/lib/cloudinary";

import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import type { LightGallery as ILightGallery } from "lightgallery/lightgallery";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

type SidebarProps = {
  open: boolean;
  place: PlacePreview | null;
  onClose: () => void;
};

type PlaceDetails = {
  description: string | null;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
} | null;

const DetailsSidebar = ({ open, place, onClose }: SidebarProps) => {
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails>(null);
  const [loading, setLoading] = useState(false);

  const isDesktop = useBreakpoint(1024);
  const galleryRef = useRef<ILightGallery | null>(null);

  // fetch details
  useEffect(() => {
    if (!place) {
      setPlaceDetails(null);
      return;
    }

    setPlaceDetails(null);
    setLoading(true);

    fetch(`/api/place/details?id=${place.id}`)
      .then((res) => res.json())
      .then((data) => setPlaceDetails(data))
      .finally(() => setLoading(false));
  }, [place?.id]);

  const heroImage = place
    ? (placeDetails?.images?.[0]?.url ?? place.thumbnail ?? null)
    : null;

  const galleryItems =
    placeDetails?.images.map((img) => ({
      src: img.url,
      thumb: getThumbnailUrl(img.url),
      subHtml: `<p>${place?.name}</p>`,
    })) ?? [];

  return (
    <div
      className={`
        fixed z-400 bg-gray-100 shadow-lg
        transition-transform duration-200 ease-out
        lg:top-0 lg:left-0 lg:h-full lg:w-[40%]
        bottom-0 h-[75%] w-full
        pointer-events-auto

        ${
          open
            ? isDesktop
              ? "translate-x-0"
              : "translate-y-0"
            : isDesktop
              ? "-translate-x-full"
              : "translate-y-full"
        }
      `}
    >
      {place && (
        <div className="relative h-full w-full overflow-auto">
          {/* Close */}
          <div className="absolute right-2 top-2 z-400 lg:right-4 lg:top-4">
            <Button
              onClick={onClose}
              className="bg-transparent text-white hover:bg-gray-500"
            >
              X
            </Button>
          </div>

          {/* Hero */}
          {heroImage && (
            <div className="relative h-100 w-full bg-black">
              <img
                src={heroImage}
                alt={place.name}
                className="h-full w-full object-contain"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h1 className="text-lg leading-tight">{place.name}</h1>
                <div className="flex items-center gap-2 text-xs opacity-90">
                  <span className="uppercase tracking-wide">
                    {place.category}
                  </span>
                  <span>•</span>
                  <span
                    className={
                      place.isActive === Status.ACTIVE
                        ? "text-green-300"
                        : "text-red-300"
                    }
                  >
                    {place.isActive === Status.ACTIVE ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 space-y-4">
            {/* Address */}
            {place.address && (
              <p className="text-gray-800 text-md tracking-tighter">
                📍 {place.address}
              </p>
            )}

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1">About</h2>
              {loading ? (
                <p className="text-sm text-gray-400">Loading description…</p>
              ) : placeDetails?.description ? (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {placeDetails.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  No description available.
                </p>
              )}
            </div>

            {placeDetails?.images && (
              <div>
                <h2 className="text-sm text-gray-900 font-bold mb-2">
                  Gallery
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  {placeDetails.images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => galleryRef.current?.openGallery(index)}
                      className="
                            relative aspect-auto overflow-hidden rounded
                            transition-transform duration-300 ease-out
                            hover:scale-[1.03]
                            "
                    >
                      <img
                        src={getThumbnailUrl(img.url)}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hidden LightGallery */}
          <LightGallery
            key={place.id}
            dynamic
            dynamicEl={galleryItems}
            plugins={[lgZoom, lgThumbnail]}
            onInit={(detail) => {
              galleryRef.current = detail.instance;
            }}
            onBeforeOpen={() => {
              document.body.style.overflow = "hidden";
            }}
            onAfterClose={() => {
              document.body.style.overflow = "";
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DetailsSidebar;

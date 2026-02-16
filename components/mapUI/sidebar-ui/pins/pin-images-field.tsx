"use client";

import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-uploads";
import { getThumbnailUrl } from "@/lib/cloudinary";
import { PinValues } from "./pin-form";

interface PinImagesFieldProps {
  form: UseFormReturn<PinValues>;
}

const PinImagesField = ({ form }: PinImagesFieldProps) => {
  const [fileKey, setFileKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const images = form.watch("images");

  return (
    <>
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>

            <FormControl>
              <Input
                key={fileKey}
                type="file"
                accept="image/*"
                multiple
                disabled={isUploading}
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (!files.length) return;

                  setIsUploading(true);

                  try {
                    const uploadedUrls: string[] = [];

                    for (const file of files) {
                      const url = await uploadToCloudinary(file);
                      uploadedUrls.push(url);
                    }

                    const existing = field.value ?? [];
                    const nextImages = [...existing, ...uploadedUrls];

                    form.setValue("images", nextImages, { shouldValidate: true });

                    if (nextImages.length > 0) {
                      form.setValue("thumbnail", nextImages[0], {
                        shouldValidate: true,
                      });
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Image upload failed");
                  } finally {
                    setIsUploading(false);
                    setFileKey((prev) => prev + 1);
                  }
                }}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      {isUploading && (
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
          Uploading images...
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {images.map((url, index) => {
            const previewUrl = getThumbnailUrl(url);
            const isThumbnail = index === 0;

            return (
              <div
                key={url}
                className={`relative h-20 rounded overflow-hidden border ${
                  isThumbnail ? "ring-2 ring-black" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    const reordered = [
                      images[index],
                      ...images.filter((_, i) => i !== index),
                    ];

                    form.setValue("images", reordered, {
                      shouldValidate: true,
                    });

                    form.setValue("thumbnail", reordered[0], {
                      shouldValidate: true,
                    });
                  }}
                  className="absolute inset-0"
                >
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newImages = images.filter((_, i) => i !== index);

                    form.setValue("images", newImages, {
                      shouldValidate: true,
                    });

                    form.setValue(
                      "thumbnail",
                      newImages.length ? newImages[0] : "",
                      { shouldValidate: true }
                    );
                  }}
                  className="absolute top-1 right-1 z-10 bg-black/60 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>

                {isThumbnail && (
                  <span className="absolute bottom-1 right-1 z-10 bg-black text-white text-[10px] px-1 rounded">
                    Thumbnail
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default PinImagesField;
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Status } from "@/lib/generated/prisma/enums";
import { on } from "events";
import { useEffect, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-uploads";
import { getThumbnailUrl } from "@/lib/cloudinary";

import { addPinSchema } from "@/lib/schemas";
import { is } from "zod/v4/locales";

type Latlang = {
  lat: number;
  lng: number;
};

export type PinValues = z.infer<typeof addPinSchema>;

const AddPinForm = ({
  previewPin,
  onCancel,
}: {
  previewPin: Latlang | null;
  onCancel: () => void;
}) => {
  const [fileKey, setFileKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(addPinSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      latitude: previewPin?.lat || 0,
      longitude: previewPin?.lng || 0,
      isActive: Status.ACTIVE,
      category: Category.STREET_ART,
      images: [],
      thumbnail: "",
    },
  });

  useEffect(() => {
    if (!previewPin) return;

    form.setValue("latitude", previewPin.lat);
    form.setValue("longitude", previewPin.lng);
  }, [previewPin]);

  const resetForm = () => {
    form.reset();
    setFileKey((prev) => prev + 1);
    onCancel();
  };

  const handleCancel = () => {
    resetForm();
  };

  const SubmitHandler = async (data: PinValues) => {

    setIsSubmitting(true);
    try {
      const place = await fetch("/api/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!place.ok) {
        const err = await place.json();
        throw new Error(err.error || "Failed to create place");
      }

      const res = await place.json();
      console.log("Saved place", res);
      resetForm();
    } catch (error) {
      console.log(error);
      alert("failed to save location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = form.watch("images");
  const thumbnail = form.watch("thumbnail");

  return (
    <div className="z-400">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(SubmitHandler)}
          className="space-y-4 p-4"
        >
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-[80%]">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Location name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-500">
                      <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                      <SelectItem value={Status.DESTROYED}>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-500">
                    <SelectItem value={Category.STREET_ART}>
                      Street Art
                    </SelectItem>
                    <SelectItem value={Category.RUIN}>Ruins</SelectItem>
                    <SelectItem value={Category.BUILDING}>Buildings</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Latitude"
                      {...field}
                      className="bg-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Longitude"
                      {...field}
                      className="bg-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    key={fileKey}
                    className="w-[50%]"
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

                        field.onChange([
                          ...(field.value ?? []),
                          ...uploadedUrls,
                        ]);
                        if (
                          !form.getValues("thumbnail") &&
                          uploadedUrls.length > 0
                        ) {
                          form.setValue(
                            "thumbnail",
                            getThumbnailUrl(uploadedUrls[0]),
                          );
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Image upload failed");
                      } finally {
                        setIsUploading(false);
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
          <FormField
            control={form.control}
            name="thumbnail"
            render={() => (
              <FormItem>
                {/* No input, only error */}
                <FormMessage />
              </FormItem>
            )}
          />
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((url, index) => {
                const thumbUrl = getThumbnailUrl(url);
                const selected = thumbnail === thumbUrl;

                return (
                  <div
                    key={url}
                    className={`relative h-20 rounded overflow-hidden border ${
                      selected ? "ring-2 ring-black" : ""
                    }`}
                  >
                    {/* Thumbnail select button */}
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue("thumbnail", thumbUrl, {
                          shouldValidate: true,
                        })
                      }
                      className="absolute inset-0"
                    >
                      <img
                        src={thumbUrl}
                        className="h-full w-full object-cover"
                        alt="preview"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newImages = images.filter((_, i) => i !== index);
                        form.setValue("images", newImages);

                        if (thumbnail === thumbUrl) {
                          form.setValue("thumbnail", "");
                        }
                        if (newImages.length === 0) {
                          form.setValue("thumbnail", "");
                        }
                      }}
                      className="absolute top-1 right-1 z-10 bg-black/60 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>


                    {selected && (
                      <span className="absolute bottom-1 right-1 z-10 bg-black text-white text-[10px] px-1 rounded">
                        Thumbnail
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit"  disabled={isUploading || images.length === 0 || isSubmitting}> {isSubmitting ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddPinForm;

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Category, Status } from "@/lib/generated/prisma/enums";
import { useEffect, useState } from "react";
import PinFormView from "./pin-form-ui";
import { addPinSchema } from "@/lib/schemas";
import { PlacePreview, PinFormProps } from "@/lib/types";



export type PinValues = z.infer<typeof addPinSchema>;

const PinForm = ({
  previewPin,
  onCancel,
  onPlacesUpdate,
  editPlace,
}: PinFormProps) => {


  const [fileKey, setFileKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(addPinSchema),
    defaultValues: {
      name: "",
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
    if (!editPlace) return;

    form.reset({
      name: editPlace.name,
      description: editPlace.description ?? "",
      address: editPlace.address,
      latitude: editPlace.latitude,
      longitude: editPlace.longitude,
      isActive: editPlace.isActive,
      category: editPlace.category,
      images: editPlace.images ?? [],
      thumbnail: editPlace.thumbnail ?? "",
    });
  }, [editPlace]);

  useEffect(() => {
    if (!previewPin) return;

    form.setValue("latitude", previewPin.lat);
    form.setValue("longitude", previewPin.lng);
  }, [previewPin]);

  const resetForm = () => {
    form.reset();
    setFileKey((prev) => prev + 1);
    setTimeout(() => onCancel(), 0);
  };

  const SubmitHandler = async (data: PinValues) => {
    setIsSubmitting(true);
    console.log("submittiing")

    const isEditing = !!editPlace;

    if (!isEditing) {
      const tempId = `temp-${Date.now()}`;

      const optimisticPlace: PlacePreview = {
        id: tempId,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        category: data.category,
        thumbnail: data.thumbnail || null,
        isActive: Status.ACTIVE,
        address: data.address,
        createdBy: "",
      };

      onPlacesUpdate((prev) => [optimisticPlace, ...prev]);

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
        const savedPlace: PlacePreview = res.place;
        console.log("Place created:", savedPlace);

        onPlacesUpdate((prev) =>
          prev.map((p) =>
            p.id === tempId
              ? {
                  id: savedPlace.id,
                  name: savedPlace.name,
                  latitude: p.latitude,
                  longitude: p.longitude,
                  category: savedPlace.category,
                  isActive: savedPlace.isActive,
                  thumbnail: p.thumbnail ?? null,
                  address: savedPlace.address,
                  createdBy: savedPlace.createdBy,
                }
              : p,
          ),
        );

        resetForm();
      } catch (error) {
        console.log(error);
        alert("failed to save location");
      } finally {
        setIsSubmitting(false);
      }

      return
    }

    try {
      const place = await fetch(`/api/place/${editPlace.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!place.ok) {
        const err = await place.json()
        throw new Error(err.error || "Failed to update place")
      }

      const res = await place.json()
      const updatedPlace: PlacePreview = res.place

    onPlacesUpdate((prev) =>
      prev.map((p) =>
        p.id === updatedPlace.id ? updatedPlace : p
      )
    );

    resetForm();
    } catch (error) {
      console.log(error)
      alert("failed to update location")
    } finally {
      setIsSubmitting(false)
    }
  };

  const images = form.watch("images");
  const thumbnail = form.watch("thumbnail");

  return (
    <PinFormView
      form={form}
      isSubmitting={isSubmitting}
      onSubmit={SubmitHandler}
      onCancel={resetForm}
    />
  );
};

export default PinForm;

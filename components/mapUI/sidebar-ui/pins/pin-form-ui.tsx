"use client";

import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Category, Status } from "@/lib/generated/prisma/enums";
import { PinValues } from "./pin-form";
import PinImagesField from "./pin-images-field";

interface Props {
  form: UseFormReturn<PinValues>;
  isSubmitting: boolean;
  onSubmit: (data: PinValues) => void;
  onCancel: () => void;
}

const PinFormView = ({
  form,
  isSubmitting,
  onSubmit,
  onCancel,
}: Props) => {
  const { control, handleSubmit, watch } = form;
  const images = watch("images");

  return (
    <div className="z-400">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >
          {/* Name + Status */}
          <div className="flex gap-4">
            <FormField
              control={control}
              name="name"
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
              control={control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Status.ACTIVE}>
                        Active
                      </SelectItem>
                      <SelectItem value={Status.DESTROYED}>
                        Closed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Category */}
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

          {/* Latitude + Longitude */}
          <div className="flex gap-4">
            <FormField
              control={control}
              name="latitude"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      {...field}
                      className="bg-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="longitude"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      {...field}
                      className="bg-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address */}
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Images */}
          <PinImagesField form={form} />

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={images.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PinFormView;
"use client";

import { Button } from "@/components/ui/button";

type Props = {
  placeId: string;
  onDeleted: (placeId: string) => void;
};

async function deletePlace(placeId: string) {
    
  const res = await fetch(`/api/place/${placeId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Delete failed");
  }
}

const DeletePlaceButton = ({ placeId, onDeleted }: Props) => {
  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this place?");
    if (!ok) return;

    try {
      await deletePlace(placeId);
      onDeleted(placeId);
    } catch (e) {
      alert("Failed to delete place");
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeletePlaceButton;

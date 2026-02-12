"use client";

import { Button } from "@/components/ui/button";

type Props = {
  placeId: string;
  onEdit: (placeId: string) => void;
};

const EditPlaceButton = ({ placeId, onEdit }: Props) => {
  return (
    <Button variant="outline" onClick={() => onEdit(placeId)}>
      Edit
    </Button>
  );
};

export default EditPlaceButton;

import EditPlaceButton from "./edit-pin";
import DeletePlaceButton from "./delete-pin";

type Props = {
  placeId: string;
  isOwner: boolean;
  onEdit: (placeId: string) => void;
  onDeleted: (placeId: string) => void;
};

const PlaceControls = ({
  placeId,
  isOwner,
  onEdit,
  onDeleted,
}: Props) => {
  if (!isOwner) return null;

  return (
    <div className="border-t p-4 py-2 flex justify-end gap-3">
      <EditPlaceButton placeId={placeId} onEdit={onEdit} />
      <DeletePlaceButton placeId={placeId} onDeleted={onDeleted} />
    </div>
  );
};

export default PlaceControls;

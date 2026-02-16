import { Category, Status } from "./generated/prisma/enums";

export type Mode = "view" | "add" | "edit";
export type ActiveSidebar = "add" | "details" | "edit" | null;

export type LatLng = {
  lat: number;
  lng: number;
};

export type PlacePreview = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: Category;
  isActive: Status;
  thumbnail: string | null;
  address: string;
  createdBy: string; // ✅ fixed
};

export type PlaceDetails = {
  description: string | null;
  images: {
    id: string;
    url: string;
    order: number;
  }[];
} | null;


export type FullPlace = PlacePreview & {
  description: string | null;
  images: string[];
};

export type MapClientProps = {
  session: {
    user?: {
      id?: string;
    };
  } | null;
};

export type SidebarProps = {
  open: boolean;
  place: PlacePreview | null;
  onClose: () => void;
  isOwner: boolean;
  onDeleted: (placeId: string) => void;
  onEdit: (placeId: string) => void;
  placeDetails: PlaceDetails,
  setPlaceDetails: (details: PlaceDetails) => void
};


export type Latlang = {
  lat: number;
  lng: number;
};

export type PinFormProps = {
  previewPin: Latlang | null;
  onCancel: () => void;
  onPlacesUpdate: React.Dispatch<React.SetStateAction<PlacePreview[]>>;
  editPlace?: FullPlace | null;
};


export type PinSidebarProps = {
  previewPin: Latlang | null;
  open: boolean;
  onClose: () => void;
  onPlacesUpdate: React.Dispatch<React.SetStateAction<PlacePreview[]>>;
  editPlace?: FullPlace | null
};


export type MapClickHandlerProps = {
  mode: Mode;
  disabled: boolean;
  onMapClick: (latlng: Latlang) => void;
};

export type MapCameraControllerProps = {
  previewPin: Latlang | null;
  selectedPlace: PlacePreview | null;
};

export type MapViewProps = {
  mode: Mode;
  places: PlacePreview[];
  previewPin: Latlang | null;
  pendingPin: Latlang | null;
  selectedPlace: PlacePreview | null;
  onMapClick: (latlng: Latlang) => void;
  onConfirmPin: () => void;
  onCancelPin: () => void;
  onSelectPlace: (place: PlacePreview) => void;
};

export type PlacePopupProps = {
  place: PlacePreview;
  onSelect: (place: PlacePreview) => void;
};

export type ModeToggleProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

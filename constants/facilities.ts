import {
  Bath,
  Wind,
  Flame,
  Car,
  Shirt,
  BookOpen,
  Bed,
  Archive,
  Droplets,
  Utensils,
} from "lucide-react";

export const FACILITIES_LIST = [
  { id: "attached_washroom", label: "Attached Washroom", icon: Bath },
  { id: "air_conditioning", label: "Air Conditioning", icon: Wind },
  { id: "kitchen_access", label: "Kitchen Access", icon: Flame },
  { id: "parking", label: "Parking", icon: Car },
  { id: "laundry", label: "Laundry", icon: Shirt },
  { id: "study_table", label: "Personal Study Table", icon: BookOpen },
  { id: "bed_provided", label: "Bed Provided", icon: Bed },
  { id: "own_cupboard", label: "Own Cupboard", icon: Archive },
  { id: "hot_water", label: "Hot Water", icon: Droplets },
  { id: "meals_provided", label: "Meals Provided", icon: Utensils },
];

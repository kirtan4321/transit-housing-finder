import { MapExplorer } from "@/components/MapExplorer";
import { listingsBase } from "@/data/listings";
import {
  KEELE_CAMPUS,
  MARKHAM_CAMPUS,
  GLENDON_CAMPUS,
} from "@/lib/constants";

const campuses = [
  { name: "Keele Campus", ...KEELE_CAMPUS },
  { name: "Markham Campus", ...MARKHAM_CAMPUS },
  { name: "Glendon Campus", ...GLENDON_CAMPUS },
];

export default function MapPage() {
  return <MapExplorer listings={listingsBase} campuses={campuses} />;
}

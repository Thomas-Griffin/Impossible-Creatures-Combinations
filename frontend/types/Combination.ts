import type Ability from "./Ability";
import type { ResearchLevel } from "./ResearchLevel";

export default interface Combination {
  _id: string;
  Abilities?: Ability[];
  "Air Speed"?: number;
  "Animal 1"?: string;
  "Animal 2"?: string;
  Coal?: number;
  Defence?: number;
  EHP?: number;
  Electricity?: number;
  "Front Legs"?: string;
  Head?: string;
  Health?: number;
  "Land Speed"?: number;
  "Melee Damage"?: number;
  Pincers?: string;
  "Population Size"?: number;
  Power?: number;
  "Rear Legs"?: string;
  "Research Level"?: ResearchLevel;
  SDT?: number;
  "Sight Radius"?: number;
  Size?: number;
  Tail?: string;
  Torso?: string;
  "Water Speed"?: number;
  Wings?: string;
}

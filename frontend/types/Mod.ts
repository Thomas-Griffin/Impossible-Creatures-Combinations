import type { ModColumn } from "./ModColumn";

export default interface Mod {
  name: string;
  version: string;
  columns?: ModColumn[];
}

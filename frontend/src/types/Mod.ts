export interface Mod {
  name: string;
  version: string;
  columns?: [
    {
      label: string;
      type: string;
    }
  ];
}

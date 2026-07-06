declare module "react-datamaps-india" {
  import type { ComponentType, ReactNode } from "react";

  export type RegionDataValue = Record<string, unknown> & { value?: number };

  export interface MapLayout {
    title?: string;
    legendTitle?: string;
    startColor?: string;
    endColor?: string;
    hoverTitle?: string;
    noDataColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    hoverColor?: string;
  }

  export interface DatamapsIndiaProps {
    regionData?: Record<string, RegionDataValue>;
    hoverComponent?: ComponentType<{ value: RegionDataValue & { name?: string } }>;
    mapLayout?: MapLayout;
  }

  const DatamapsIndia: ComponentType<DatamapsIndiaProps>;
  export default DatamapsIndia;
}

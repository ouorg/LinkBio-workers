declare module "@phosphor-icons/react" {
  import type { FC, SVGProps } from "react";
  interface PhosphorIconProps extends SVGProps<SVGSVGElement> {
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  }
  export type Icon = FC<PhosphorIconProps>;
  export const CaretDownIcon: Icon;
  export const CheckIcon: Icon;
  export const CheckCircleIcon: Icon;
  export const WarningCircleIcon: Icon;
}
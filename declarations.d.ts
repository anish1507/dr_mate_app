// declarations.d.ts
declare module "vision-camera-code-scanner" {
  import { FrameProcessor } from "react-native-vision-camera";

  export enum BarcodeFormat {
    QR_CODE = "QR_CODE",
  }

  export type Barcode = {
    rawValue: string | null;
    displayValue: string | null;
  };

  export function useScanBarcodes(
    formats: BarcodeFormat[]
  ): [FrameProcessor, Barcode[]];
}

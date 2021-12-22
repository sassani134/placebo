import { BarcodeCapture } from './BarcodeCapture';
import { BarcodeCaptureSession } from './BarcodeCaptureSession';
export interface BarcodeCaptureListener {
    didUpdateSession?(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession): void;
    didScan?(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession): void;
}

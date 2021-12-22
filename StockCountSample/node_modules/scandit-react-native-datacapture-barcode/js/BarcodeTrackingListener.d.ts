import { BarcodeTracking } from './BarcodeTracking';
import { BarcodeTrackingSession } from './BarcodeTrackingSession';
export interface BarcodeTrackingListener {
    didUpdateSession?(barcodeTracking: BarcodeTracking, session: BarcodeTrackingSession): void;
}

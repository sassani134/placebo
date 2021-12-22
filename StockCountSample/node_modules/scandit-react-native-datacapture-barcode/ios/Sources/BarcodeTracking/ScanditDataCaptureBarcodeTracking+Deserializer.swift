/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

import Foundation
import ScanditBarcodeCapture
import ScanditDataCaptureCore

extension ScanditDataCaptureBarcodeTracking {
    func registerDeserializer() {
        let barcodeTrackingDeserializer = BarcodeTrackingDeserializer()
        barcodeTrackingDeserializer.delegate = self

        ScanditDataCaptureCore.register(modeDeserializer: barcodeTrackingDeserializer)
    }
}

extension ScanditDataCaptureBarcodeTracking: BarcodeTrackingDeserializerDelegate {
    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didStartDeserializingMode mode: BarcodeTracking,
                                     from JSONValue: JSONValue) {}

    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didFinishDeserializingMode mode: BarcodeTracking,
                                     from JSONValue: JSONValue) {
        if JSONValue.containsKey("enabled") {
            mode.isEnabled = JSONValue.bool(forKey: "enabled")
        }
        mode.addListener(self)
    }

    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didStartDeserializingSettings settings: BarcodeTrackingSettings,
                                     from JSONValue: JSONValue) {}

    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didFinishDeserializingSettings settings: BarcodeTrackingSettings,
                                     from JSONValue: JSONValue) {}

    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didStartDeserializingBasicOverlay overlay: BarcodeTrackingBasicOverlay,
                                     from JSONValue: JSONValue) {}

    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didFinishDeserializingBasicOverlay overlay: BarcodeTrackingBasicOverlay,
                                     from JSONValue: JSONValue) {
        barcodeTrackingBasicOverlay = overlay
        barcodeTrackingBasicOverlay?.delegate = self
    }

    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didStartDeserializingAdvancedOverlay overlay: BarcodeTrackingAdvancedOverlay,
                                     from JSONValue: JSONValue) {}

    func barcodeTrackingDeserializer(_ deserializer: BarcodeTrackingDeserializer,
                                     didFinishDeserializingAdvancedOverlay overlay: BarcodeTrackingAdvancedOverlay,
                                     from JSONValue: JSONValue) {
        barcodeTrackingAdvanceOverlay = overlay
        barcodeTrackingAdvanceOverlay?.delegate = self
    }
}

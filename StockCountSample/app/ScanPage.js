import React, { Component } from 'react';
import { AppState, BackHandler } from 'react-native';
import {
  BarcodeTracking,
  BarcodeTrackingBasicOverlay,
  BarcodeTrackingBasicOverlayStyle,
  BarcodeTrackingSettings,
  Symbology,
} from 'scandit-react-native-datacapture-barcode';
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  VideoResolution,
  Brush,
  Color,
  Anchor,
  PointWithUnit,
  NumberWithUnit,
  MeasureUnit,
  Feedback,
} from 'scandit-react-native-datacapture-core';

import { requestCameraPermissionsIfNeeded } from './camera-permission-handler';
import { BarcodeListView } from './BarcodeListView';
import { styles, values } from './styles';

export class ScanPage extends Component {

  constructor() {
    super();

    // Create data capture context using your license key.
    this.dataCaptureContext = DataCaptureContext.forLicenseKey('Ad8As2F1QEX8EvzGjxmkYKc2d4cODT7sQUbx2Jt4WMi/BNmFnUlvybpgYDTJZRCbIXhlKEpeEQDFYK42oV5/FeJNyiXGQbF/DiTBwE9rqrGBcHtvpkdPh5B/1WvTYtko2Wu+JmFScA+yT6+3TXAEp6dtY+aRW+RhQE8IsRl9qoUgeaOmWyGY07Vet53XQBUjPSFqwJZ6qcmmUEf6GULVtolkRHfgefQViWkeRiB/8uDQbNyKSUrtswVkhYxXWQJYSFFWpZ5nC/KXWMtRL0bNgQNglEzvL9D8bUQSbV1PurkBYOvLclEP3+NTbSfIV9ghinpIonl/6133UIsyBG0pV2ZEgCF7YGAVm3wDxi5MmTkwSbDktnmohc9ELoiaZnE8wEIqeZd5q6VDSi6fnXVJeiYtodt6Z6MYF1UB/f9xfIhJRCzTo1/JklJVduhWJgs5ynaMzch3MwwjATpW1l4g9dFhzTMDZk4W31SLO3JIWEWQdJ38cmtmBtlnySqtczhdrhO+3vUfVa8tPbxFKDA4qQmatcd4mDWbqg7cswsrFF9gCBwnH6NGfq86r7FGcpykf+HrGv/4KiPtSgpyrmnjUnsmJcGL3MS7S/b8KOhndtrgGz4CxGbVJConRk7S9c9uHSJu5rpMAZyrfChVpFmfBE2zsBClKT8omKGX5aHiL31KiLagEG1zn8B1XgP/Kw2BJ6GV5MJemb3tnrdPY2otf40u7GGqewoE8OvqsF6gesPU8dEVO+nTeSdTfpmevhfXwnCWmHwE3xxlA9FhnGg8XEa+b5sOUxWfazTB/vuxPL+leeRChJgT3obkhs4rOPJczaw7K8cc2o2roR52qTeViAqZIfsLORyV89m9DsEPSkhM2XepCmtBm2QaENKIJwlPTcFonsGNNT73QktP4hUB2eb41s6aVTLvQxiByPw78s5GGC/oxmfOD1ysNCfNxfYoUF7Y0nBJt9htougAhQciyrASyRZ0kYfKoWu96ZdCJ2gMQ01T5dLqZEYwiRnlTidMpVJJOrHfSNaRu+kthWqTn9nr80lVrYE0neVsC2tr0jEP37MbrHasEtUWUi9bQrqpK1DH8w7jQU2o95okonC33Us1fquwZDojvI98WNkbCSyBlOYUBbbEy9icH3313h7EnLjxB6Rrq17/ZWIt936l1518J+dj2sbfgxguGiGZk9Te6Dy20Y8+y0j0hTJHeEIL');
    this.viewRef = React.createRef();

    this.onCaptureResults = this.onCaptureResults.bind(this);
    this.onCardPress = this.onCardPress.bind(this);
    this.onClearPress = this.onClearPress.bind(this);

    // Store results that the barcode scanner is capturing.
    this.results = {};

    this.state = {
      show: false,
      capturedResults: {} // The scan results that will be passed to the barcode list view.
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.setupScanning();

    // Keep Scandit logo visible on screen when scanning.
    this.viewRef.current.logoAnchor = Anchor.BottomRight;
    this.viewRef.current.logoOffset = this.logoOffset();

    this.props.navigation.addListener('focus', () => {
      this.results = {};
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.dataCaptureContext.dispose();
  }

  handleAppStateChange = async (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.stopCapture();
    } else {
      this.startCapture();
    }
  }

  startCapture() {
    this.startCamera();
    this.barcodeTracking.isEnabled = true;
  }

  stopCapture() {
    this.barcodeTracking.isEnabled = false;
    this.stopCamera();
  }

  stopCamera() {
    if (this.camera) {
      this.camera.switchToDesiredState(FrameSourceState.Off);
    }
  }

  startCamera() {
    if (!this.camera) {
      // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
      // default and must be turned on to start streaming frames to the data capture context for recognition.
      this.camera = Camera.default;
      this.dataCaptureContext.setFrameSource(this.camera);

      const cameraSettings = new CameraSettings();
      cameraSettings.preferredResolution = VideoResolution.FullHD;
      this.camera.applySettings(cameraSettings);
    }

    // Switch camera on to start streaming frames and enable the barcode tracking mode.
    // The camera is started asynchronously and will take some time to completely turn on.
    requestCameraPermissionsIfNeeded()
      .then(() => this.camera.switchToDesiredState(FrameSourceState.On))
      .catch(() => BackHandler.exitApp());
  }

  setupScanning() {
    // The barcode tracking process is configured through barcode tracking settings
    // which are then applied to the barcode tracking instance that manages barcode tracking.
    const settings = new BarcodeTrackingSettings();

    // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
    // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
    // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
    settings.enableSymbologies([
      Symbology.EAN13UPCA,
      Symbology.EAN8,
      Symbology.UPCE,
      Symbology.Code39,
      Symbology.Code128,
      Symbology.DataMatrix,
    ]);

    // Create new barcode tracking mode with the settings from above.
    this.barcodeTracking = BarcodeTracking.forContext(this.dataCaptureContext, settings);

    // Register a listener to get informed whenever a new barcode is tracked.
    this.barcodeTrackingListener = {
      didUpdateSession: (_, session) => {
        this.results = {};
        Object.values(session.trackedBarcodes).forEach(trackedBarcode => {
          const { data, symbology } = trackedBarcode.barcode;
          this.results[data] = { data, symbology };
        });
      }
    };

    this.barcodeTracking.addListener(this.barcodeTrackingListener);

    // Add a barcode tracking overlay to the data capture view to render the location of captured barcodes on top of
    // the video preview. This is optional, but recommended for better visual feedback.
    const overlay = BarcodeTrackingBasicOverlay.withBarcodeTrackingForViewWithStyle(
        this.barcodeTracking,
        this.viewRef.current,
        BarcodeTrackingBasicOverlayStyle.Frame
    );

    // Implement the BarcodeTrackingBasicOverlayListener interface. 
    // The method BarcodeTrackingBasicOverlayListener.brushForTrackedBarcode() is invoked every time a new tracked 
    // barcode appears and it can be used to set a brush that will highlight that specific barcode in the overlay.
    overlay.listener = {
      brushForTrackedBarcode: (overlay, trackedBarcode) => new Brush(
        Color.fromRGBA(255, 255, 255, 0),
        Color.fromRGBA(255, 255, 255, 1),
        3
      )
    };
  }

  logoOffset() {
    return new PointWithUnit(
        new NumberWithUnit(0, MeasureUnit.Pixel),
        new NumberWithUnit(-values.cardMinHeight, MeasureUnit.DIP)
    );
  }

  onCaptureResults() {
    // Do nothing when the card is expanded.
    if (this.state.show) {
      return;
    }

    if (Object.keys(this.results).length !== 0) {
      Feedback.defaultFeedback.emit();
    }

    this.setState({
      capturedResults: Object.assign({}, this.results)
    })
    this.results = {};
  }

  onCardPress() {
    if (this.state.show) {
      this.startCapture();
    } else {
      this.stopCapture();
    }

    this.setState({
      show: !this.state.show
    })
  }

  onClearPress() {
    this.startCapture();
    this.setState({
      show: false
    })
  }

  render() {
    const { show, capturedResults } = this.state;
    return (
      <>
        <DataCaptureView style={styles.scanContainer} context={this.dataCaptureContext} ref={this.viewRef} />
        <BarcodeListView
          show={show}
          results={capturedResults}
          onCaptureResults={this.onCaptureResults}
          onClearPress={this.onClearPress}
          onCardPress={this.onCardPress}
        />
      </>
    );
  };
}

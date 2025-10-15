import React from 'react';
import {
  Alert,
  Button,
  PageSection,
} from '@patternfly/react-core';
import { useDesignControls } from "../../hooks/useDesignControls";
import { Device } from '../../types/device';

interface DeviceSuspendedBannerProps {
  device: Device;
  onResumeDevice: () => void;
  onViewSuspendedDevices?: () => void;
}

const DeviceSuspendedBanner: React.FC<DeviceSuspendedBannerProps> = ({
  device,
  onResumeDevice,
  onViewSuspendedDevices = () => console.log('Navigate to suspended devices'),
}) => {
  const { getSetting } = useDesignControls();
  const showPostRestoreBanner = getSetting("showPostRestoreBanner");

  // Check if device is suspended
  const isSuspended = device.status === 'SUSPENDED';

  // Don't show if:
  // - The device is not suspended, OR
  // - The design control toggle is off
  if (!isSuspended || !showPostRestoreBanner) {
    return null;
  }

  return (
    <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
      <Alert
        variant="danger"
        title="Device suspended"
        actionLinks={
          <>
            <Button variant="link" onClick={onResumeDevice}>
              Resume Device
            </Button>
            <Button variant="link" onClick={onViewSuspendedDevices}>
              View Suspended Devices
            </Button>
          </>
        }
      >
        <p>
          This device's configuration is newer than the server's record, likely due to a recent system restore.
          It is protected from receiving outdated updates but will remain suspended until you resume it.
        </p>
        <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
          Warning: Please review this device's configuration before taking action. Resuming a device will cause
          it to apply the current specification, which may be older than what is on the device.
        </p>
      </Alert>
    </PageSection>
  );
};

export default DeviceSuspendedBanner;


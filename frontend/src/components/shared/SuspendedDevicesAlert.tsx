import React from 'react';
import {
  Alert,
  Button,
} from '@patternfly/react-core';

interface SuspendedDevicesAlertProps {
  suspendedCount: number;
  onViewSuspendedDevices: () => void;
}

const SuspendedDevicesAlert: React.FC<SuspendedDevicesAlertProps> = ({
  suspendedCount,
  onViewSuspendedDevices
}) => {
  if (suspendedCount === 0) {
    return null;
  }

  return (
    <Alert
      variant="danger"
      title="Suspended Devices Detected"
      isInline
      actionLinks={
        <Button variant="link" onClick={onViewSuspendedDevices}>
          View Suspended Devices
        </Button>
      }
    >
      <p>
        {suspendedCount} device{suspendedCount !== 1 ? 's are' : ' is'} suspended because their local configuration is newer than the server's record. These devices will not receive updates until they are resumed.
      </p>
      <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
        Warning: Please review this fleet's configuration before taking action. Resuming a device will cause it to apply the current specification, which may be older than what is on the device.
      </p>
    </Alert>
  );
};

export default SuspendedDevicesAlert;
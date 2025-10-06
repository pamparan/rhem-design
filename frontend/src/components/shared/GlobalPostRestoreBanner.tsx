import React from 'react';
import {
  Alert,
} from '@patternfly/react-core';

interface GlobalPostRestoreBannerProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

const GlobalPostRestoreBanner: React.FC<GlobalPostRestoreBannerProps> = ({
  isVisible,
  onDismiss,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Alert
      variant="warning"
      title="System recovery complete"
      isInline
    >
      RHEM is waiting for devices to connect and report their status. Some devices may require manual action to resume operation.
    </Alert>
  );
};

export default GlobalPostRestoreBanner;
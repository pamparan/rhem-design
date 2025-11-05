import React from 'react';
import {
  Alert,
  Button,
  PageSection,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { useDesignControls } from "../../hooks/useDesignControls";
import { mockDevices } from '../../data/mockData';
import { getSuspendedDevicesCount } from '../../utils/deviceUtils';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';

interface PostRestoreBannersProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const PostRestoreBanners: React.FC<PostRestoreBannersProps> = ({
  onNavigate,
}) => {
  const { getSetting } = useDesignControls();
  const showPostRestoreBanner = getSetting("showPostRestoreBanner");

  // Calculate suspended devices count
  const suspendedCount = getSuspendedDevicesCount(mockDevices);

  // Don't show anything if the design control toggle is off
  if (!showPostRestoreBanner) {
    return null;
  }

  return (
    <PageSection style={{ paddingTop: 0, paddingBottom: '8px' }}>
      <Stack hasGutter>
        {/* Warning Banner - System Recovery Complete */}
        <StackItem>
          <Alert
            variant="warning"
            title="System recovery complete"
            isInline
          >
            Flight Control is waiting for devices to connect and report their status. Some devices may require manual action to resume operation.
          </Alert>
        </StackItem>

        {/* Danger Alert - Suspended Devices (only show if there are suspended devices) */}
        {suspendedCount > 0 && (
          <StackItem>
            <Alert
              variant="danger"
              title="Suspended Devices Detected"
              isInline
              actionLinks={
                <Button variant="link" onClick={() => onNavigate('suspended-devices')}>
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
          </StackItem>
        )}
      </Stack>
    </PageSection>
  );
};

export default PostRestoreBanners;


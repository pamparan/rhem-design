import React from 'react';
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@patternfly/react-core';
import {
  ExternalLinkAltIcon
} from '@patternfly/react-icons';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceModal: React.FC<DeviceModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader title="Add devices" />
      <ModalBody>
        <div style={{ lineHeight: '1.6' }}>
          <p style={{ marginBottom: '24px', color: '#6a6e73' }}>
            Follow these steps to add new devices to your fleet:
          </p>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '12px', fontWeight: '600' }}>1. Download the archive</h4>
            <p style={{ marginBottom: '12px', color: '#6a6e73' }}>
              Download the device configuration archive containing the necessary files and certificates.
            </p>
            <Button variant="link" style={{ padding: 0, color: '#06c' }}>
              Download device archive <ExternalLinkAltIcon style={{ marginLeft: '4px' }} />
            </Button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '12px', fontWeight: '600' }}>2. Prepare your device</h4>
            <p style={{ marginBottom: '12px', color: '#6a6e73' }}>
              Extract the archive and run the following command on your target device:
            </p>
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '12px'
            }}>
              sudo ./flightctl-device-agent --config device-config.yaml
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '12px', fontWeight: '600' }}>3. Boot and verify</h4>
            <p style={{ color: '#6a6e73' }}>
              Restart your device to apply the configuration. The device should appear in the device list within a few minutes
              and report a "Pending sync" status until it successfully connects to Flight Control.
            </p>
          </div>

          <div style={{
            backgroundColor: '#f0f8ff',
            border: '1px solid #b3d9ff',
            borderRadius: '4px',
            padding: '16px',
            marginTop: '24px'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>Need help?</strong> Visit our{' '}
              <Button variant="link" style={{ padding: 0, fontSize: '14px', color: '#06c' }}>
                troubleshooting guide <ExternalLinkAltIcon style={{ marginLeft: '4px' }} />
              </Button>{' '}
              for common device setup issues.
            </p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeviceModal;
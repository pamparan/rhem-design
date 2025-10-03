import React from 'react';
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@patternfly/react-core';

interface ResumeDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deviceName?: string;
  deviceCount?: number;
  isLoading?: boolean;
}

const ResumeDeviceModal: React.FC<ResumeDeviceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deviceName,
  deviceCount,
  isLoading = false
}) => {
  const isBulkAction = typeof deviceCount === 'number' && deviceCount > 1;
  const title = isBulkAction ? 'Resume Devices?' : 'Resume Device?';

  const getBodyText = () => {
    if (isBulkAction) {
      return `You are about to resume ${deviceCount} suspended devices.`;
    } else if (deviceName) {
      return `You are about to resume ${deviceName}.`;
    } else {
      return 'You are about to resume this device.';
    }
  };

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader title={title} />
      <ModalBody>
        <p>
          {getBodyText()}
        </p>
        <p style={{ marginTop: '16px' }}>
          This will resolve the configuration conflict and allow the device{isBulkAction ? 's' : ''} to receive new updates from the server. This action is irreversible, please ensure the device{isBulkAction ? 's\'' : '\'s'} assigned configuration is correct before proceeding.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          onClick={onConfirm}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {isBulkAction ? 'Resume All' : 'Resume'}
        </Button>
        <Button
          variant="link"
          onClick={onClose}
          isDisabled={isLoading}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ResumeDeviceModal;
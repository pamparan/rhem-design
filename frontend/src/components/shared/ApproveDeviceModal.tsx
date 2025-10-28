import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  TextInput,
  ValidatedOptions,
} from '@patternfly/react-core';
import EditableLabels from './EditableLabels';

interface ApproveDeviceModalProps {
  onClose: () => void;
  onApprove: (deviceId: string, alias: string, labels: string[]) => void;
  deviceId: string;
  deviceName: string;
  defaultAlias?: string;
  isLoading?: boolean;
}

interface Fleet {
  name: string;
  matchLabels: Record<string, string>;
}

// Mock fleet data - in a real app, this would come from props or API
const mockFleets: Fleet[] = [
  {
    name: 'Fitting Room',
    matchLabels: { type: 'fitting-room' }
  },
  {
    name: 'Production',
    matchLabels: { env: 'production' }
  },
  {
    name: 'Development',
    matchLabels: { env: 'development' }
  }
];

const ApproveDeviceModal: React.FC<ApproveDeviceModalProps> = ({
  onClose,
  onApprove,
  deviceId,
  deviceName,
  defaultAlias = '',
  isLoading = false,
}) => {
  const [alias, setAlias] = useState(defaultAlias);
  const [labels, setLabels] = useState<string[]>([]);
  const [matchedFleet, setMatchedFleet] = useState<Fleet | null>(null);

  useEffect(() => {
    // Convert labels array to key-value map for fleet matching
    const labelsMap: Record<string, string> = {};
    labels.forEach(label => {
      const split = label.split('=');
      if (split.length === 2) {
        labelsMap[split[0]] = split[1];
      }
    });

    // Check if labels match any fleet
    const matchingFleet = mockFleets.find(fleet => {
      const fleetLabelEntries = Object.entries(fleet.matchLabels);
      return fleetLabelEntries.every(([key, value]) => labelsMap[key] === value);
    });
    setMatchedFleet(matchingFleet || null);
  }, [labels]);

  const handleApprove = () => {
    onApprove(deviceId, alias, labels);
  };

  return (
    <Modal
      variant={ModalVariant.medium}
      isOpen
      onClose={onClose}
    >
      <ModalHeader title="Approve pending device" />
      <ModalBody>
        <Form>
          <FormGroup label="Alias" fieldId="device-alias">
            <TextInput
              id="device-alias"
              value={alias}
              onChange={(_event, value) => setAlias(value)}
              placeholder="Enter device alias"
            />
          </FormGroup>

          <FormGroup label="Name" fieldId="device-name">
            <TextInput
              id="device-name"
              value={deviceName}
              readOnlyVariant="default"
              style={{ fontFamily: 'monospace' }}
            />
          </FormGroup>

          <FormGroup label="Labels" fieldId="device-labels">
            <EditableLabels
              value={labels}
              onChange={setLabels}
              isDisabled={isLoading}
            />
          </FormGroup>

          <FormGroup label="Fleet name" fieldId="fleet-name">
            <TextInput
                value={matchedFleet ? matchedFleet.name : ''}
                type="text"
                validated={matchedFleet ? ValidatedOptions.success : undefined}
                readOnlyVariant="default"
                placeholder="Add labels to select a fleet"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          onClick={handleApprove}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Approve
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

export default ApproveDeviceModal;


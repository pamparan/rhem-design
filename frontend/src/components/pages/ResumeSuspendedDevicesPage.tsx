import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Alert,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import {
  FilterIcon
} from '@patternfly/react-icons';
import { mockDevices } from '../../data/mockData';
import { Device, DeviceStatus } from '../../types/device';
import { getStatusColor, getStatusLabel, getStatusIcon, getFilteredDevices, getStatusLabelStyle } from '../../utils/deviceUtils';

interface ResumeSuspendedDevicesPageProps {
  onBack: () => void;
}

const ResumeSuspendedDevicesPage: React.FC<ResumeSuspendedDevicesPageProps> = ({ onBack }) => {
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'fleet' | 'location'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [resumeAction, setResumeAction] = useState<'all' | 'selected'>('all');
  const [isResuming, setIsResuming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resumedCount, setResumedCount] = useState(0);

  // Get only suspended devices
  const suspendedDevices = mockDevices.filter(device => device.status === 'SUSPENDED');

  const handleSelectAll = (isSelected: boolean) => {
    setIsAllSelected(isSelected);
    if (isSelected) {
      setSelectedDevices(new Set(suspendedDevices.map(device => device.id)));
    } else {
      setSelectedDevices(new Set());
    }
  };

  const handleSelectDevice = (deviceId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedDevices);
    if (isSelected) {
      newSelected.add(deviceId);
    } else {
      newSelected.delete(deviceId);
    }
    setSelectedDevices(newSelected);
    setIsAllSelected(newSelected.size === suspendedDevices.length);
  };

  const handleResumeAll = () => {
    setResumeAction('all');
    setIsConfirmModalOpen(true);
  };

  const handleResumeSelected = () => {
    if (selectedDevices.size === 0) return;
    setResumeAction('selected');
    setIsConfirmModalOpen(true);
  };

  const confirmResume = async () => {
    setIsResuming(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const count = resumeAction === 'all' ? suspendedDevices.length : selectedDevices.size;
    setResumedCount(count);

    console.log(`Resuming ${count} suspended devices`);

    setIsResuming(false);
    setIsConfirmModalOpen(false);
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onBack(); // Navigate back to devices page
  };

  const getConfirmationText = () => {
    const count = resumeAction === 'all' ? suspendedDevices.length : selectedDevices.size;
    return `You are about to resume ${count} suspended device${count !== 1 ? 's' : ''}. This action is irreversible and will allow all affected devices to receive new configuration updates from the server.`;
  };

  return (
    <>
      {/* Header */}
      <PageSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Button variant="link" onClick={onBack} style={{ padding: 0, marginBottom: '8px' }}>
              ← Back
            </Button>
            <Title headingLevel="h1" size="2xl">
              Resume Suspended Devices
            </Title>
            <div style={{ marginTop: '16px' }}>
              <p>
                Following a system restore, devices have been identified with configurations newer than the server's records.
                To prevent data loss, they have been suspended from receiving updates.
              </p>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Primary Actions */}
      <PageSection style={{ paddingTop: 0 }}>
        <Card>
          <CardBody>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
              Primary Action (Mass Resumption)
            </Title>
            <p style={{ marginBottom: '16px' }}>
              <strong>Resume all ({suspendedDevices.length}) suspended devices</strong>
            </p>
            <p style={{ marginBottom: '24px', color: '#6a6e73' }}>
              This will allow all suspended devices to begin receiving new configuration updates. This is the recommended action for most recovery scenarios.
            </p>
            <Button variant="primary" size="lg" onClick={handleResumeAll}>
              Resume All Devices
            </Button>
          </CardBody>
        </Card>
      </PageSection>

      {/* Secondary Actions */}
      <PageSection style={{ paddingTop: 0 }}>
        <Card>
          <CardBody>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
              Secondary Action (Manual Review)
            </Title>
            <p style={{ marginBottom: '24px', color: '#6a6e73' }}>
              Alternatively, you can filter by labels or fleet to bulk select specific devices within certain parameters.
            </p>

            {/* Toolbar */}
            <Toolbar style={{ marginBottom: '16px' }}>
              <ToolbarContent>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Select
                      isOpen={isFilterOpen}
                      selected={filterBy}
                      onSelect={(_event, value) => {
                        setFilterBy(value as 'all' | 'fleet' | 'location');
                        setIsFilterOpen(false);
                      }}
                      onOpenChange={setIsFilterOpen}
                      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                        <MenuToggle ref={toggleRef} onClick={() => setIsFilterOpen(!isFilterOpen)} icon={<FilterIcon />}>
                          Filter by: {filterBy === 'all' ? 'All' : filterBy === 'fleet' ? 'Fleet' : 'Location'}
                        </MenuToggle>
                      )}
                    >
                      <SelectList>
                        <SelectOption value="all">All</SelectOption>
                        <SelectOption value="fleet">Fleet</SelectOption>
                        <SelectOption value="location">Location</SelectOption>
                      </SelectList>
                    </Select>
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup align={{ default: 'alignEnd' }}>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      onClick={handleResumeSelected}
                      isDisabled={selectedDevices.size === 0}
                    >
                      Resume Selected ({selectedDevices.size})
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>

            {/* Device Table */}
            <Table aria-label="Suspended devices list" variant="compact">
              <Thead>
                <Tr>
                  <Th>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </Th>
                  <Th>Alias</Th>
                  <Th>Name</Th>
                  <Th>Fleet</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th>Config Version</Th>
                  <Th>Last Seen</Th>
                </Tr>
              </Thead>
              <Tbody>
                {suspendedDevices.map((device) => (
                  <Tr key={device.id}>
                    <Td>
                      <input
                        type="checkbox"
                        checked={selectedDevices.has(device.id)}
                        onChange={(e) => handleSelectDevice(device.id, e.target.checked)}
                      />
                    </Td>
                    <Td>{device.alias || 'Device alias'}</Td>
                    <Td style={{ fontFamily: 'monospace' }}>{device.name}</Td>
                    <Td>
                      {device.fleet ? (
                        <Button variant="link" style={{ color: '#06c', padding: 0 }}>
                          {device.fleet}
                        </Button>
                      ) : '--'}
                    </Td>
                    <Td>{device.location}</Td>
                    <Td>
                      <div
                        style={{
                          backgroundColor: getStatusLabelStyle(device.status).backgroundColor,
                          color: getStatusLabelStyle(device.status).color,
                          border: `1px solid ${getStatusLabelStyle(device.status).borderColor}`,
                          padding: '4px 8px',
                          borderRadius: '16px',
                          fontWeight: '500',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          lineHeight: '1.2',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {React.createElement(getStatusIcon(device.status), { style: { fontSize: '12px', color: getStatusLabelStyle(device.status).color } })}
                        {getStatusLabel(device.status)}
                      </div>
                    </Td>
                    <Td>{device.configVersion || '--'}</Td>
                    <Td>{device.lastSeen}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>

      {/* Confirmation Modal */}
      <Modal
        variant={ModalVariant.medium}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <ModalHeader title={`Resume ${resumeAction === 'all' ? 'all' : 'selected'} devices?`} />
        <ModalBody>
          <p>{getConfirmationText()}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="primary"
            onClick={confirmResume}
            isLoading={isResuming}
            isDisabled={isResuming}
          >
            {resumeAction === 'all' ? `Resume All ${suspendedDevices.length}` : `Resume ${selectedDevices.size} Selected`}
          </Button>
          <Button
            variant="link"
            onClick={() => setIsConfirmModalOpen(false)}
            isDisabled={isResuming}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Success Modal */}
      <Modal
        variant={ModalVariant.small}
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
      >
        <ModalHeader title="Devices Resumed" />
        <ModalBody>
          <p>
            {resumedCount} device{resumedCount !== 1 ? 's were' : ' was'} resumed successfully.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={handleSuccessModalClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ResumeSuspendedDevicesPage;
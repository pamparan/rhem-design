import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Label,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  Alert,
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
  EllipsisVIcon
} from '@patternfly/react-icons';
import ResumeDeviceModal from '../shared/ResumeDeviceModal';
import GlobalPostRestoreBanner from '../shared/GlobalPostRestoreBanner';
import { mockDevices } from '../../data/mockData';
import { getSuspendedDevicesCount } from '../../utils/deviceUtils';

// Mock fleet data for prototype
const mockFleets = [
  { id: '1', name: 'Fitting Room Devices', systemImage: 'github.com/flightctl/flightctl-demos @ main', upToDate: 125, total: 200, status: 'Valid' },
  { id: '2', name: 'Warehouse name', systemImage: 'Local', upToDate: 125, total: 340, status: 'Selector overlap' },
  { id: '3', name: 'Store Devices', systemImage: 'github.com/flightctl/flightctl-demos @ main', upToDate: 217, total: 217, status: 'Valid' },
  { id: '4', name: 'Office Devices', systemImage: 'github.com/flightctl/flightctl-demos @ main', upToDate: 217, total: 217, status: 'Valid' },
];

interface FleetsPageProps {
  onNavigateToSuspendedDevices?: () => void;
  showPostRestoreBanner?: boolean;
  onDismissPostRestoreBanner?: () => void;
  onNavigateToDevices?: () => void;
  onFleetClick?: (fleetId: string) => void;
}

const FleetsPage: React.FC<FleetsPageProps> = ({
  onNavigateToSuspendedDevices = () => console.log('Navigate to suspended devices'),
  showPostRestoreBanner = false,
  onDismissPostRestoreBanner = () => console.log('Dismiss banner'),
  onNavigateToDevices = () => console.log('Navigate to devices'),
  onFleetClick = () => console.log('Navigate to fleet details')
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  // Calculate suspended devices in current fleet (for demonstration, we'll use all suspended devices)
  const suspendedCount = getSuspendedDevicesCount(mockDevices);

  const handleResumeAll = () => {
    setIsResumeModalOpen(true);
  };

  const confirmResumeAll = async () => {
    setIsResuming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`Resuming ${suspendedCount} devices in fleet`);

    setIsResuming(false);
    setIsResumeModalOpen(false);
  };

  return (
    <>
      {/* Header */}
      <PageSection >
        <Title headingLevel="h1" size="2xl">
          Fleets
        </Title>
      </PageSection>

      {/* Global Post-Restore Banner */}
      {showPostRestoreBanner && (
        <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
          <GlobalPostRestoreBanner
            isVisible={showPostRestoreBanner}
            onDismiss={onDismissPostRestoreBanner}
            onViewDevices={onNavigateToDevices}
          />
        </PageSection>
      )}

      {/* Suspended Devices Alert */}
      {suspendedCount > 0 && (
        <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
          <Alert
            variant="danger"
            title="Suspended Devices Detected"
            isInline
            actionLinks={
              <>
                <Button variant="link" onClick={handleResumeAll}>
                  Resume All
                </Button>
                <Button variant="link" onClick={onNavigateToSuspendedDevices}>
                  View All Suspended Devices
                </Button>
              </>
            }
          >
            <p>
              <strong>{suspendedCount} devices in this fleet</strong> are suspended because their local configuration is newer than the server's record. They are currently protected from receiving this fleet's updates.
            </p>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
              Warning: Please review this fleet's configuration before taking action. Resuming a device will cause it to apply the current specification, which may be older than what is on the device.
            </p>
          </Alert>
        </PageSection>
      )}

      {/* Main Content */}
      <PageSection>
        <Card>
          <CardBody>
            {/* Toolbar */}
            <Toolbar>
              <ToolbarContent>
                <ToolbarGroup>
                  <ToolbarItem>
                    <SearchInput
                      placeholder="Search by name"
                      value={searchValue}
                      onChange={(_event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                      style={{ width: '300px' }}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup align={{ default: 'alignEnd' }}>
                  <ToolbarItem>
                    <Button variant="primary">Create fleet</Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="secondary">Import fleets</Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="control">Actions</Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>

            {/* Fleet Table */}
            <Table aria-label="Fleet list" variant="compact">
              <Thead>
                <Tr>
                  <Th width={10}></Th>
                  <Th>Name</Th>
                  <Th>System image</Th>
                  <Th>Up-to-date/devices</Th>
                  <Th>Status</Th>
                  <Th width={10}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockFleets.map((fleet, index) => (
                  <Tr key={fleet.id}>
                    <Td>
                      <input type="checkbox" />
                    </Td>
                    <Td>
                      <Button
                        variant="link"
                        style={{ color: '#06c', padding: 0 }}
                        onClick={() => onFleetClick(fleet.id)}
                      >
                        {fleet.name}
                      </Button>
                    </Td>
                    <Td style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                      {fleet.systemImage}
                    </Td>
                    <Td>
                      <span style={{ color: index === 1 ? '#c9190b' : '#3e8635' }}>
                        {fleet.upToDate}
                      </span>
                      <span style={{ color: '#6a6e73' }}>/{fleet.total}</span>
                    </Td>
                    <Td>
                      {fleet.status === 'Valid' ? (
                        <Label color="green">● Valid</Label>
                      ) : (
                        <Label color="orange">⚠ Selector overlap</Label>
                      )}
                    </Td>
                    <Td>
                      <Button
                        variant="plain"
                        onClick={() => alert(`Fleet options for ${fleet.name}`)}
                      >
                        <EllipsisVIcon />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>

      {/* Resume All Devices Modal */}
      <ResumeDeviceModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onConfirm={confirmResumeAll}
        deviceCount={suspendedCount}
        isLoading={isResuming}
      />
    </>
  );
};

export default FleetsPage;
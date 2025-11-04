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
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  MenuToggleElement,
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
import PostRestoreBanners from '../shared/PostRestoreBanners';
import { mockDevices, mockFleets } from '../../data/mockData';
import { getSuspendedDevicesCount } from '../../utils/deviceUtils';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';
import FleetDeviceCount from '../shared/FleetDeviceCount';

interface FleetsPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const FleetsPage: React.FC<FleetsPageProps> = ({
  onNavigate,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [openMenuFleetId, setOpenMenuFleetId] = useState<string | null>(null);

  // Calculate suspended devices in current fleet (for demonstration, we'll use all suspended devices)
  const suspendedCount = getSuspendedDevicesCount(mockDevices);

  const confirmResumeAll = async () => {
    setIsResuming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log(`Resuming ${suspendedCount} devices in fleet`);

    setIsResuming(false);
    setIsResumeModalOpen(false);
  };

  const handleViewFleetDetails = (fleetId: string) => {
    onNavigate('fleet-details', 'fleets', { fleetId });
    setOpenMenuFleetId(null);
  };

  return (
    <>
      {/* Header */}
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Fleets
        </Title>
      </PageSection>

      <PostRestoreBanners onNavigate={onNavigate} />

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
                    <Button variant="control">Delete fleets</Button>
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
                {mockFleets.map((fleet) => {
                  const fleetDevices = mockDevices.filter(device => device.fleet === fleet.name);
                  const fleetUpToDate = fleetDevices.filter(device => device.systemUpdateStatus === 'UP_TO_DATE').length;
                  const fleetTotal = fleetDevices.length;
                      
                  return (
                  <Tr key={fleet.id}>
                    <Td>
                      <input type="checkbox" />
                    </Td>
                    <Td>
                      <Button
                        variant="link"
                        style={{ padding: 0 }}
                        onClick={() => onNavigate('fleet-details', 'fleets', { fleetId: fleet.id })}
                      >
                        {fleet.name}
                      </Button>
                    </Td>
                    <Td style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                      {fleet.systemImage}
                    </Td>
                    <Td>
                      <span style={{ color: fleetUpToDate === fleetTotal ? '#3e8635' : '#f0ab00' }}>
                        {fleetUpToDate}
                      </span>
                      <span style={{ color: '#6a6e73' }}>/{fleetTotal}</span>
                    </Td>
                    <Td>
                      <Label
                        variant='outline'
                        status={fleet.status === 'Valid' ? 'success' : 'danger'}
                      >
                        {fleet.status}
                      </Label>
                    </Td>
                    <Td>
                      <Dropdown
                        isOpen={openMenuFleetId === fleet.id}
                        onSelect={() => setOpenMenuFleetId(null)}
                        onOpenChange={(isOpen) => setOpenMenuFleetId(isOpen ? fleet.id : null)}
                        popperProps={{
                          position: 'right',
                          enableFlip: false,
                          appendTo: () => document.body
                        }}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                          <MenuToggle
                            ref={toggleRef}
                            variant="plain"
                            onClick={() => setOpenMenuFleetId(openMenuFleetId === fleet.id ? null : fleet.id)}
                            isExpanded={openMenuFleetId === fleet.id}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem
                            key="view-details"
                            onClick={() => handleViewFleetDetails(fleet.id)}
                          >
                            View fleet details
                          </DropdownItem>
                          <DropdownItem
                            key="edit-config"
                          >
                            Edit fleet configuration
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                          >
                            Delete fleet
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </Td>
                  </Tr>
                  );
                })}
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
import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  SearchInput,
  MenuToggle,
  Dropdown,
  DropdownList,
  DropdownItem,
  Checkbox,
  Popover,
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
  FilterIcon,
  EllipsisVIcon,
  OutlinedQuestionCircleIcon
} from '@patternfly/react-icons';
import PostRestoreBanners from '../shared/PostRestoreBanners';
import ResumeDeviceModal from '../shared/ResumeDeviceModal';
import ApproveDeviceModal from '../shared/ApproveDeviceModal';
import { mockDevices, mockDevicesPendingApproval, mockFleets } from '../../data/mockData';
import { Device, DeviceStatus } from '../../types/device';
import { getStatusLabel, getStatusIcon, isDeviceResumable, getStatusLabelStyle } from '../../utils/deviceUtils';
import { 
  deviceStatusItems, 
  applicationStatusItems, 
  systemUpdateStatusItems,
  createCountMap,
  generateFilterOptions 
} from '../../utils/fleetUtils';
import { useDesignControls } from '../../hooks/useDesignControls';
import { useDeviceStatusesCount } from '../../hooks/useDeviceStatusesCount';
import { NavigationItemId, ViewType, NavigationParams } from '../../types/app';

interface DevicesPageProps {
  onAddDeviceClick: () => void;
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const DevicesPage: React.FC<DevicesPageProps> = ({
  onAddDeviceClick,
  onNavigate,
}) => {
  const { getSetting } = useDesignControls();
  const showDevicesPendingApproval = getSetting('showDevicesPendingApproval');
  const pendingDevices = showDevicesPendingApproval ? mockDevicesPendingApproval : [];
  
  const [searchValue, setSearchValue] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [deviceToResume, setDeviceToResume] = useState<Device | null>(null);
  const [isResuming, setIsResuming] = useState(false);
  const [kebabOpenStates, setKebabOpenStates] = useState<Record<string, boolean>>({});
  const [selectedFilters, setSelectedFilters] = useState<{
    deviceStatus: Set<DeviceStatus>;
    applicationStatus: Set<string>;
    systemUpdateStatus: Set<string>;
  }>({
    deviceStatus: new Set(),
    applicationStatus: new Set(),
    systemUpdateStatus: new Set(),
  });
  const [selectedPendingDevices, setSelectedPendingDevices] = useState<Set<string>>(new Set());
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [deviceToApprove, setDeviceToApprove] = useState<{ id: string; name: string; alias?: string } | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const { deviceStatusChartData, appStatusChartData, systemUpdateChartData } = useDeviceStatusesCount(mockDevices);

  // Enhanced filtering logic with multi-select
  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchValue.toLowerCase()) ||
                         (device.alias && device.alias.toLowerCase().includes(searchValue.toLowerCase()));

    const matchesDeviceStatus = selectedFilters.deviceStatus.size === 0 ||
                               selectedFilters.deviceStatus.has(device.status);

    const matchesApplicationStatus = selectedFilters.applicationStatus.size === 0 ||
                                   selectedFilters.applicationStatus.has(device.applicationStatus);

    const matchesSystemUpdateStatus = selectedFilters.systemUpdateStatus.size === 0 ||
                                    selectedFilters.systemUpdateStatus.has(device.systemUpdateStatus);

    return matchesSearch && matchesDeviceStatus && matchesApplicationStatus && matchesSystemUpdateStatus;
  });

  // Generate filter options from hook data
  const filterOptions = {
    deviceStatus: generateFilterOptions(deviceStatusItems, createCountMap(deviceStatusChartData)),
    applicationStatus: generateFilterOptions(applicationStatusItems, createCountMap(appStatusChartData)),
    systemUpdateStatus: generateFilterOptions(systemUpdateStatusItems, createCountMap(systemUpdateChartData)),
  };

  const handleFilterChange = (category: 'deviceStatus' | 'applicationStatus' | 'systemUpdateStatus', value: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      if (checked) {
        newFilters[category].add(value as any);
      } else {
        newFilters[category].delete(value as any);
      }
      return newFilters;
    });
  };

  const handleDeviceClick = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    onNavigate('device-details', 'devices', { deviceId  });
  };

  const handleFleetClick = (fleetName: string) => {
    // Find fleet by name to get its ID
    const fleet = mockFleets.find(f => f.name === fleetName);
    if (fleet) {
      onNavigate('fleet-details', undefined, { fleetId: fleet.id });
    }
  };

  const handleResumeDevice = (device: Device) => {
    setDeviceToResume(device);
    setIsResumeModalOpen(true);
  };

  const confirmResumeDevice = async () => {
    if (!deviceToResume) return;

    setIsResuming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would update the device status here
    console.log(`Resuming device: ${deviceToResume.name}`);

    setIsResuming(false);
    setIsResumeModalOpen(false);
    setDeviceToResume(null);
  };

  const toggleKebabMenu = (deviceId: string) => {
    setKebabOpenStates(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }));
  };

  const handleSelectPendingDevice = (deviceId: string, checked: boolean) => {
    setSelectedPendingDevices(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(deviceId);
      } else {
        newSet.delete(deviceId);
      }
      return newSet;
    });
  };

  const handleSelectAllPendingDevices = (checked: boolean) => {
    if (checked) {
      setSelectedPendingDevices(new Set(pendingDevices.map(d => d.id)));
    } else {
      setSelectedPendingDevices(new Set());
    }
  };

  const handleApproveSelected = () => {
    console.log(`Approving ${selectedPendingDevices.size} devices:`, Array.from(selectedPendingDevices));
    // In a real app, you would call an API here
    // After approval, clear the selection
    setSelectedPendingDevices(new Set());
  };

  const handleOpenApproveModal = (device: { id: string; name: string; alias?: string }) => {
    setDeviceToApprove(device);
    setIsApproveModalOpen(true);
  };

  const handleApproveDevice = async (deviceId: string, alias: string, labels: string[]) => {
    setIsApproving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Approving device ${deviceId}:`, { alias, labels });
    // In a real app, you would call an API here to approve the device

    setIsApproving(false);
    setIsApproveModalOpen(false);
    setDeviceToApprove(null);
  };

  return (
    <>
      <PostRestoreBanners onNavigate={onNavigate} />

      {/* Devices Pending Approval Card */}
      {pendingDevices.length > 0 && (
        <PageSection>
          <Card>
            <CardBody>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Title headingLevel="h3" size="lg">
                    Devices pending approval
                  </Title>
                  <div style={{ fontSize: '14px', color: '#6a6e73', marginTop: '8px' }}>
                    {pendingDevices.length} {pendingDevices.length === 1 ? 'device' : 'devices'} waiting for approval
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  onClick={handleApproveSelected}
                  isDisabled={selectedPendingDevices.size === 0}
                >
                  Approve ({selectedPendingDevices.size})
                </Button>
              </div>
              <Table aria-label="Devices pending approval" variant="compact">
                <Thead>
                  <Tr>
                    <Th width={10}>
                      <Checkbox
                        id="select-all-pending"
                        isChecked={selectedPendingDevices.size === pendingDevices.length && pendingDevices.length > 0}
                        onChange={(_event, checked) => handleSelectAllPendingDevices(checked)}
                        aria-label="Select all pending devices"
                      />
                    </Th>
                    <Th>Alias</Th>
                    <Th>Name</Th>
                    <Th>Created</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pendingDevices.map((device: { id: string; name: string; alias?: string; requestedAt: string }) => (
                    <Tr key={device.id}>
                      <Td>
                        <Checkbox
                          id={`select-${device.id}`}
                          isChecked={selectedPendingDevices.has(device.id)}
                          onChange={(_event, checked) => handleSelectPendingDevice(device.id, checked)}
                          aria-label={`Select ${device.alias || device.name}`}
                        />
                      </Td>
                      <Td>
                        <Button variant="link" style={{ padding: 0 }}>
                          {device.alias || 'Untitled'}
                        </Button>
                      </Td>
                      <Td style={{ fontFamily: 'monospace' }}>
                        {device.name}
                      </Td>
                      <Td>
                        {device.requestedAt}
                      </Td>
                      <Td>
                        <Button 
                          variant="link" 
                          style={{ padding: 0 }}
                          onClick={() => handleOpenApproveModal(device)}
                        >
                          Approve
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </PageSection>
      )}

      {/* Approved Devices Card */}
      <PageSection>
        <Card>
          <CardBody>
            <div style={{ marginBottom: '16px' }}>
              <Title headingLevel="h3" size="lg">
                Devices
              </Title>
            </div>
            {/* Filters Toolbar */}
            <Toolbar>
              <ToolbarContent>
                <ToolbarGroup>
                  <ToolbarItem>
                    <Dropdown
                      isOpen={isStatusOpen}
                      onSelect={() => {}} // Keep open for multi-select
                      onOpenChange={setIsStatusOpen}
                      toggle={(toggleRef) => (
                        <MenuToggle
                          ref={toggleRef}
                          onClick={() => setIsStatusOpen(!isStatusOpen)}
                          icon={<FilterIcon />}
                        >
                          Filter by status
                        </MenuToggle>
                      )}
                    >
                      <DropdownList style={{ padding: '16px', minWidth: '800px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                          {/* Device Status Column */}
                          <div>
                            <h4 style={{ marginBottom: '12px', fontWeight: 'bold', color: '#151515' }}>Device status</h4>
                            {filterOptions.deviceStatus.map((option) => (
                              <div key={option.value} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                  id={`device-${option.value}`}
                                  isChecked={selectedFilters.deviceStatus.has(option.value as DeviceStatus)}
                                  onChange={(_event, checked) => handleFilterChange('deviceStatus', option.value, checked)}
                                  label={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <option.icon style={{ color: option.color, fontSize: '14px' }} />
                                      <span>{option.label} ({option.count})</span>
                                    </span>
                                  }
                                />
                              </div>
                            ))}
                          </div>

                          {/* Application Status Column */}
                          <div>
                            <h4 style={{ marginBottom: '12px', fontWeight: 'bold', color: '#151515' }}>Application status</h4>
                            {filterOptions.applicationStatus.map((option) => (
                              <div key={option.value} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                  id={`app-${option.value}`}
                                  isChecked={selectedFilters.applicationStatus.has(option.value)}
                                  onChange={(_event, checked) => handleFilterChange('applicationStatus', option.value, checked)}
                                  label={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <option.icon style={{ color: option.color, fontSize: '14px' }} />
                                      <span>{option.label}</span>
                                    </span>
                                  }
                                />
                              </div>
                            ))}
                          </div>

                          {/* System Update Status Column */}
                          <div>
                            <h4 style={{ marginBottom: '12px', fontWeight: 'bold', color: '#151515' }}>System update status</h4>
                            {filterOptions.systemUpdateStatus.map((option) => (
                              <div key={option.value} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                <Checkbox
                                  id={`system-${option.value}`}
                                  isChecked={selectedFilters.systemUpdateStatus.has(option.value)}
                                  onChange={(_event, checked) => handleFilterChange('systemUpdateStatus', option.value, checked)}
                                  label={
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <option.icon style={{ color: option.color, fontSize: '14px' }} />
                                      <span>{option.label}</span>
                                    </span>
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </DropdownList>
                    </Dropdown>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="control">Labels and fleets</Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <SearchInput
                      placeholder=""
                      value={searchValue}
                      onChange={(_event, value) => setSearchValue(value)}
                      onClear={() => setSearchValue('')}
                      style={{ width: '200px' }}
                    />
                  </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup align={{ default: 'alignEnd' }}>
                  <ToolbarItem>
                    <Button variant="primary" onClick={onAddDeviceClick}>Add devices</Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button variant="secondary">Decommission devices</Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>

            {/* Results Summary */}
            <div style={{ margin: '16px 0', fontSize: '14px', color: '#6a6e73' }}>
              Showing {filteredDevices.length} of {mockDevices.length} devices
              {(searchValue || selectedFilters.deviceStatus.size > 0 || selectedFilters.applicationStatus.size > 0 || selectedFilters.systemUpdateStatus.size > 0) && (
                <Button
                  variant="link"
                  isInline
                  onClick={() => {
                    setSearchValue('');
                    setSelectedFilters({
                      deviceStatus: new Set(),
                      applicationStatus: new Set(),
                      systemUpdateStatus: new Set(),
                    });
                  }}
                  style={{ marginLeft: '8px' }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Device Table */}
            <Table aria-label="Device list" variant="compact">
              <Thead>
                <Tr>
                  <Th width={10}></Th>
                  <Th>Alias</Th>
                  <Th>Name</Th>
                  <Th>Fleet</Th>
                  <Th>Application status</Th>
                  <Th>Device status</Th>
                  <Th>System update status</Th>
                  <Th width={10}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredDevices.map((device) => (
                  <Tr
                    key={device.id}
                    style={{
                      backgroundColor: selectedDeviceId === device.id ? '#f0f8ff' : undefined
                    }}
                  >
                    <Td>
                      <input type="checkbox" />
                    </Td>
                    <Td>
                      <Button 
                        variant="link" 
                        style={{ padding: 0 }}
                        onClick={() => handleDeviceClick(device.id)}
                      >
                        {device.alias || 'Untitled'}
                      </Button>
                    </Td>
                    <Td style={{ fontFamily: 'monospace' }}>
                      {device.name}
                    </Td>
                    <Td>
                      {device.fleet ? (
                        <Button 
                          variant="link" 
                          style={{ padding: 0 }}
                          onClick={() => handleFleetClick(device.fleet!)}
                        >
                          {device.fleet}
                        </Button>
                      ) : (
                        <span>
                          None{' '}
                          <Popover bodyContent={<span>Device labels don't match any fleet's selector labels</span>}>
                            <Button
                              isInline
                              variant="plain"
                              icon={<OutlinedQuestionCircleIcon />}
                              aria-label="Ownership information"
                            />
                          </Popover>
                        </span>
                      )}
                    </Td>
                    <Td>
                      <div
                        style={{
                          backgroundColor: getStatusLabelStyle(device.applicationStatus).backgroundColor,
                          color: getStatusLabelStyle(device.applicationStatus).color,
                          border: `1px solid ${getStatusLabelStyle(device.applicationStatus).borderColor}`,
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
                        {React.createElement(getStatusIcon(device.applicationStatus), { style: { fontSize: '12px', color: getStatusLabelStyle(device.applicationStatus).color } })}
                        {getStatusLabel(device.applicationStatus)}
                      </div>
                    </Td>
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
                    <Td>
                      <div
                        style={{
                          backgroundColor: getStatusLabelStyle(device.systemUpdateStatus).backgroundColor,
                          color: getStatusLabelStyle(device.systemUpdateStatus).color,
                          border: `1px solid ${getStatusLabelStyle(device.systemUpdateStatus).borderColor}`,
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
                        {React.createElement(getStatusIcon(device.systemUpdateStatus), { style: { fontSize: '12px', color: getStatusLabelStyle(device.systemUpdateStatus).color } })}
                        {getStatusLabel(device.systemUpdateStatus)}
                      </div>
                    </Td>
                    <Td>
                      <Dropdown
                        isOpen={kebabOpenStates[device.id] || false}
                        onSelect={() => toggleKebabMenu(device.id)}
                        onOpenChange={() => toggleKebabMenu(device.id)}
                        popperProps={{
                          position: 'right',
                          enableFlip: false,
                          appendTo: () => document.body
                        }}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            aria-label="Device options"
                            variant="plain"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleKebabMenu(device.id);
                            }}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem
                            key="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Edit configurations for ${device.name}`);
                              toggleKebabMenu(device.id);
                            }}
                          >
                            Edit device configurations
                          </DropdownItem>
                          <DropdownItem
                            key="details"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('device-details', 'devices', { deviceId: device.id });
                            }}
                          >
                            View device details
                          </DropdownItem>
                          <DropdownItem
                            key="decommission"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Decommission ${device.name}`);
                              toggleKebabMenu(device.id);
                            }}
                          >
                            Decommission device
                          </DropdownItem>
                          <DropdownItem
                            key="resume"
                            isDisabled={!isDeviceResumable(device)}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isDeviceResumable(device)) {
                                handleResumeDevice(device);
                              }
                              toggleKebabMenu(device.id);
                            }}
                          >
                            Resume suspended device
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {filteredDevices.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6a6e73' }}>
                <p>No devices match your search criteria.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchValue('');
                    setSelectedFilters({
                      deviceStatus: new Set(),
                      applicationStatus: new Set(),
                      systemUpdateStatus: new Set(),
                    });
                  }}
                >
                  Clear filters to see all devices
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </PageSection>

      {/* Resume Device Modal */}
      <ResumeDeviceModal
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setDeviceToResume(null);
        }}
        onConfirm={confirmResumeDevice}
        deviceName={deviceToResume?.alias || deviceToResume?.name}
        isLoading={isResuming}
      />

      {/* Approve Device Modal */}
      {deviceToApprove && isApproveModalOpen && (
        <ApproveDeviceModal
          onClose={() => {
            setIsApproveModalOpen(false);
            setDeviceToApprove(null);
          }}
          onApprove={handleApproveDevice}
          deviceId={deviceToApprove.id}
          deviceName={deviceToApprove.name}
          defaultAlias={deviceToApprove.alias}
          isLoading={isApproving}
        />
      )}
    </>
  );
};

export default DevicesPage;
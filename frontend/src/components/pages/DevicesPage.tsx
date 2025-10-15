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
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Alert,
  Dropdown,
  DropdownList,
  DropdownItem,
  Checkbox,
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
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
  PowerOffIcon,
  RedoIcon,
  ArrowCircleUpIcon,
  DownloadIcon,
  InProgressIcon,
  TimesCircleIcon
} from '@patternfly/react-icons';
import PostRestoreBanners from '../shared/PostRestoreBanners';
import ResumeDeviceModal from '../shared/ResumeDeviceModal';
import { mockDevices } from '../../data/mockData';
import { Device, DeviceStatus } from '../../types/device';
import { getStatusColor, getStatusLabel, getStatusIcon, countDevicesByStatus, getFilteredDevices, isDeviceResumable, getStatusLabelStyle } from '../../utils/deviceUtils';

interface DevicesPageProps {
  onAddDeviceClick: () => void;
  onDeviceSelect: (deviceId: string) => void;
  onNavigateToSuspendedDevices?: () => void;
}

const DevicesPage: React.FC<DevicesPageProps> = ({
  onAddDeviceClick,
  onDeviceSelect,
  onNavigateToSuspendedDevices = () => console.log('Navigate to suspended devices'),
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | ''>('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
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

  // Get status counts for filter labels
  const statusCounts = countDevicesByStatus(mockDevices);
  const statusCountsMap = statusCounts.reduce((acc, item) => {
    acc[item.status] = item.count;
    return acc;
  }, {} as Record<DeviceStatus, number>);

  const statusOptions = [
    { value: '' as const, label: `All (${mockDevices.length})` },
    { value: 'ONLINE' as const, label: `Online (${statusCountsMap.ONLINE || 0})` },
    { value: 'SUSPENDED' as const, label: `Suspended (${statusCountsMap.SUSPENDED || 0})` },
    { value: 'PENDING_SYNC' as const, label: `Pending Sync (${statusCountsMap.PENDING_SYNC || 0})` },
    { value: 'OFFLINE' as const, label: `Offline (${statusCountsMap.OFFLINE || 0})` },
    { value: 'ERROR' as const, label: `Error (${statusCountsMap.ERROR || 0})` },
    { value: 'DEGRADED' as const, label: `Degraded (${statusCountsMap.DEGRADED || 0})` },
    { value: 'REBOOTING' as const, label: `Rebooting (${statusCountsMap.REBOOTING || 0})` },
  ].filter(option => option.value === '' || statusCountsMap[option.value] > 0);

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

  // Filter options with counts and PatternFly icons matching the exact design image colors
  const filterOptions = {
    deviceStatus: [
      { value: 'ERROR', label: 'Error', count: statusCountsMap.ERROR || 0, color: '#c9190b', icon: TimesCircleIcon },
      { value: 'DEGRADED', label: 'Degraded', count: statusCountsMap.DEGRADED || 0, color: '#f0ab00', icon: ExclamationTriangleIcon },
      { value: 'UNKNOWN', label: 'Unknown', count: statusCountsMap.UNKNOWN || 0, color: '#6a6e73', icon: ExclamationTriangleIcon },
      { value: 'POWERED_OFF', label: 'Powered off', count: statusCountsMap.POWERED_OFF || 0, color: '#2b9af3', icon: PowerOffIcon },
      { value: 'REBOOTING', label: 'Rebooting', count: statusCountsMap.REBOOTING || 0, color: '#2b9af3', icon: InProgressIcon },
      { value: 'ONLINE', label: 'Online', count: statusCountsMap.ONLINE || 0, color: '#3e8635', icon: CheckCircleIcon },
      { value: 'PENDING_SYNC', label: 'Pending Sync', count: statusCountsMap.PENDING_SYNC || 0, color: '#2b9af3', icon: ClockIcon },
      { value: 'SUSPENDED', label: 'Suspended', count: statusCountsMap.SUSPENDED || 0, color: '#ec7a08', icon: PauseCircleIcon },
    ].filter(option => option.count > 0),
    applicationStatus: [
      { value: 'ERROR', label: 'Error', count: mockDevices.filter(d => d.applicationStatus === 'ERROR').length, color: '#c9190b', icon: TimesCircleIcon },
      { value: 'DEGRADED', label: 'Degraded', count: mockDevices.filter(d => d.applicationStatus === 'DEGRADED').length, color: '#f0ab00', icon: ExclamationTriangleIcon },
      { value: 'UNKNOWN', label: 'Unknown', count: mockDevices.filter(d => d.applicationStatus === 'UNKNOWN').length, color: '#6a6e73', icon: ExclamationTriangleIcon },
      { value: 'HEALTHY', label: 'Healthy', count: mockDevices.filter(d => d.applicationStatus === 'HEALTHY').length, color: '#3e8635', icon: CheckCircleIcon },
    ].filter(option => option.count > 0),
    systemUpdateStatus: [
      { value: 'OUT_OF_DATE', label: 'Out-of-date', count: mockDevices.filter(d => d.systemUpdateStatus === 'OUT_OF_DATE').length, color: '#f0ab00', icon: ExclamationTriangleIcon },
      { value: 'UNKNOWN', label: 'Unknown', count: mockDevices.filter(d => d.systemUpdateStatus === 'UNKNOWN').length, color: '#6a6e73', icon: ExclamationTriangleIcon },
      { value: 'UPDATING', label: 'Updating', count: mockDevices.filter(d => d.systemUpdateStatus === 'UPDATING').length, color: '#2b9af3', icon: InProgressIcon },
      { value: 'UP_TO_DATE', label: 'Up-to-date', count: mockDevices.filter(d => d.systemUpdateStatus === 'UP_TO_DATE').length, color: '#3e8635', icon: CheckCircleIcon },
    ].filter(option => option.count > 0),
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
    setSelectedDevice(deviceId);
    onDeviceSelect(deviceId);
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

  return (
    <>
      {/* Header */}
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Devices
        </Title>
      </PageSection>

      <PostRestoreBanners onNavigateToSuspendedDevices={onNavigateToSuspendedDevices} />

      {/* Main Content */}
      <PageSection>
        <Card>
          <CardBody>
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
                                  onChange={(checked) => handleFilterChange('deviceStatus', option.value, checked)}
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
                                  onChange={(checked) => handleFilterChange('applicationStatus', option.value, checked)}
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
                                  onChange={(checked) => handleFilterChange('systemUpdateStatus', option.value, checked)}
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
                  <Th>Last seen</Th>
                  <Th width={10}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredDevices.map((device) => (
                  <Tr
                    key={device.id}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedDevice === device.id ? '#f0f8ff' : undefined
                    }}
                    onClick={() => handleDeviceClick(device.id)}
                  >
                    <Td>
                      <input type="checkbox" />
                    </Td>
                    <Td>
                      <Button variant="link" style={{ color: '#06c', padding: 0 }}>
                        {device.alias || 'Device alias'}
                      </Button>
                    </Td>
                    <Td style={{ fontFamily: 'monospace' }}>
                      {device.name}
                    </Td>
                    <Td>
                      {device.fleet ? (
                        <Button variant="link" style={{ color: '#06c', padding: 0 }}>
                          {device.fleet}
                        </Button>
                      ) : '--'}
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
                    <Td>{device.lastSeen}</Td>
                    <Td>
                      <Dropdown
                        isOpen={kebabOpenStates[device.id] || false}
                        onSelect={() => toggleKebabMenu(device.id)}
                        onOpenChange={() => toggleKebabMenu(device.id)}
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
                              console.log(`View details for ${device.name}`);
                              toggleKebabMenu(device.id);
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
    </>
  );
};

export default DevicesPage;
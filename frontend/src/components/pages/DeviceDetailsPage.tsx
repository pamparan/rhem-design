import React, { useState } from 'react';
import {
  PageSection,
  PageBreadcrumb,
  Title,
  Card,
  CardBody,
  CardTitle,
  Label,
  Button,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  TabContentBody,
  Grid,
  GridItem,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Icon,
  ExpandableSection,
  Content,
  Split,
  SplitItem,
  TextInput,
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  InputGroupItem,
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
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TimesCircleIcon,
  InfoCircleIcon,
  InProgressIcon,
  CopyIcon,
  ChevronDownIcon,
  EditIcon,
  ClipboardIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
  CheckIcon,
  TimesIcon,
  SyncAltIcon,
  DownloadIcon,
  NewProcessIcon,
  NetworkIcon,
  DatabaseIcon,
  FolderIcon,
  ConnectedIcon,
} from '@patternfly/react-icons';
import ResumeDeviceModal from '../shared/ResumeDeviceModal';
import DeviceSuspendedBanner from '../shared/DeviceSuspendedBanner';
import { getStatusLabelStyle, getStatusLabel, getStatusIcon } from '../../utils/deviceUtils';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';
import { mockDevices } from '../../data/mockData';
import { Device } from '../../types/device';

interface DeviceDetailsPageProps {
  deviceId: string;
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const DeviceDetailsPage: React.FC<DeviceDetailsPageProps> = ({
  deviceId,
  onNavigate,
}) => {
  const device = mockDevices.find(d => d.id === deviceId)  as Device;
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [activeTab, setActiveTab] = useState<string | number>('details');

  // Expandable section states
  const [isTechnicalExpanded, setIsTechnicalExpanded] = useState(false);
  const [isNetworkExpanded, setIsNetworkExpanded] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [isApplicationsExpanded, setIsApplicationsExpanded] = useState(false);
  const [isCustomDataExpanded, setIsCustomDataExpanded] = useState(false);
  const [isLabelsExpanded, setIsLabelsExpanded] = useState(false);

  // Label management states - realistic fitting room device labels
  const [labels, setLabels] = useState<string[]>(['location=fitting-room', 'store=madrid-flagship', 'brand=zara']);
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState('');


  const handleResumeDevice = () => {
    setIsResumeModalOpen(true);
  };

  const confirmResumeDevice = async () => {
    setIsResuming(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Resuming device: ${device.name}`);
    setIsResuming(false);
    setIsResumeModalOpen(false);
  };

  // Label management functions
  const handleAddLabel = () => {
    setIsAddingLabel(true);
  };

  const handleSaveLabel = () => {
    if (newLabelInput.trim() && !labels.includes(newLabelInput.trim())) {
      setLabels([...labels, newLabelInput.trim()]);
    }
    setNewLabelInput('');
    setIsAddingLabel(false);
  };

  const handleCancelAddLabel = () => {
    setNewLabelInput('');
    setIsAddingLabel(false);
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels(labels.filter(label => label !== labelToRemove));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSaveLabel();
    } else if (event.key === 'Escape') {
      handleCancelAddLabel();
    }
  };

  // Enhanced mock data matching staging environment
  const deviceInfo = {
    name: 'gbp0sn6574270a1f',
    shortName: 'gbp0sn...0574270',
    fleetName: 'fitting-room-devices', // Use consistent fleet name from mockData
    architecture: 'amd64',
    operatingSystem: 'linux',
    distro: 'Red Hat Enterprise Linux 9.3',
    hostname: 'madrid-fitting-room-01.local',
    kernel: '5.14.0-570.el9.x86_64',
    netInterfaceDefault: 'enp1s0',
    netMACDefault: '52:54:00:2c:99:3e',
    productName: 'Dell OptiPlex 7090 Ultra',
    bootID: '6a8a4653-e383-488f-82d8-0c7d3356cffc',
    netIPDefault: '192.168.122.93/24',
    productUUID: '13c4629c-fedc-4314-a616-65cb62526fe2',
    agentVersion: 'v1.2.4-stable-104-g8f92c1ef',
    systemImage: 'quay.io/redhat/rhde:9.3',
  };

  // Mock custom data - simple key-value pairs as they would exist in practice
  const mockCustomData = [
    { key: 'location', value: 'madrid-flagship-fr-02' },
    { key: 'environment', value: 'production' },
    { key: 'cost-center', value: 'RC-ES-MAD-001' },
    { key: 'asset-tag', value: 'ZARA-FTR-001' },
    { key: 'owner', value: 'retail-ops' }
  ];

  // Application Status Enums - complete list
  const ApplicationStatus = {
    PREPARING: 'Preparing',
    STARTING: 'Starting',
    RUNNING: 'Running',
    ERROR: 'Error',
    UNKNOWN: 'Unknown',
    COMPLETED: 'Completed'
  };

  // Mock applications data - realistic retail fitting room applications
  const mockApplications = [
    { name: 'Zara Smart Mirror', status: ApplicationStatus.RUNNING, ready: '1/1', restarts: '2', type: 'Compose', critical: false },
    { name: 'Fashion AI Recommender', status: ApplicationStatus.RUNNING, ready: '3/3', restarts: '0', type: 'Container', critical: false },
    { name: 'Customer Analytics Engine', status: ApplicationStatus.STARTING, ready: '2/4', restarts: '0', type: 'Quadlet', critical: false },
    { name: 'Inventory Sync Service', status: ApplicationStatus.RUNNING, ready: '1/1', restarts: '5', type: 'Container', critical: false },
    { name: 'Camera Feed Processor', status: ApplicationStatus.PREPARING, ready: '0/2', restarts: '0', type: 'Compose', critical: false },
    { name: 'Emergency Alert System', status: ApplicationStatus.ERROR, ready: '0/1', restarts: '12', type: 'Container', critical: true },
    { name: 'Store WiFi Portal', status: ApplicationStatus.RUNNING, ready: '1/1', restarts: '1', type: 'Quadlet', critical: false },
  ];

  // Mock system services data - enhanced for fleetless device management
  const mockSystemServices = [
    {
      name: 'microshift.service',
      enabled: true,
      loadState: 'loaded',
      activeState: 'active',
      subState: 'running'
    },
    {
      name: 'crio.service',
      enabled: true,
      loadState: 'loaded',
      activeState: 'active',
      subState: 'running'
    },
    {
      name: 'logrotate.timer',
      enabled: false,
      loadState: 'loaded',
      activeState: 'inactive',
      subState: 'dead'
    },
    {
      name: 'docker.socket',
      enabled: true,
      loadState: 'loaded',
      activeState: 'active',
      subState: 'listening'
    },
    {
      name: 'var-lib-containers.mount',
      enabled: true,
      loadState: 'loaded',
      activeState: 'active',
      subState: 'mounted'
    },
    {
      name: 'multi-user.target',
      enabled: true,
      loadState: 'loaded',
      activeState: 'active',
      subState: 'active'
    },
    {
      name: 'systemd-ask-password-console.path',
      enabled: false,
      loadState: 'loaded',
      activeState: 'inactive',
      subState: 'dead'
    },
    {
      name: 'flightctl-agent.service',
      enabled: true,
      loadState: 'loaded',
      activeState: 'active',
      subState: 'running'
    },
  ];

  // Mock resource status data matching staging
  const mockResourceStatus = {
    cpuPressure: { status: 'Within limits', severity: 'success' },
    diskPressure: { status: 'Within limits', severity: 'success' },
    memoryPressure: { status: 'Within limits', severity: 'success' },
  };

  // Mock system status - realistic fitting room device status
  const mockSystemStatus = {
    applicationStatus: 'Healthy',
    deviceStatus: 'Healthy',
    updateStatus: 'Pending',
    integrityStatus: 'Verified',
    lastSeen: '2 minutes ago'
  };

  // Helper function to get status styling based on status value
  const getStatusLabelProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'verified':
        return { status: 'success' as const, icon: <CheckCircleIcon /> };
      case 'pending':
        return { status: 'warning' as const, icon: <InProgressIcon /> };
      case 'degraded':
      case 'error':
        return { status: 'danger' as const, icon: <ExclamationTriangleIcon /> };
      case 'unknown':
        return { status: 'info' as const, icon: <InfoCircleIcon /> };
      default:
        return { variant: 'outline' as const, color: 'grey' as const, icon: <InfoCircleIcon /> };
    }
  };

  // Mock configurations
  const mockConfigurations = {
    systemImage: 'quay.io/rh_ee_camadorg/centos-bootc-flightctl-local/local-rpm-v1',
    sources: 0
  };

  const renderStatusIcon = (severity: string) => {
    switch (severity) {
      case 'danger':
        return <TimesCircleIcon style={{ color: '#b1380b' }} />;
      case 'warning':
        return <ExclamationTriangleIcon style={{ color: '#dca614' }} />;
      case 'success':
        return <CheckCircleIcon style={{ color: '#3d7317' }} />;
      default:
        return <InfoCircleIcon />;
    }
  };

  const renderApplicationStatusIcon = (status: string) => {
    switch (status) {
      case ApplicationStatus.RUNNING:
        return <CheckCircleIcon style={{ color: '#2b9af3' }} />; // Blue
      case ApplicationStatus.STARTING:
        return <InProgressIcon style={{ color: '#6a6e73' }} />; // Grey
      case ApplicationStatus.PREPARING:
        return <NewProcessIcon style={{ color: '#6a6e73' }} />; // Grey
      case ApplicationStatus.ERROR:
        return <TimesCircleIcon style={{ color: '#c9190b' }} />; // Red
      case ApplicationStatus.UNKNOWN:
        return <InfoCircleIcon style={{ color: '#6a6e73' }} />; // Grey
      case ApplicationStatus.COMPLETED:
        return <CheckCircleIcon style={{ color: '#2b9af3' }} />; // Blue
      default:
        return <InfoCircleIcon style={{ color: '#6a6e73' }} />; // Grey
    }
  };

  const getApplicationStatusColor = (status: string): string => {
    switch (status) {
      case ApplicationStatus.RUNNING:
        return 'blue';
      case ApplicationStatus.STARTING:
        return 'grey';
      case ApplicationStatus.PREPARING:
        return 'grey';
      case ApplicationStatus.ERROR:
        return 'red';
      case ApplicationStatus.UNKNOWN:
        return 'grey';
      case ApplicationStatus.COMPLETED:
        return 'blue';
      default:
        return 'grey';
    }
  };

  // SystemD status handling utilities
  const getSystemdStatusIcon = (serviceName: string) => {
    if (serviceName.endsWith('.service')) {
      return <CogIcon style={{ fontSize: '14px', color: '#6a6e73' }} />;
    } else if (serviceName.endsWith('.timer')) {
      return <ClockIcon style={{ fontSize: '14px', color: '#6a6e73' }} />;
    } else if (serviceName.endsWith('.socket')) {
      return <ConnectedIcon style={{ fontSize: '14px', color: '#6a6e73' }} />;
    } else if (serviceName.endsWith('.mount')) {
      return <DatabaseIcon style={{ fontSize: '14px', color: '#6a6e73' }} />;
    } else if (serviceName.endsWith('.target')) {
      return <NetworkIcon style={{ fontSize: '14px', color: '#6a6e73' }} />;
    } else if (serviceName.endsWith('.path')) {
      return <FolderIcon style={{ fontSize: '14px', color: '#6a6e73' }} />;
    }
    return null;
  };

  const formatSystemdStatus = (status: string): string => {
    // Preserve casing for now as suggested in feedback
    return status;
  };

  const getSystemdStatusColor = (activeState: string, subState: string) => {
    if (activeState === 'active' && subState === 'running') {
      return 'blue';
    } else if (activeState === 'failed') {
      return 'danger';
    } else if (activeState === 'activating' || activeState === 'deactivating') {
      return 'warning';
    } else if (activeState === 'inactive') {
      return undefined; // Grey/default
    }
    return undefined;
  };

  // Labels - consistent with the fitting-room-devices fleet theme
  const deviceLabels = [
    'location=fitting-room',
    'store=madrid-flagship',
    'brand=zara',
    'country=spain',
    'floor=2nd',
    'zone=premium-section'
  ];

  return (
    <>
      {/* Breadcrumb */}
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={() => onNavigate('main')}>
              Devices
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{deviceInfo.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>

      {/* Header, Tabs and Content - Combined */}
      <PageSection variant="light">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
              <FlexItem>
                <Title headingLevel="h1" size="2xl">
                  {deviceInfo.name}
                </Title>
              </FlexItem>
              <FlexItem>
                <EditIcon style={{ fontSize: '20px', color: '#6a6e73' }} />
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Dropdown
              isOpen={isActionsOpen}
              onSelect={() => setIsActionsOpen(false)}
              onOpenChange={setIsActionsOpen}
              popperProps={{
                position: 'right',
                enableFlip: false,
                appendTo: () => document.body
              }}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  variant="primary"
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                >
                  Actions
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem onClick={() => console.log('Edit configurations')}>
                  Edit configurations
                </DropdownItem>
                <DropdownItem onClick={() => console.log('Decommission device')}>
                  Decommission device
                </DropdownItem>
                <DropdownItem
                  isDisabled={device.status !== 'SUSPENDED'}
                  onClick={handleResumeDevice}
                >
                  Resume suspended device
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>

        {/* Suspended Device Alert */}
        <DeviceSuspendedBanner
          device={device}
          onResumeDevice={handleResumeDevice}
          onNavigate={onNavigate}
        />

        {/* Tabs */}
        <div style={{ marginTop: '24px' }}>
          <Tabs
            activeKey={activeTab}
            onSelect={(_event, tabIndex) => setActiveTab(tabIndex)}
            aria-label="Device details tabs"
            role="region"
            usePageInsets
          >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} />
          <Tab eventKey="terminal" title={<TabTitleText>Terminal</TabTitleText>} />
          <Tab eventKey="events" title={<TabTitleText>Events</TabTitleText>} />
        </Tabs>

        <TabContent eventKey="details" id="details-tab" hidden={activeTab !== 'details'}>
          <TabContentBody style={{ marginTop: '24px' }}>
            {/* System Status - Full Width at Top */}
            <Card style={{ marginBottom: '32px' }}>
              <CardTitle>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>System Status</h3>
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                    Last seen {mockSystemStatus.lastSeen}
                  </div>
                </div>
              </CardTitle>
              <CardBody style={{ padding: '24px' }}>
                <Grid hasGutter>
                  <GridItem span={3}>
                    <div style={{ marginBottom: '16px' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                        <FlexItem>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>Application status</span>
                        </FlexItem>
                        <FlexItem>
                          <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                        </FlexItem>
                      </Flex>
                      <Label {...getStatusLabelProps(mockSystemStatus.applicationStatus)}>
                        {mockSystemStatus.applicationStatus}
                      </Label>
                    </div>
                  </GridItem>
                  <GridItem span={3}>
                    <div style={{ marginBottom: '16px' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                        <FlexItem>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>Device status</span>
                        </FlexItem>
                        <FlexItem>
                          <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                        </FlexItem>
                      </Flex>
                      <Label {...getStatusLabelProps(mockSystemStatus.deviceStatus)}>
                        {mockSystemStatus.deviceStatus}
                      </Label>
                    </div>
                  </GridItem>
                  <GridItem span={3}>
                    <div style={{ marginBottom: '16px' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                        <FlexItem>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>Update status</span>
                        </FlexItem>
                        <FlexItem>
                          <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                        </FlexItem>
                      </Flex>
                      <Label {...getStatusLabelProps(mockSystemStatus.updateStatus)}>
                        {mockSystemStatus.updateStatus}
                      </Label>
                    </div>
                  </GridItem>
                  <GridItem span={3}>
                    <div style={{ marginBottom: '16px' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                        <FlexItem>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>Integrity status</span>
                        </FlexItem>
                        <FlexItem>
                          <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                        </FlexItem>
                      </Flex>
                      <Label {...getStatusLabelProps(mockSystemStatus.integrityStatus)}>
                        {mockSystemStatus.integrityStatus}
                      </Label>
                    </div>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Application Status - Full Width */}
            <Card className="pf-v6-u-mb-xl">
              <CardTitle>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Application status</h3>
                  <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                    Applications (7)
                  </div>
                </div>
              </CardTitle>
              <CardBody>

                {/* Expandable Applications Section */}
                <ExpandableSection
                  style={{ backgroundColor: '#ffffff' }}
                  toggleContent={
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }} className="pf-v6-u-p-md">
                      {(() => {
                        const statusCounts = mockApplications.reduce((acc, app) => {
                          acc[app.status] = (acc[app.status] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>);

                        return Object.entries(statusCounts).map(([status, count]) => (
                          <FlexItem key={status}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                              <FlexItem>
                                {renderApplicationStatusIcon(status)}
                              </FlexItem>
                              <FlexItem>
                                <span className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold">
                                  {count} {status}
                                </span>
                              </FlexItem>
                            </Flex>
                          </FlexItem>
                        ));
                      })()}
                    </Flex>
                  }
                  isExpanded={isApplicationsExpanded}
                  onToggle={(_event, isExpanded) => setIsApplicationsExpanded(isExpanded)}
                  displaySize="lg"
                  className="pf-v6-u-mb-lg"
                >
                  <div className="pf-v6-u-mt-md">
                    <Table aria-label="Applications table" variant="compact">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Status</Th>
                      <Th>Ready</Th>
                      <Th>Restarts</Th>
                      <Th>Type</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {mockApplications.map((app, index) => (
                      <Tr key={index}>
                        <Td>
                          <span className="pf-v6-u-font-size-sm">{app.name}</span>
                        </Td>
                        <Td>
                          <Label
                            color={getApplicationStatusColor(app.status)}
                            variant="outline"
                            icon={renderApplicationStatusIcon(app.status)}
                          >
                            {app.status}
                          </Label>
                        </Td>
                        <Td>
                          {app.ready || '—'}
                        </Td>
                        <Td>{app.restarts}</Td>
                        <Td>
                          {app.type ? (
                            <Label variant="outline">{app.type}</Label>
                          ) : '—'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                  </div>
                </ExpandableSection>
              </CardBody>
            </Card>

            {/* Device Information - Full Width */}
            <Card style={{ marginBottom: '32px' }}>
              <CardTitle>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Device Information</h3>
              </CardTitle>
              <CardBody>
                {/* Labels - Main section at top */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Labels ({labels.length})</h4>
                  <Flex spaceItems={{ default: 'spaceItemsSm' }} style={{ flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    {labels.map((label, index) => (
                      <FlexItem key={index}>
                        <Label
                          variant="outline"
                          isCompact
                          onClose={() => handleRemoveLabel(label)}
                        >
                          {label}
                        </Label>
                      </FlexItem>
                    ))}
                    <FlexItem>
                      {isAddingLabel ? (
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <TextInput
                              type="text"
                              placeholder="key=value"
                              value={newLabelInput}
                              onChange={(_event, value) => setNewLabelInput(value)}
                              onKeyDown={handleKeyDown}
                              style={{ fontSize: '14px', minWidth: '200px' }}
                              autoFocus
                            />
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              aria-label="Save label"
                              onClick={handleSaveLabel}
                              isDisabled={!newLabelInput.trim()}
                              style={{ padding: '4px' }}
                            >
                              <CheckIcon style={{ fontSize: '14px', color: '#3e8635' }} />
                            </Button>
                          </FlexItem>
                          <FlexItem>
                            <Button
                              variant="plain"
                              aria-label="Cancel add label"
                              onClick={handleCancelAddLabel}
                              style={{ padding: '4px' }}
                            >
                              <TimesIcon style={{ fontSize: '14px', color: '#c9190b' }} />
                            </Button>
                          </FlexItem>
                        </Flex>
                      ) : (
                        <Button
                          variant="link"
                          style={{ padding: 0, fontSize: '14px' }}
                          onClick={handleAddLabel}
                          icon={<PlusIcon style={{ fontSize: '12px', marginRight: '4px' }} />}
                        >
                          Add label
                        </Button>
                      )}
                    </FlexItem>
                  </Flex>
                </div>

                <Grid hasGutter>
                  <GridItem span={3}>
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <Content>
                                <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                  {deviceInfo.shortName}
                                </span>
                              </Content>
                            </FlexItem>
                            <FlexItem>
                              <Button variant="plain" aria-label="Copy device name">
                                <CopyIcon style={{ fontSize: '14px' }} />
                              </Button>
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Agent version</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Content>
                            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                              {deviceInfo.agentVersion}
                            </span>
                          </Content>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Architecture</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Label variant="outline" isCompact>
                            {deviceInfo.architecture}
                          </Label>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                  <GridItem span={3}>
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Operating system</DescriptionListTerm>
                        <DescriptionListDescription>{deviceInfo.operatingSystem}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Distro</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Label variant="outline" isCompact>
                            {deviceInfo.distro}
                          </Label>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                  <GridItem span={6}>
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Product name</DescriptionListTerm>
                        <DescriptionListDescription>
                          <span style={{ fontSize: '13px', lineHeight: '1.3' }}>
                            {deviceInfo.productName}
                          </span>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Product UUID</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Content>
                            <span style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.3' }}>
                              {deviceInfo.productUUID}
                            </span>
                          </Content>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                </Grid>

                {/* Expandable Technical Specifications */}
                <div style={{ marginTop: '16px' }}>
                  <ExpandableSection
                    toggleText="Technical specifications"
                    toggleTextExpanded="Hide technical specifications"
                    isExpanded={isTechnicalExpanded}
                    onToggle={(_event, isExpanded) => setIsTechnicalExpanded(isExpanded)}
                    displaySize="lg"
                  >
                    <div style={{ marginTop: '16px' }}>
                      <Grid hasGutter>
                        <GridItem span={6}>
                          <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Hostname</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Content>
                                  <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                    {deviceInfo.hostname}
                                  </span>
                                </Content>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Kernel</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Content>
                                  <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                    {deviceInfo.kernel}
                                  </span>
                                </Content>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </GridItem>
                        <GridItem span={6}>
                          <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Boot ID</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Content>
                                  <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                    {deviceInfo.bootID}
                                  </span>
                                </Content>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </GridItem>
                      </Grid>
                    </div>
                  </ExpandableSection>
                </div>

                {/* Expandable Network Configuration */}
                <div style={{ marginTop: '16px' }}>
                  <ExpandableSection
                    toggleText="Network configuration"
                    toggleTextExpanded="Hide network configuration"
                    isExpanded={isNetworkExpanded}
                    onToggle={(_event, isExpanded) => setIsNetworkExpanded(isExpanded)}
                    displaySize="lg"
                  >
                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600' }}>Default Interface</h4>
                      <Grid hasGutter>
                        <GridItem span={6}>
                          <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Net interface default</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Content>
                                  <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                    {deviceInfo.netInterfaceDefault}
                                  </span>
                                </Content>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Net IP default</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Content>
                                  <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                    {deviceInfo.netIPDefault}
                                  </span>
                                </Content>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </GridItem>
                        <GridItem span={6}>
                          <DescriptionList isHorizontal>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Net MAC default</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Content>
                                  <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                    {deviceInfo.netMACDefault}
                                  </span>
                                </Content>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </GridItem>
                      </Grid>
                    </div>
                  </ExpandableSection>
                </div>
              </CardBody>
            </Card>


            {/* Device Status (2/3) and System Configuration (1/3) - Side by Side */}
            <Grid hasGutter style={{ marginBottom: '32px' }}>
              {/* Device Status - 2/3 Width */}
              <GridItem span={8}>
                <Card style={{ height: '100%' }}>
                  <CardTitle>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Device Status</h3>
                  </CardTitle>
                  <CardBody style={{ padding: '24px' }}>
                    {/* Resource Status Section */}
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Resource Status</h4>
                      <Grid hasGutter>
                        <GridItem span={4}>
                          <div style={{ marginBottom: '16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>CPU pressure</span>
                            <Label status="success" variant="filled">
                              {mockResourceStatus.cpuPressure.status}
                            </Label>
                          </div>
                        </GridItem>
                        <GridItem span={4}>
                          <div style={{ marginBottom: '16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Disk pressure</span>
                            <Label status="success" variant="filled">
                              {mockResourceStatus.diskPressure.status}
                            </Label>
                          </div>
                        </GridItem>
                        <GridItem span={4}>
                          <div style={{ marginBottom: '16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Memory pressure</span>
                            <Label status="success" variant="filled">
                              {mockResourceStatus.memoryPressure.status}
                            </Label>
                          </div>
                        </GridItem>
                      </Grid>
                    </div>

                    {/* Visual spacer */}
                    <div style={{ borderTop: '1px solid #d2d2d2', marginBottom: '24px' }}></div>

                    {/* System Services Section */}
                    <div>
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                        <FlexItem>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>System Services</h4>
                        </FlexItem>
                        {!deviceInfo.fleetName && (
                          <FlexItem>
                            <Button variant="link" style={{ padding: 0, fontSize: '14px', color: '#2b9af3' }}>
                              Track SystemD services
                            </Button>
                          </FlexItem>
                        )}
                      </Flex>
                      {mockSystemServices.length > 0 ? (
                        <Table aria-label="System services table" variant="compact">
                          <Thead>
                            <Tr>
                              <Th>Service</Th>
                              <Th>Enable</Th>
                              <Th>Load State</Th>
                              <Th>Status</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {mockSystemServices.map((service, index) => (
                              <Tr key={index}>
                                <Td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {getSystemdStatusIcon(service.name)}
                                    <span style={{ fontSize: '14px' }}>
                                      {service.name}
                                    </span>
                                  </div>
                                </Td>
                                <Td>
                                  <Label
                                    color={service.enabled ? 'blue' : 'grey'}
                                    variant="outline"
                                  >
                                    {service.enabled ? 'enabled' : 'disabled'}
                                  </Label>
                                </Td>
                                <Td>
                                  <Label
                                    color="blue"
                                    variant="outline"
                                  >
                                    {formatSystemdStatus(service.loadState)}
                                  </Label>
                                </Td>
                                <Td>
                                  <Label
                                    color={getSystemdStatusColor(service.activeState, service.subState)}
                                    variant="outline"
                                  >
                                    {`${formatSystemdStatus(service.activeState)} (${formatSystemdStatus(service.subState)})`}
                                  </Label>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '32px', color: '#6a6e73' }}>
                          <p style={{ margin: 0, fontSize: '14px' }}>
                            No system services found
                          </p>
                          <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                            System services can be configured via the device specification
                          </p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </GridItem>

              {/* System Configuration - 1/3 Width */}
              <GridItem span={4}>
                <Card style={{ height: '100%', border: '1px solid #d2d2d2', borderRadius: '8px' }}>
                  <CardTitle>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>System Configuration</h3>
                      <Label status="info" variant="outline" icon={<SyncAltIcon />}>
                        Configuration sync in progress
                      </Label>
                    </div>
                  </CardTitle>
                  <CardBody>
                    <DescriptionList isCompact>
                      {deviceInfo.fleetName ? (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Fleet name</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Button variant="link" style={{ padding: 0, color: '#2b9af3' }}>
                              {deviceInfo.fleetName}
                            </Button>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      ) : (
                        <DescriptionListGroup>
                          <DescriptionListTerm>Fleet assignment</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Label variant="outline" color="grey">
                              No fleet assigned
                            </Label>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      )}
                      <DescriptionListGroup>
                        <DescriptionListTerm>System image (running)</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <Content>
                                <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                  {deviceInfo.systemImage}
                                </span>
                              </Content>
                            </FlexItem>
                            <FlexItem>
                              <ExclamationTriangleIcon style={{ fontSize: '14px', color: '#f0ab00' }} />
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Sources ({deviceInfo.fleetName ? '1' : '0'})</DescriptionListTerm>
                        <DescriptionListDescription>
                          {deviceInfo.fleetName ? 'App_definition' : 'No sources configured'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Custom Data - Standalone Section */}
            <Card style={{ marginBottom: '32px' }}>
              <CardTitle>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Custom Data</h3>
              </CardTitle>
              <CardBody>
                <DescriptionList isHorizontal>
                  {mockCustomData.map((item, index) => (
                    <DescriptionListGroup key={index}>
                      <DescriptionListTerm>{item.key}</DescriptionListTerm>
                      <DescriptionListDescription>
                        <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                          {item.value}
                        </span>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  ))}
                </DescriptionList>
              </CardBody>
            </Card>

          </TabContentBody>
        </TabContent>

        <TabContent id="yaml" eventKey="yaml" hidden={activeTab !== 'yaml'}>
          <TabContentBody style={{ marginTop: '24px' }}>
            <Card>
              <CardBody>
                <Title headingLevel="h2" size="lg">YAML Configuration</Title>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  border: '1px solid #d2d2d2',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  marginTop: '16px'
                }}>
{`apiVersion: v1alpha1
kind: Device
metadata:
  name: gbp0sn6574270a1f
  namespace: default
  labels:
    location: fitting-room
    store: madrid-flagship
    brand: zara
    country: spain
    floor: 2nd
    zone: premium-section
spec:
  fleetName: "fitting-room-devices"
  systemImage:
    image: quay.io/redhat/rhde:9.3
  applications:
    - name: zara-smart-mirror
      image: quay.io/zara/smart-mirror:v1.2.3
    - name: fashion-ai-recommender
      image: quay.io/zara/fashion-ai:v2.1.0
  resources:
    - name: camera-config
      type: ConfigMap
  systemd:
    units:
      - name: flightctl-agent.service
        enabled: true
status:
  phase: Online
  lastSeen: "2024-11-12T14:28:00Z"
  systemInfo:
    architecture: amd64
    operatingSystem: linux
    kernelVersion: 5.14.0-570.el9.x86_64
    bootID: 6a8a4653-e383-488f-82d8-0c7d3356cffc
    productName: Dell OptiPlex 7090 Ultra
    hostname: madrid-fitting-room-01.local`}
                </div>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>

        <TabContent eventKey="terminal" id="terminal-tab" hidden={activeTab !== 'terminal'}>
          <TabContentBody style={{ marginTop: '24px' }}>
            <Card>
              <CardBody>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <Title headingLevel="h2" size="lg">Terminal</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="primary" size="sm">
                      Connect to device terminal
                    </Button>
                  </FlexItem>
                </Flex>
                <div style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  fontFamily: 'Monaco, "Lucida Console", monospace',
                  fontSize: '14px',
                  padding: '16px',
                  borderRadius: '8px',
                  minHeight: '400px',
                  border: '1px solid #3e3e3e'
                }}>
                  <div style={{ color: '#569cd6' }}>
                    [root@orange-device ~]# <span style={{ color: '#d4d4d4' }}>systemctl status chronyd</span>
                  </div>
                  <div style={{ marginTop: '8px', color: '#4ec9b0' }}>
                    ● chronyd.service - NTP client/server<br/>
                    &nbsp;&nbsp;&nbsp;Loaded: loaded (/usr/lib/systemd/system/chronyd.service; enabled; vendor preset: enabled)<br/>
                    &nbsp;&nbsp;&nbsp;Active: <span style={{ color: '#00ff00' }}>active (running)</span> since Tue 2024-10-22 19:30:12 UTC; 2 days ago<br/>
                    &nbsp;&nbsp;&nbsp;Docs: man:chronyd(8)<br/>
                    &nbsp;&nbsp;&nbsp;Main PID: 1234 (chronyd)<br/>
                    &nbsp;&nbsp;&nbsp;Tasks: 1 (limit: 4915)<br/>
                    &nbsp;&nbsp;&nbsp;Memory: 2.1M<br/>
                    &nbsp;&nbsp;&nbsp;CGroup: /system.slice/chronyd.service<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─1234 /usr/sbin/chronyd
                  </div>
                  <div style={{ marginTop: '16px', color: '#569cd6' }}>
                    [root@orange-device ~]# <span style={{ animation: 'blink 1s infinite', borderRight: '2px solid #d4d4d4' }}>&nbsp;</span>
                  </div>
                </div>
                <div style={{ marginTop: '12px', fontSize: '14px', color: '#6a6e73' }}>
                  <span>Terminal access allows you to execute commands directly on the device. Use the connect button above to establish a secure connection.</span>
                </div>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>

        <TabContent eventKey="events" id="events-tab" hidden={activeTab !== 'events'}>
          <TabContentBody style={{ marginTop: '24px' }}>
            <Card>
              <CardBody>
                <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                  <FlexItem>
                    <Title headingLevel="h2" size="lg">Events</Title>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="secondary" size="sm">
                      Refresh events
                    </Button>
                  </FlexItem>
                </Flex>

                <Table aria-label="Device events" variant="compact">
                  <Thead>
                    <Tr>
                      <Th width={20}>Time</Th>
                      <Th width={15}>Type</Th>
                      <Th width={15}>Source</Th>
                      <Th>Message</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            2024-10-22 19:32:15
                          </span>
                        </Content>
                      </Td>
                      <Td>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <InfoCircleIcon style={{ fontSize: '14px', color: '#2b9af3' }} />
                          </FlexItem>
                          <FlexItem>
                            <Label status="info" variant="filled" isCompact>Info</Label>
                          </FlexItem>
                        </Flex>
                      </Td>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            flightctl-agent
                          </span>
                        </Content>
                      </Td>
                      <Td>Device heartbeat sent successfully</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            2024-10-22 19:30:12
                          </span>
                        </Content>
                      </Td>
                      <Td>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <CheckCircleIcon style={{ fontSize: '14px', color: '#3e8635' }} />
                          </FlexItem>
                          <FlexItem>
                            <Label status="success" variant="filled" isCompact>Success</Label>
                          </FlexItem>
                        </Flex>
                      </Td>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            systemd
                          </span>
                        </Content>
                      </Td>
                      <Td>Service chronyd.service started successfully</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            2024-10-22 19:29:45
                          </span>
                        </Content>
                      </Td>
                      <Td>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <ExclamationTriangleIcon style={{ fontSize: '14px', color: '#f0ab00' }} />
                          </FlexItem>
                          <FlexItem>
                            <Label status="warning" variant="filled" isCompact>Warning</Label>
                          </FlexItem>
                        </Flex>
                      </Td>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            kernel
                          </span>
                        </Content>
                      </Td>
                      <Td>Network interface enp1s0 link state changed to UP</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            2024-10-22 19:29:30
                          </span>
                        </Content>
                      </Td>
                      <Td>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <InfoCircleIcon style={{ fontSize: '14px', color: '#2b9af3' }} />
                          </FlexItem>
                          <FlexItem>
                            <Label status="info" variant="filled" isCompact>Info</Label>
                          </FlexItem>
                        </Flex>
                      </Td>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            flightctl-agent
                          </span>
                        </Content>
                      </Td>
                      <Td>Device configuration synchronized successfully</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            2024-10-22 19:28:15
                          </span>
                        </Content>
                      </Td>
                      <Td>
                        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                          <FlexItem>
                            <InfoCircleIcon style={{ fontSize: '14px', color: '#2b9af3' }} />
                          </FlexItem>
                          <FlexItem>
                            <Label status="info" variant="filled" isCompact>Info</Label>
                          </FlexItem>
                        </Flex>
                      </Td>
                      <Td>
                        <Content>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                            boot
                          </span>
                        </Content>
                      </Td>
                      <Td>System boot completed in 2.34s</Td>
                    </Tr>
                  </Tbody>
                </Table>

                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Button variant="link">
                    Load more events
                  </Button>
                </div>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>
        </div>
      </PageSection>

      {/* Resume Device Modal */}
      <ResumeDeviceModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        onConfirm={confirmResumeDevice}
        deviceName={device.alias || device.name}
        isLoading={isResuming}
      />
    </>
  );
};

export default DeviceDetailsPage;
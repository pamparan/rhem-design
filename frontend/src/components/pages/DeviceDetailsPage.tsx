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
  ServerIcon,
  NetworkIcon,
  CubeIcon,
  ClipboardIcon,
  ClockIcon,
  CogIcon,
  PlusIcon,
  CheckIcon,
  TimesIcon,
  SyncAltIcon,
  DownloadIcon,
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

  // Label management states
  const [labels, setLabels] = useState<string[]>(['device=test']);
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
    name: 'orange-device',
    shortName: 'gbp0sn...0574270',
    fleetName: 'Fitting Room Device',
    architecture: 'amd64',
    operatingSystem: 'linux',
    distro: 'CentOS Stream 9',
    hostname: 'localhost.localdomain',
    kernel: '5.14.0-570.el9.x86_64',
    netInterfaceDefault: 'enp1s0',
    netMACDefault: '52:54:00:2c:99:3e',
    productName: 'Standard PC (Q35 + ICH9, 2009)',
    bootID: '6a8a4653-e383-488f-82d8-0c7d3356cffc',
    netIPDefault: '192.168.122.93/24',
    productUUID: '13c4629c-fedc-4314-a616-65cb62526fe2',
    agentVersion: 'v1.0.0-main-92-ge92789ef',
    systemImage: 'quay.io/redhat/rhde:9.3',
  };

  // Mock applications data (matching the reference images)
  const mockApplications = [
    { name: 'Robot Controller v1', status: 'Running', ready: 'V1', restarts: '1', type: 'Embedded' },
    { name: 'Robot Brain v2', status: 'Updating', ready: '2/4', restarts: '0', type: 'Embedded' },
    { name: 'I- Inference Server', status: 'Running', ready: '', restarts: '0', type: '' },
    { name: 'I- Model', status: 'Downloading', ready: '', restarts: '0', type: '' },
    { name: 'I- Memory', status: 'Running', ready: '', restarts: '0', type: '' },
    { name: '|- Kill Switch', status: 'Degraded', ready: '', restarts: '0', type: '' },
    { name: 'Speech Subsystem v1', status: 'Running', ready: 'V1', restarts: '0', type: 'User-installed' },
  ];

  // Mock system services data
  const mockSystemServices = [
    { name: 'microshift.service', enabled: true, active: 'Active (Running)' },
    { name: 'crio.service', enabled: true, active: 'Active (Running)' },
    { name: 'logrotate.timer', enabled: false, active: 'Disabled' },
  ];

  // Mock resource status data matching staging
  const mockResourceStatus = {
    cpuPressure: { status: 'Within limits', severity: 'success' },
    diskPressure: { status: 'Within limits', severity: 'success' },
    memoryPressure: { status: 'Within limits', severity: 'success' },
  };

  // Mock system status
  const mockSystemStatus = {
    applicationStatus: 'Unknown',
    deviceStatus: 'Unknown',
    updateStatus: 'Unknown',
    integrityStatus: 'Unknown',
    lastSeen: '2 days ago'
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
      case 'Running':
        return <CheckCircleIcon style={{ color: '#3d7317' }} />;
      case 'Updating':
        return <InProgressIcon style={{ color: '#147878' }} />;
      case 'Downloading':
        return <InfoCircleIcon style={{ color: '#2b9af3' }} />;
      case 'Degraded':
        return <ExclamationTriangleIcon style={{ color: '#f0ab00' }} />;
      case 'Starting':
        return <InfoCircleIcon style={{ color: '#5e40be' }} />;
      default:
        return <TimesCircleIcon style={{ color: '#b1380b' }} />;
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
        return 'green';
      case 'Updating':
        return 'blue';
      case 'Downloading':
        return 'blue';
      case 'Degraded':
        return 'orange';
      default:
        return 'red';
    }
  };

  const deviceLabels = [
    'store=madrid',
    'location=fitting-room',
    'brand=zara',
    'country=spain',
    'type=camera',
    'production line=1'
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
          <TabContentBody>
            {/* Top Row - Full Width Device Information */}
            <Card style={{ marginBottom: '32px' }}>
              <CardTitle>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                  <FlexItem>
                    <ServerIcon style={{ fontSize: '16px', color: '#6a6e73' }} />
                  </FlexItem>
                  <FlexItem>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Device Information</h3>
                  </FlexItem>
                </Flex>
              </CardTitle>
              <CardBody>
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
                        <DescriptionListTerm>Architecture</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Label status="info" variant="filled" isCompact>
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
                          <Label status="info" variant="outline" isCompact>
                            {deviceInfo.distro}
                          </Label>
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
                    </DescriptionList>
                  </GridItem>
                  <GridItem span={3}>
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
                  <GridItem span={3}>
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Labels</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex spaceItems={{ default: 'spaceItemsXs' }} style={{ flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
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
                                <InputGroup>
                                  <InputGroupItem isFill>
                                    <TextInput
                                      type="text"
                                      placeholder="key=value"
                                      value={newLabelInput}
                                      onChange={(_event, value) => setNewLabelInput(value)}
                                      onKeyDown={handleKeyDown}
                                      style={{ fontSize: '12px', minWidth: '120px' }}
                                      autoFocus
                                    />
                                  </InputGroupItem>
                                  <InputGroupItem>
                                    <Button
                                      variant="plain"
                                      aria-label="Save label"
                                      onClick={handleSaveLabel}
                                      isDisabled={!newLabelInput.trim()}
                                      style={{ padding: '4px' }}
                                    >
                                      <CheckIcon style={{ fontSize: '12px', color: '#3e8635' }} />
                                    </Button>
                                  </InputGroupItem>
                                  <InputGroupItem>
                                    <Button
                                      variant="plain"
                                      aria-label="Cancel add label"
                                      onClick={handleCancelAddLabel}
                                      style={{ padding: '4px' }}
                                    >
                                      <TimesIcon style={{ fontSize: '12px', color: '#c9190b' }} />
                                    </Button>
                                  </InputGroupItem>
                                </InputGroup>
                              ) : (
                                <Button
                                  variant="link"
                                  style={{ padding: 0, fontSize: '12px' }}
                                  onClick={handleAddLabel}
                                  icon={<PlusIcon style={{ fontSize: '10px', marginRight: '4px' }} />}
                                >
                                  Add label
                                </Button>
                              )}
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                </Grid>

                {/* Expandable Technical Specifications */}
                <div style={{ marginTop: '24px' }}>
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
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '16px' }}>
                        <FlexItem>
                          <NetworkIcon style={{ fontSize: '16px', color: '#6a6e73' }} />
                        </FlexItem>
                        <FlexItem>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Default Interface</h4>
                        </FlexItem>
                      </Flex>
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

            {/* Bottom Row - Device Status (2/3 width) and stacked System Status + System Configuration (1/3 width) */}
            <Grid hasGutter style={{ marginBottom: '32px' }}>
              {/* Left Column - Device Status (Resource Status + System Services) - 2/3 width */}
              <GridItem span={8}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Device Status</h3>
                  </CardTitle>
                  <CardBody style={{ flex: 1, padding: '24px' }}>
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
                        <FlexItem>
                          <Button variant="link" style={{ padding: 0, fontSize: '14px', color: '#2b9af3' }}>
                            Track SystemD services
                          </Button>
                        </FlexItem>
                      </Flex>
                      <Table aria-label="System services table" variant="compact">
                        <Thead>
                          <Tr>
                            <Th>Service</Th>
                            <Th>Status</Th>
                            <Th>State</Th>
                            <Th>Sub-state</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {mockSystemServices.map((service, index) => (
                            <Tr key={index}>
                              <Td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {service.name.endsWith('.service') ? (
                                    <CogIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                                  ) : service.name.endsWith('.timer') ? (
                                    <ClockIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                                  ) : null}
                                  <span style={{ fontSize: '14px' }}>
                                    {service.name}
                                  </span>
                                </div>
                              </Td>
                              <Td>
                                <Label
                                  status={service.enabled ? 'success' : undefined}
                                  color={service.enabled ? undefined : 'grey'}
                                  variant="outline"
                                  icon={service.enabled ? <CheckCircleIcon /> : <TimesCircleIcon />}
                                >
                                  {service.enabled ? 'Enabled' : 'Disabled'}
                                </Label>
                              </Td>
                              <Td>
                                {service.active === 'Active (Running)' ? (
                                  <Label status="success" variant="outline">
                                    Active
                                  </Label>
                                ) : (
                                  '—'
                                )}
                              </Td>
                              <Td>
                                {service.active === 'Active (Running)' ? (
                                  <Label status="success" variant="outline">
                                    Running
                                  </Label>
                                ) : (
                                  '—'
                                )}
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Right Column - Stacked System Status and System Configuration - 1/3 width */}
              <GridItem span={4}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
                  {/* System Status */}
                  <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <CardTitle>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>System Status</h3>
                        <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
                          Last seen {mockSystemStatus.lastSeen}
                        </div>
                      </div>
                    </CardTitle>
                    <CardBody style={{ flex: 1, padding: '24px' }}>
                      <Grid hasGutter>
                        <GridItem span={6}>
                          <div style={{ marginBottom: '16px' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                              <FlexItem>
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>Application status</span>
                              </FlexItem>
                              <FlexItem>
                                <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                              </FlexItem>
                            </Flex>
                            <Label status="warning" variant="outline">
                              {mockSystemStatus.applicationStatus}
                            </Label>
                          </div>
                        </GridItem>
                        <GridItem span={6}>
                          <div style={{ marginBottom: '16px' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                              <FlexItem>
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>Device status</span>
                              </FlexItem>
                              <FlexItem>
                                <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                              </FlexItem>
                            </Flex>
                            <Label status="warning" variant="outline">
                              {mockSystemStatus.deviceStatus}
                            </Label>
                          </div>
                        </GridItem>
                        <GridItem span={6}>
                          <div style={{ marginBottom: '16px' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                              <FlexItem>
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>Update status</span>
                              </FlexItem>
                              <FlexItem>
                                <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                              </FlexItem>
                            </Flex>
                            <Label status="warning" variant="outline">
                              {mockSystemStatus.updateStatus}
                            </Label>
                          </div>
                        </GridItem>
                        <GridItem span={6}>
                          <div style={{ marginBottom: '16px' }}>
                            <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                              <FlexItem>
                                <span style={{ fontSize: '14px', fontWeight: '600' }}>Integrity status</span>
                              </FlexItem>
                              <FlexItem>
                                <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                              </FlexItem>
                            </Flex>
                            <Label status="warning" variant="outline">
                              {mockSystemStatus.integrityStatus}
                            </Label>
                          </div>
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* System Configuration */}
                  <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #d2d2d2', borderRadius: '8px' }}>
                    <CardTitle>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>System Configuration</h3>
                        <Label status="custom" variant="outline" icon={<InProgressIcon />}>
                          Updating
                        </Label>
                      </div>
                    </CardTitle>
                    <CardBody style={{ flex: 1 }}>
                      <DescriptionList isCompact>
                        <DescriptionListGroup>
                          <DescriptionListTerm>Fleet name</DescriptionListTerm>
                          <DescriptionListDescription>
                            <Button variant="link" style={{ padding: 0, color: '#2b9af3' }}>
                              {deviceInfo.fleetName}
                            </Button>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
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
                          <DescriptionListTerm>Sources (1)</DescriptionListTerm>
                          <DescriptionListDescription>App_definition</DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </CardBody>
                  </Card>
                </div>
              </GridItem>
            </Grid>

            {/* Application Status - Full Width */}
            <Card style={{ marginBottom: '32px' }}>
              <CardTitle>
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Application status</h3>
                  </div>
                  <div>
                    <Label status="success" variant="filled" icon={<CheckCircleIcon />}>
                      Healthy
                    </Label>
                  </div>
                </div>
              </CardTitle>
              <CardBody>
                {/* Applications List with Enhanced Hierarchy */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Applications (7)</h4>
                </div>

                {/* Expandable Applications Section */}
                <ExpandableSection
                  toggleContent={
                    <div style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '8px', border: '1px solid #d2d2d2', width: '100%' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <CheckCircleIcon style={{ fontSize: '14px', color: '#3d7317' }} />
                            </FlexItem>
                            <FlexItem>
                              <span style={{ fontSize: '14px', fontWeight: '600' }}>5 Running</span>
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <InProgressIcon style={{ fontSize: '14px', color: '#147878' }} />
                            </FlexItem>
                            <FlexItem>
                              <span style={{ fontSize: '14px', fontWeight: '600' }}>1 Updating</span>
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                        <FlexItem>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <ExclamationTriangleIcon style={{ fontSize: '14px', color: '#f0ab00' }} />
                            </FlexItem>
                            <FlexItem>
                              <span style={{ fontSize: '14px', fontWeight: '600' }}>1 Degraded</span>
                            </FlexItem>
                          </Flex>
                        </FlexItem>
                      </Flex>
                    </div>
                  }
                  isExpanded={isApplicationsExpanded}
                  onToggle={(_event, isExpanded) => setIsApplicationsExpanded(isExpanded)}
                  displaySize="lg"
                  style={{ marginBottom: '20px' }}
                >
                  <div style={{ marginTop: '16px' }}>
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
                    {/* Robot Applications */}
                    <Tr>
                      <Td>
                        <span style={{ fontSize: '14px' }}>Robot Controller v1</span>
                      </Td>
                      <Td>
                        <Label status="success" variant="outline">Running</Label>
                      </Td>
                      <Td>
                        V1
                      </Td>
                      <Td>1</Td>
                      <Td>
                        <Label variant="outline">Embedded</Label>
                      </Td>
                    </Tr>
                    <Tr style={{ backgroundColor: '#f8f9fa' }}>
                      <Td>
                        <span style={{ fontSize: '14px' }}>Robot Brain v2</span>
                      </Td>
                      <Td>
                        <div>
                          <Label status="custom" variant="outline" icon={<InProgressIcon />}>Updating</Label>
                          <div style={{ marginTop: '4px', fontSize: '11px', color: '#6a6e73' }}>
                            ⓘ Update in progress - 2 of 4 components ready
                          </div>
                        </div>
                      </Td>
                      <Td>
                        2/4
                      </Td>
                      <Td>0</Td>
                      <Td>
                        <Label variant="outline">Embedded</Label>
                      </Td>
                    </Tr>

                    {/* AI/ML Components */}
                    <Tr>
                      <Td>
                        <span style={{ fontSize: '14px' }}>I- Inference Server</span>
                      </Td>
                      <Td>
                        <Label status="success" variant="outline">Running</Label>
                      </Td>
                      <Td>—</Td>
                      <Td>0</Td>
                      <Td>—</Td>
                    </Tr>
                    <Tr style={{ backgroundColor: '#f8f9fa' }}>
                      <Td>
                        <span style={{ fontSize: '14px' }}>I- Model</span>
                      </Td>
                      <Td>
                        <div>
                          <Label status="info" variant="outline" icon={<DownloadIcon />}>Downloading</Label>
                          <div style={{ marginTop: '2px', fontSize: '11px', color: '#6a6e73' }}>
                            ⓘ Model download in progress
                          </div>
                        </div>
                      </Td>
                      <Td>—</Td>
                      <Td>0</Td>
                      <Td>—</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <span style={{ fontSize: '14px' }}>I- Memory</span>
                      </Td>
                      <Td>
                        <Label status="success" variant="outline">Running</Label>
                      </Td>
                      <Td>—</Td>
                      <Td>0</Td>
                      <Td>—</Td>
                    </Tr>
                    <Tr style={{ backgroundColor: '#fff9e6', border: '1px solid #f0ab00' }}>
                      <Td>
                        <span style={{ fontSize: '14px' }}>|- Kill Switch</span>
                      </Td>
                      <Td>
                        <div>
                          <Label status="warning" variant="outline">Degraded</Label>
                          <div style={{ marginTop: '4px', fontSize: '11px', color: '#b77b00' }}>
                            ⚠ Critical safety component requires attention
                          </div>
                        </div>
                      </Td>
                      <Td>—</Td>
                      <Td>0</Td>
                      <Td>—</Td>
                    </Tr>

                    {/* User Applications */}
                    <Tr>
                      <Td>
                        <span style={{ fontSize: '14px' }}>Speech Subsystem v1</span>
                      </Td>
                      <Td>
                        <Label status="success" variant="outline">Running</Label>
                      </Td>
                      <Td>
                        V1
                      </Td>
                      <Td>0</Td>
                      <Td>
                        <Label variant="outline">User-installed</Label>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
                  </div>
                </ExpandableSection>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>

        <TabContent id="yaml" eventKey="yaml" hidden={activeTab !== 'yaml'}>
          <TabContentBody>
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
  name: orange-device
  namespace: default
  labels:
    device: test
spec:
  fleetName: ""
  systemImage:
    image: quay.io/rh_ee_camadorg/centos-bootc-flightctl-local/local-rpm-v1
  applications: []
  resources: []
  systemd:
    units: []
status:
  phase: Online
  lastSeen: "2024-10-22T19:30:00Z"
  systemInfo:
    architecture: amd64
    operatingSystem: linux
    kernelVersion: 5.14.0-570.el9.x86_64
    bootID: 6a8a4653-e383-488f-82d8-0c7d3356cffc`}
                </div>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>

        <TabContent eventKey="terminal" id="terminal-tab" hidden={activeTab !== 'terminal'}>
          <TabContentBody>
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
          <TabContentBody>
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
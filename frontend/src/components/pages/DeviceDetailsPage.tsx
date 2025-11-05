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
  CopyIcon,
  ChevronDownIcon,
  EditIcon,
  ServerIcon,
  NetworkIcon,
  CubeIcon,
  ClipboardIcon,
  CogIcon,
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

  // Enhanced mock data matching staging environment
  const deviceInfo = {
    name: 'orange-device',
    shortName: 'gbp0sn...0574270',
    fleetName: 'None',
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
  };

  // Mock applications data
  const mockApplications = [
    { name: 'chronyd.service', status: 'Running', ready: '1/1', restarts: '0', type: 'Systemd' },
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
      case 'Starting':
        return <InfoCircleIcon style={{ color: '#5e40be' }} />;
      default:
        return <TimesCircleIcon style={{ color: '#b1380b' }} />;
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
            {/* Primary Device Information - Always Visible with Enhanced Layout */}
            <Grid hasGutter style={{ marginBottom: '32px' }}>
              {/* Left Column - Device Identity */}
              <GridItem span={4}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <ServerIcon style={{ fontSize: '16px', color: '#6a6e73' }} />
                      </FlexItem>
                      <FlexItem>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Device Identity</h3>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody style={{ flex: 1 }}>
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
                        <DescriptionListTerm>Fleet name</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>{deviceInfo.fleetName}</FlexItem>
                            <FlexItem>
                              <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Labels</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex spaceItems={{ default: 'spaceItemsXs' }} style={{ flexWrap: 'wrap', gap: '4px' }}>
                            <FlexItem>
                              <Label variant="outline" isCompact>
                                device=test
                              </Label>
                            </FlexItem>
                            <FlexItem>
                              <Button variant="link" style={{ padding: 0, fontSize: '12px' }}>
                                Add label
                              </Button>
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Middle Column - System Overview */}
              <GridItem span={4}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <CubeIcon style={{ fontSize: '16px', color: '#6a6e73' }} />
                      </FlexItem>
                      <FlexItem>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>System Overview</h3>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody style={{ flex: 1 }}>
                    <DescriptionList isCompact>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Architecture</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Label color="blue" variant="filled" isCompact>
                            {deviceInfo.architecture}
                          </Label>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Operating system</DescriptionListTerm>
                        <DescriptionListDescription>{deviceInfo.operatingSystem}</DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Distro</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Label color="cyan" variant="outline" isCompact>
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
                  </CardBody>
                </Card>
              </GridItem>

              {/* Right Column - Product Information */}
              <GridItem span={4}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <ClipboardIcon style={{ fontSize: '16px', color: '#6a6e73' }} />
                      </FlexItem>
                      <FlexItem>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Product Details</h3>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody style={{ flex: 1 }}>
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
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Expandable Technical Specifications */}
            <Card style={{ marginBottom: '32px' }}>
              <CardBody>
                <ExpandableSection
                  toggleText="Technical specifications"
                  toggleTextExpanded="Hide technical specifications"
                  isExpanded={isTechnicalExpanded}
                  onToggle={setIsTechnicalExpanded}
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
              </CardBody>
            </Card>

            {/* Expandable Network Configuration */}
            <Card style={{ marginBottom: '32px' }}>
              <CardBody>
                <ExpandableSection
                  toggleText="Network configuration"
                  toggleTextExpanded="Hide network configuration"
                  isExpanded={isNetworkExpanded}
                  onToggle={setIsNetworkExpanded}
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
              </CardBody>
            </Card>

            {/* Enhanced Status Cards */}
            <Grid hasGutter style={{ marginBottom: '32px' }}>
              {/* System Status */}
              <GridItem span={6}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                      <FlexItem>
                        <CogIcon style={{ fontSize: '16px', color: '#6a6e73' }} />
                      </FlexItem>
                      <FlexItem>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>System status</h3>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody style={{ flex: 1, padding: '24px' }}>
                    <Grid hasGutter>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '24px' }}>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                            <FlexItem>
                              <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Application status</h6>
                            </FlexItem>
                            <FlexItem>
                              <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                            </FlexItem>
                          </Flex>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <ExclamationTriangleIcon style={{ fontSize: '18px', color: '#dca614' }} />
                            </FlexItem>
                            <FlexItem>
                              <Label color="orange" variant="filled" isCompact>
                                {mockSystemStatus.applicationStatus}
                              </Label>
                            </FlexItem>
                          </Flex>
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '24px' }}>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                            <FlexItem>
                              <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Device status</h6>
                            </FlexItem>
                            <FlexItem>
                              <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                            </FlexItem>
                          </Flex>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <ExclamationTriangleIcon style={{ fontSize: '18px', color: '#dca614' }} />
                            </FlexItem>
                            <FlexItem>
                              <Label color="orange" variant="filled" isCompact>
                                {mockSystemStatus.deviceStatus}
                              </Label>
                            </FlexItem>
                          </Flex>
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '24px' }}>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                            <FlexItem>
                              <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Update status</h6>
                            </FlexItem>
                            <FlexItem>
                              <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                            </FlexItem>
                          </Flex>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <ExclamationTriangleIcon style={{ fontSize: '18px', color: '#dca614' }} />
                            </FlexItem>
                            <FlexItem>
                              <Label color="orange" variant="filled" isCompact>
                                {mockSystemStatus.updateStatus}
                              </Label>
                            </FlexItem>
                          </Flex>
                        </div>
                      </GridItem>
                      <GridItem span={6}>
                        <div style={{ marginBottom: '24px' }}>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }} style={{ marginBottom: '8px' }}>
                            <FlexItem>
                              <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Integrity status</h6>
                            </FlexItem>
                            <FlexItem>
                              <InfoCircleIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
                            </FlexItem>
                          </Flex>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <ExclamationTriangleIcon style={{ fontSize: '18px', color: '#dca614' }} />
                            </FlexItem>
                            <FlexItem>
                              <Label color="orange" variant="filled" isCompact>
                                {mockSystemStatus.integrityStatus}
                              </Label>
                            </FlexItem>
                          </Flex>
                        </div>
                      </GridItem>
                    </Grid>
                    <div style={{ borderTop: '1px solid #d2d2d2', paddingTop: '16px', marginTop: '8px' }}>
                      <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <FlexItem>
                          <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Last seen</h6>
                        </FlexItem>
                        <FlexItem>
                          <span style={{ color: '#6a6e73' }}>{mockSystemStatus.lastSeen}</span>
                        </FlexItem>
                      </Flex>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Resource Status */}
              <GridItem span={6}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Resource status</h3>
                  </CardTitle>
                  <CardBody style={{ flex: 1, padding: '24px' }}>
                    <Grid hasGutter>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '24px' }}>
                          <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>CPU pressure</h6>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <CheckCircleIcon style={{ fontSize: '18px', color: '#3d7317' }} />
                            </FlexItem>
                            <FlexItem>
                              <Label color="green" variant="filled" isCompact>
                                {mockResourceStatus.cpuPressure.status}
                              </Label>
                            </FlexItem>
                          </Flex>
                        </div>
                      </GridItem>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '24px' }}>
                          <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Disk pressure</h6>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <CheckCircleIcon style={{ fontSize: '18px', color: '#3d7317' }} />
                            </FlexItem>
                            <FlexItem>
                              <Label color="green" variant="filled" isCompact>
                                {mockResourceStatus.diskPressure.status}
                              </Label>
                            </FlexItem>
                          </Flex>
                        </div>
                      </GridItem>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '24px' }}>
                          <h6 style={{ margin: 0, fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Memory pressure</h6>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem>
                              <CheckCircleIcon style={{ fontSize: '18px', color: '#3d7317' }} />
                            </FlexItem>
                            <FlexItem>
                              <Label color="green" variant="filled" isCompact>
                                {mockResourceStatus.memoryPressure.status}
                              </Label>
                            </FlexItem>
                          </Flex>
                        </div>
                      </GridItem>
                    </Grid>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Configurations and Applications */}
            <Grid hasGutter style={{ marginBottom: '32px' }}>
              {/* Configurations */}
              <GridItem span={6}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Configurations</h3>
                  </CardTitle>
                  <CardBody style={{ flex: 1 }}>
                    <ExpandableSection
                      toggleText="System image details"
                      toggleTextExpanded="Hide system image details"
                      isExpanded={isConfigExpanded}
                      onToggle={setIsConfigExpanded}
                    >
                      <div style={{ marginTop: '16px' }}>
                        <DescriptionList isHorizontal>
                          <DescriptionListGroup>
                            <DescriptionListTerm>System image (running)</DescriptionListTerm>
                            <DescriptionListDescription>
                              <Content>
                                <span style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.4' }}>
                                  {mockConfigurations.systemImage}
                                </span>
                              </Content>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Sources</DescriptionListTerm>
                            <DescriptionListDescription>
                              <Label color="grey" variant="outline" isCompact>
                                ({mockConfigurations.sources})
                              </Label>
                              <span style={{ marginLeft: '8px', color: '#6a6e73' }}>–</span>
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                      </div>
                    </ExpandableSection>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Applications */}
              <GridItem span={6}>
                <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardTitle>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Applications</h3>
                      </FlexItem>
                      <FlexItem>
                        <Button variant="link" style={{ padding: 0, fontSize: '14px' }}>
                          Track systemd services
                        </Button>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody style={{ flex: 1 }}>
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
                              <Content>
                                <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                                  {app.name}
                                </span>
                              </Content>
                            </Td>
                            <Td>
                              <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                                <FlexItem>
                                  <CheckCircleIcon style={{ fontSize: '16px', color: '#3d7317' }} />
                                </FlexItem>
                                <FlexItem>
                                  <Label color="green" variant="filled" isCompact>
                                    {app.status}
                                  </Label>
                                </FlexItem>
                              </Flex>
                            </Td>
                            <Td>
                              <Label color="blue" variant="outline" isCompact>
                                {app.ready}
                              </Label>
                            </Td>
                            <Td>{app.restarts}</Td>
                            <Td>
                              <Label color="cyan" variant="outline" isCompact>
                                {app.type}
                              </Label>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
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
                            <Label color="blue" variant="filled" isCompact>Info</Label>
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
                            <Label color="green" variant="filled" isCompact>Success</Label>
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
                            <Label color="orange" variant="filled" isCompact>Warning</Label>
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
                            <Label color="blue" variant="filled" isCompact>Info</Label>
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
                            <Label color="blue" variant="filled" isCompact>Info</Label>
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
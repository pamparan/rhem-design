import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Label,
  Button,
  Alert,
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
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Flex,
  FlexItem,
  Icon,
  Divider,
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
  EllipsisVIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TimesCircleIcon,
  InfoCircleIcon,
  CopyIcon,
  ExternalLinkAltIcon,
  ChevronDownIcon,
} from '@patternfly/react-icons';
import ResumeDeviceModal from '../shared/ResumeDeviceModal';
import { Device } from '../../types/device';
import { getStatusLabelStyle, getStatusLabel, getStatusIcon, isDeviceResumable } from '../../utils/deviceUtils';

interface DeviceDetailsPageProps {
  device: Device;
  onNavigateToSuspendedDevices?: () => void;
  onBack: () => void;
}

const DeviceDetailsPage: React.FC<DeviceDetailsPageProps> = ({
  device,
  onNavigateToSuspendedDevices = () => console.log('Navigate to suspended devices'),
  onBack
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [activeTab, setActiveTab] = useState<string | number>('details');

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

  const isSuspended = device.status === 'SUSPENDED';

  // Mock data for applications table
  const mockApplications = [
    { name: 'Application Monitor Rooms', status: 'Running', ready: '4/4', restarts: '1', type: 'App' },
    { name: 'Application log visitors', status: 'Starting', ready: '2/4', restarts: '0', type: 'App' },
    { name: 'kjekjer789epw', status: 'Running', ready: '4/4', restarts: '0', type: 'SystemD service' },
  ];

  // Mock resource status data
  const mockResourceStatus = {
    cpuPressure: { status: 'Past threshold (90%)', severity: 'danger' },
    memoryPressure: { status: 'Past threshold (50%)', severity: 'warning' },
    diskPressure: { status: 'Within limits (70%)', severity: 'success' },
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
      <PageSection variant="light" style={{ paddingBottom: '8px' }}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack} style={{ padding: 0, color: '#06c' }}>
              Devices
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{device.alias || device.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {/* Header */}
      <PageSection>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              {device.alias || device.name}
            </Title>
          </FlexItem>
          <FlexItem>
            <Dropdown
              isOpen={isActionsOpen}
              onSelect={() => setIsActionsOpen(false)}
              onOpenChange={setIsActionsOpen}
              toggle={(toggleRef) => (
                <MenuToggle
                  ref={toggleRef}
                  variant="primary"
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                >
                  Actions <ChevronDownIcon />
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem onClick={() => console.log('Edit configurations')}>
                  Edit configurations
                </DropdownItem>
                <DropdownItem onClick={() => console.log('View device details')}>
                  View device details
                </DropdownItem>
                <DropdownItem onClick={() => console.log('Decommission device')}>
                  Decommission device
                </DropdownItem>
                <DropdownItem
                  isDisabled={!isDeviceResumable(device)}
                  onClick={handleResumeDevice}
                >
                  Resume suspended device
                </DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Suspended Device Alert */}
      {isSuspended && (
        <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
          <Alert
            variant="danger"
            title="Device suspended"
            actionLinks={
              <>
                <Button variant="link" onClick={handleResumeDevice}>
                  Resume Device
                </Button>
                <Button variant="link" onClick={onNavigateToSuspendedDevices}>
                  View Suspended Devices
                </Button>
              </>
            }
          >
            <p>
              This device's configuration is newer than the server's record, likely due to a recent system restore.
              It is protected from receiving outdated updates but will remain suspended until you resume it.
            </p>
            <p style={{ marginTop: '8px', fontWeight: 'bold' }}>
              Warning: Please review this device's configuration before taking action. Resuming a device will cause
              it to apply the current specification, which may be older than what is on the device.
            </p>
          </Alert>
        </PageSection>
      )}

      {/* Tabs */}
      <PageSection style={{ paddingTop: 0 }}>
        <Tabs
          activeKey={activeTab}
          onSelect={(event, tabIndex) => setActiveTab(tabIndex)}
          aria-label="Device details tabs"
          role="region"
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="metrics" title={<TabTitleText>Metrics</TabTitleText>} />
          <Tab eventKey="terminal" title={<TabTitleText>Terminal</TabTitleText>} />
          <Tab eventKey="events" title={<TabTitleText>Events</TabTitleText>} />
        </Tabs>

        <TabContent eventKey="details" activeKey={activeTab}>
          <TabContentBody>
            {/* Basic Device Info */}
            <Card style={{ marginBottom: '24px' }}>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={4}>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Name</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
                            <FlexItem style={{ fontFamily: 'monospace' }}>{device.name}</FlexItem>
                            <FlexItem>
                              <Button variant="plain" aria-label="Copy device name">
                                <CopyIcon />
                              </Button>
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                  <GridItem span={4}>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Fleet name</DescriptionListTerm>
                        <DescriptionListDescription>
                          {device.fleet ? (
                            <Button variant="link" style={{ padding: 0 }}>
                              {device.fleet}
                            </Button>
                          ) : '--'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                  <GridItem span={4}>
                    <DescriptionList>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Device labels</DescriptionListTerm>
                        <DescriptionListDescription>
                          <Flex spaceItems={{ default: 'spaceItemsXs' }} style={{ flexWrap: 'wrap', gap: '4px' }}>
                            {deviceLabels.map((label, index) => (
                              <FlexItem key={index}>
                                <Label variant="outline" style={{ fontSize: '11px', padding: '2px 6px' }}>
                                  {label}
                                </Label>
                              </FlexItem>
                            ))}
                            <FlexItem>
                              <Button variant="link" style={{ padding: 0, fontSize: '12px' }}>
                                Add label
                              </Button>
                            </FlexItem>
                          </Flex>
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    </DescriptionList>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            <Grid hasGutter>
              {/* System Status */}
              <GridItem span={6}>
                <Card style={{ height: '100%' }}>
                  <CardBody>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">
                          System status <InfoCircleIcon style={{ marginLeft: '4px', color: '#6a6e73' }} />
                        </Title>
                      </FlexItem>
                    </Flex>

                    <Grid hasGutter>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Application status <InfoCircleIcon style={{ marginLeft: '4px', color: '#6a6e73' }} /></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {React.createElement(getStatusIcon(device.applicationStatus), { style: { fontSize: '12px', color: getStatusLabelStyle(device.applicationStatus).color } })}
                              {getStatusLabel(device.applicationStatus)}
                            </div>
                          </div>
                        </div>
                      </GridItem>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Device status <InfoCircleIcon style={{ marginLeft: '4px', color: '#6a6e73' }} /></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {React.createElement(getStatusIcon(device.status), { style: { fontSize: '12px', color: getStatusLabelStyle(device.status).color } })}
                              {getStatusLabel(device.status)}
                            </div>
                          </div>
                        </div>
                      </GridItem>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Update status</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {React.createElement(getStatusIcon(device.systemUpdateStatus), { style: { fontSize: '12px', color: getStatusLabelStyle(device.systemUpdateStatus).color } })}
                              {getStatusLabel(device.systemUpdateStatus)}
                            </div>
                          </div>
                        </div>
                      </GridItem>
                    </Grid>

                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Last seen</div>
                      <div style={{ color: '#6a6e73' }}>{device.lastSeen}</div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Resource Status */}
              <GridItem span={6}>
                <Card style={{ height: '100%' }}>
                  <CardBody>
                    <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                      Resource status
                    </Title>

                    <Grid hasGutter>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>CPU pressure</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {renderStatusIcon(mockResourceStatus.cpuPressure.severity)}
                            <span style={{ fontSize: '14px' }}>{mockResourceStatus.cpuPressure.status}</span>
                          </div>
                        </div>
                      </GridItem>
                      <GridItem span={4}>
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Disk pressure</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {renderStatusIcon(mockResourceStatus.diskPressure.severity)}
                            <span style={{ fontSize: '14px' }}>{mockResourceStatus.diskPressure.status}</span>
                          </div>
                        </div>
                      </GridItem>
                    </Grid>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Memory pressure</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {renderStatusIcon(mockResourceStatus.memoryPressure.severity)}
                        <span style={{ fontSize: '14px' }}>{mockResourceStatus.memoryPressure.status}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            <Grid hasGutter style={{ marginTop: '24px' }}>
              {/* Configurations */}
              <GridItem span={6}>
                <Card style={{ height: '100%' }}>
                  <CardBody>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">
                          Configurations <InfoCircleIcon style={{ marginLeft: '4px', color: '#6a6e73' }} />
                        </Title>
                      </FlexItem>
                    </Flex>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>System image (running)</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>quay.io/redhat/rhde 9.3</span>
                        <ExclamationTriangleIcon style={{ color: '#dca614' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Sources (1)</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>App_definition</div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Device overrides</div>
                      <div>Enabled</div>
                    </div>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Applications */}
              <GridItem span={6}>
                <Card style={{ height: '100%' }}>
                  <CardBody>
                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                      <FlexItem>
                        <Title headingLevel="h3" size="lg">Applications</Title>
                      </FlexItem>
                      <FlexItem>
                        <Button variant="link" style={{ padding: 0 }}>
                          Track SystemD services
                        </Button>
                      </FlexItem>
                    </Flex>

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
                            <Td>{app.name}</Td>
                            <Td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {renderApplicationStatusIcon(app.status)}
                                {app.status}
                              </div>
                            </Td>
                            <Td>{app.ready}</Td>
                            <Td>{app.restarts}</Td>
                            <Td>{app.type}</Td>
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

        <TabContent eventKey="metrics" activeKey={activeTab}>
          <TabContentBody>
            <Card>
              <CardBody>
                <Title headingLevel="h2" size="lg">Metrics</Title>
                <p>Device metrics and monitoring data will be displayed here.</p>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>

        <TabContent eventKey="terminal" activeKey={activeTab}>
          <TabContentBody>
            <Card>
              <CardBody>
                <Title headingLevel="h2" size="lg">Terminal</Title>
                <p>Device terminal access will be available here.</p>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>

        <TabContent eventKey="events" activeKey={activeTab}>
          <TabContentBody>
            <Card>
              <CardBody>
                <Title headingLevel="h2" size="lg">Events</Title>
                <p>Device events and logs will be displayed here.</p>
              </CardBody>
            </Card>
          </TabContentBody>
        </TabContent>
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
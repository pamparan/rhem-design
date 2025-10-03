import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  Tab,
  TabTitleText,
  TabContent,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle,
  Progress,
  ProgressVariant,
  Grid,
  GridItem,
  Alert,
  Label,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import {
  EllipsisVIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TimesCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  InProgressIcon,
  WarningTriangleIcon,
} from '@patternfly/react-icons';
import { mockDevices } from '../../data/mockData';

interface FleetDetailsPageProps {
  fleetId: string;
  onBack: () => void;
}

// Mock fleet data - in real app would come from props or API
const mockFleetDetails = {
  id: '1',
  name: 'Fitting Room Devices',
  status: 'Valid',
  created: '30 January 2025',
  systemImage: '-',
  deviceSelector: 'key=value',
  managedBy: '-',
  sources: 0,
  upToDate: 125,
  total: 200,
};

// Mock rollout data
const mockRollouts = [
  {
    id: '1',
    name: 'Batch 1 (10)',
    started: '12:36 02-04-24',
    ended: '--',
    progress: 70,
    variant: 'success' as const,
  },
  {
    id: '2',
    name: 'Batch 2 (42)',
    started: '12:36 02-04-24',
    ended: '--',
    progress: 90,
    variant: 'success' as const,
  },
  {
    id: '3',
    name: 'Auto-Batch (26)',
    started: '--',
    ended: '--',
    progress: 0,
    variant: 'warning' as const,
    status: 'Pending',
  },
];

// Mock events
const mockEvents = [
  {
    id: '1',
    type: 'Update rollout failed',
    message: 'Some descriptive alert message would exist here!',
    time: 'Jun 17, 11:56',
    severity: 'warning' as const,
  },
  {
    id: '2',
    type: 'Update rollout failed',
    message: 'Some descriptive alert message would exist here!',
    time: 'Jun 17, 11:56',
    severity: 'warning' as const,
  },
  {
    id: '3',
    type: 'Update rollout failed',
    message: 'Some descriptive alert message would exist here!',
    time: 'Jun 17, 11:56',
    severity: 'warning' as const,
  },
  {
    id: '4',
    type: 'Update rollout failed',
    message: 'Some descriptive alert message would exist here!',
    time: 'Jun 17, 11:56',
    severity: 'warning' as const,
  },
  {
    id: '5',
    type: 'Update rollout failed',
    message: 'Some descriptive alert message would exist here!',
    time: 'Jun 17, 11:56',
    severity: 'warning' as const,
  },
  {
    id: '6',
    type: 'Update rollout failed',
    message: 'Some descriptive alert message would exist here!',
    time: 'Jun 17, 11:56',
    severity: 'warning' as const,
  },
];

const FleetDetailsPage: React.FC<FleetDetailsPageProps> = ({ fleetId, onBack }) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>('details');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Filter devices for this fleet
  const fleetDevices = mockDevices.filter(device => device.fleet === mockFleetDetails.name);

  // Calculate device status counts
  const deviceStatusCounts = {
    online: fleetDevices.filter(d => d.status === 'ONLINE').length,
    error: fleetDevices.filter(d => d.status === 'ERROR').length,
    poweredOff: fleetDevices.filter(d => d.status === 'POWERED_OFF').length,
    rebooting: fleetDevices.filter(d => d.status === 'REBOOTING').length,
    degraded: fleetDevices.filter(d => d.status === 'DEGRADED').length,
    unknown: fleetDevices.filter(d => d.status === 'UNKNOWN').length,
  };

  // Calculate application status counts
  const appStatusCounts = {
    healthy: fleetDevices.filter(d => d.applicationStatus === 'HEALTHY').length,
    error: fleetDevices.filter(d => d.applicationStatus === 'ERROR').length,
    degraded: fleetDevices.filter(d => d.applicationStatus === 'DEGRADED').length,
    unknown: fleetDevices.filter(d => d.applicationStatus === 'UNKNOWN').length,
  };

  // Calculate system update status counts
  const systemUpdateCounts = {
    upToDate: fleetDevices.filter(d => d.systemUpdateStatus === 'UP_TO_DATE').length,
    outOfDate: fleetDevices.filter(d => d.systemUpdateStatus === 'OUT_OF_DATE').length,
    updating: fleetDevices.filter(d => d.systemUpdateStatus === 'UPDATING').length,
    unknown: fleetDevices.filter(d => d.systemUpdateStatus === 'UNKNOWN').length,
  };

  // Create donut chart data
  const createDonutSVG = (data: Array<{label: string, value: number, color: string}>, total: number, centerText: string) => {
    let cumulativePercentage = 0;
    const radius = 80;
    const strokeWidth = 20;

    return (
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
          {data.map((segment, index) => {
            const percentage = total > 0 ? (segment.value / total) * 100 : 0;
            const strokeDasharray = `${percentage * 2.51} 251`; // 251 ≈ 2π * radius / 100 * 50
            const strokeDashoffset = -cumulativePercentage * 2.51;

            cumulativePercentage += percentage;

            return percentage > 0 ? (
              <circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            ) : null;
          })}
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#151515',
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{centerText}</div>
          <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '4px' }}>
            {total === 4540 ? 'Application Status' : total === 3210 ? 'Device Status' : 'System Update Status'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Breadcrumb */}
      <PageSection style={{ paddingBottom: '8px' }}>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack} style={{ padding: 0, color: '#06c' }}>
              Fleets
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{mockFleetDetails.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {/* Header */}
      <PageSection style={{ paddingTop: '8px', paddingBottom: '16px' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              {mockFleetDetails.name}
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
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  variant="primary"
                >
                  Actions
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem>Edit fleet</DropdownItem>
                <DropdownItem>Duplicate fleet</DropdownItem>
                <DropdownItem>Delete fleet</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>
      </PageSection>

      {/* Tabs */}
      <PageSection style={{ paddingTop: 0 }}>
        <Tabs
          activeKey={activeTabKey}
          onSelect={(event, tabIndex) => setActiveTabKey(tabIndex)}
          style={{ borderBottom: '1px solid #d2d2d2' }}
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} />
        </Tabs>

        <TabContent eventKey="details" activeKey={activeTabKey} hidden={activeTabKey !== 'details'}>
          <Grid hasGutter style={{ marginTop: '24px' }}>
            {/* Left Column - Details and Fleet Devices */}
            <GridItem span={8}>
              {/* Details Section */}
              <Card style={{ marginBottom: '24px' }}>
                <CardBody>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
                    Details
                  </Title>

                  <Grid hasGutter>
                    <GridItem span={4}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Created</div>
                        <div>{mockFleetDetails.created}</div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Up-to-date/devices</div>
                        <div>
                          <span style={{ color: mockFleetDetails.upToDate === mockFleetDetails.total ? '#3e8635' : '#f0ab00' }}>
                            ⚠ {mockFleetDetails.upToDate}
                          </span>
                          <span style={{ color: '#6a6e73' }}>/{mockFleetDetails.total}</span>
                        </div>
                      </div>
                    </GridItem>
                    <GridItem span={4}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Status</div>
                        <div>
                          <span style={{ color: '#3e8635' }}>✓ {mockFleetDetails.status}</span>
                        </div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Device selector</div>
                        <div style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
                          {mockFleetDetails.deviceSelector}
                        </div>
                      </div>
                    </GridItem>
                    <GridItem span={4}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>System image</div>
                        <div>{mockFleetDetails.systemImage}</div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Managed by</div>
                        <div>{mockFleetDetails.managedBy}</div>
                      </div>
                    </GridItem>
                  </Grid>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Sources ({mockFleetDetails.sources})</div>
                    <div>{mockFleetDetails.sources === 0 ? '-' : ''}</div>
                  </div>
                </CardBody>
              </Card>

              {/* Fleet Devices Charts */}
              <Card>
                <CardBody>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>
                    Fleet devices
                  </Title>

                  <Grid hasGutter>
                    {/* Application Status Chart */}
                    <GridItem span={4}>
                      <div style={{ textAlign: 'center' }}>
                        {createDonutSVG([
                          { label: 'Healthy', value: 2280, color: '#3e8635' },
                          { label: 'Error', value: 1135, color: '#c9190b' },
                          { label: 'Degraded', value: 228, color: '#f0ab00' },
                          { label: 'Unknown', value: 897, color: '#6a6e73' },
                        ], 4540, '4540')}

                        <div style={{ marginTop: '16px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#3e8635', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>50% Healthy</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#c9190b', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>25% Error</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#f0ab00', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>5% Degraded</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#6a6e73', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>20% Unknown</span>
                          </div>
                        </div>
                      </div>
                    </GridItem>

                    {/* Device Status Chart */}
                    <GridItem span={4}>
                      <div style={{ textAlign: 'center' }}>
                        {createDonutSVG([
                          { label: 'Online', value: 2247, color: '#3e8635' },
                          { label: 'Error', value: 321, color: '#c9190b' },
                          { label: 'Rebooting', value: 642, color: '#2b9af3' },
                          { label: 'Unknown', value: 0, color: '#6a6e73' },
                        ], 3210, '3210')}

                        <div style={{ marginTop: '16px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#3e8635', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>70% Online</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#c9190b', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>10% Error</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#2b9af3', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>20% Rebooting</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#6a6e73', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>0% Unknown</span>
                          </div>
                        </div>
                      </div>
                    </GridItem>

                    {/* System Update Status Chart */}
                    <GridItem span={4}>
                      <div style={{ textAlign: 'center' }}>
                        {createDonutSVG([
                          { label: 'Up to date', value: 1391, color: '#3e8635' },
                          { label: 'Out of date', value: 214, color: '#f0ab00' },
                          { label: 'Updating', value: 428, color: '#2b9af3' },
                          { label: 'Unknown', value: 107, color: '#6a6e73' },
                        ], 2140, '2140')}

                        <div style={{ marginTop: '16px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#3e8635', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>65% Up to date</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#f0ab00', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>10% Out of date</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#2b9af3', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>20% Updating</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '12px', height: '12px', backgroundColor: '#6a6e73', marginRight: '8px' }}></div>
                            <span style={{ fontSize: '14px' }}>5% Unknown</span>
                          </div>
                        </div>
                      </div>
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>

              {/* In-progress Rollouts */}
              <Card style={{ marginTop: '24px' }}>
                <CardBody>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>
                    In-progress rollouts
                  </Title>

                  <Grid hasGutter>
                    {mockRollouts.map((rollout, index) => (
                      <GridItem span={4} key={rollout.id}>
                        <Card style={{ border: '1px solid #d2d2d2' }}>
                          <CardBody style={{ padding: '16px' }}>
                            <div style={{ marginBottom: '16px' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                                {rollout.name}
                              </div>
                              <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '4px' }}>
                                Started: {rollout.started}
                              </div>
                              <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '12px' }}>
                                Ended: {rollout.ended}
                              </div>

                              {rollout.status === 'Pending' ? (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '60px',
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '4px',
                                  color: '#e91e63',
                                  fontSize: '24px',
                                  fontWeight: 'bold'
                                }}>
                                  TBD
                                </div>
                              ) : (
                                <div>
                                  <div style={{
                                    width: '100%',
                                    height: '20px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    marginBottom: '8px'
                                  }}>
                                    <div style={{
                                      height: '100%',
                                      width: `${rollout.progress}%`,
                                      backgroundColor: rollout.variant === 'success' ? '#3e8635' : '#c9190b',
                                      borderRadius: '10px',
                                      transition: 'width 0.3s ease'
                                    }} />
                                  </div>
                                  <div style={{ fontSize: '14px', color: '#6a6e73', textAlign: 'center' }}>
                                    {rollout.progress}% {rollout.variant === 'success' ? '✓' : '✗'}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      </GridItem>
                    ))}
                  </Grid>
                </CardBody>
              </Card>
            </GridItem>

            {/* Right Column - Events */}
            <GridItem span={4}>
              <Card style={{ height: 'fit-content' }}>
                <CardBody>
                  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '16px' }}>
                    <FlexItem>
                      <Title headingLevel="h3" size="lg">
                        Events
                      </Title>
                    </FlexItem>
                    <FlexItem>
                      <Button variant="plain" style={{ padding: '4px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8z"/>
                          <path d="M8 4.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                          <path d="M8 10.5a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1z"/>
                        </svg>
                      </Button>
                    </FlexItem>
                  </Flex>

                  <div style={{ fontSize: '14px', color: '#6a6e73', marginBottom: '16px' }}>
                    (Updated &lt;1 min ago)
                  </div>

                  <Dropdown
                    isOpen={false}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        style={{ width: '100%', marginBottom: '16px' }}
                      >
                        Warning ▼
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem>All</DropdownItem>
                      <DropdownItem>Warning</DropdownItem>
                      <DropdownItem>Error</DropdownItem>
                      <DropdownItem>Info</DropdownItem>
                    </DropdownList>
                  </Dropdown>

                  <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {mockEvents.map((event) => (
                      <div key={event.id} style={{
                        marginBottom: '16px',
                        padding: '12px',
                        border: '1px solid #f0ab00',
                        borderRadius: '4px',
                        backgroundColor: '#fffdf7'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <ExclamationTriangleIcon style={{ color: '#f0ab00', marginRight: '8px', fontSize: '16px' }} />
                          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{event.type}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#151515', marginBottom: '8px' }}>
                          {event.message}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6a6e73' }}>
                          {event.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </TabContent>

        <TabContent eventKey="yaml" activeKey={activeTabKey} hidden={activeTabKey !== 'yaml'}>
          <Card style={{ marginTop: '24px' }}>
            <CardBody>
              <div style={{
                fontFamily: 'monospace',
                backgroundColor: '#f5f5f5',
                padding: '16px',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap'
              }}>
                {`apiVersion: v1alpha1
kind: Fleet
metadata:
  name: fitting-room-devices
  namespace: default
spec:
  selector:
    matchLabels:
      key: value
  template:
    metadata:
      labels:
        environment: production
    spec:
      config:
        systemImage: "registry.example.com/fleet:latest"
      devices:
        selector:
          matchLabels:
            location: fitting-room`}
              </div>
            </CardBody>
          </Card>
        </TabContent>
      </PageSection>
    </>
  );
};

export default FleetDetailsPage;
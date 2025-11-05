import React, { useState, useMemo } from 'react';
import {
  PageSection,
  PageBreadcrumb,
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
  Grid,
  GridItem,
  Flex,
  FlexItem,
  Label,
} from '@patternfly/react-core';
import {
  ExclamationTriangleIcon,
} from '@patternfly/react-icons';
import PostRestoreBanners from '../shared/PostRestoreBanners';
import DonutChart from '../shared/DonutChart';
import { mockDevices, mockFleets } from '../../data/mockData';
import { NavigationItemId, NavigationParams, ViewType } from '../../types/app';
import { useDeviceStatusesCount } from '../../hooks/useDeviceStatusesCount';
import { statusDescriptions } from '../../utils/fleetUtils';

interface FleetDetailsPageProps {
  fleetId: string;
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

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


const FleetDetailsPage: React.FC<FleetDetailsPageProps> = ({
  fleetId,
  onNavigate,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<string | number>('details');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const fleetDetails = mockFleets.find(f => f.id === fleetId) || mockFleets[0];

  const fleetDevices = useMemo(() => 
    mockDevices.filter(device => device.fleet === fleetDetails.name),
    [fleetDetails.name]
  );

  const { appStatusChartData, deviceStatusChartData, systemUpdateChartData } = useDeviceStatusesCount(fleetDevices);

  const fleetUpToDate = fleetDevices.filter(device => device.systemUpdateStatus === 'UP_TO_DATE').length;
  const fleetTotal = fleetDevices.length;

  return (
    <>
      {/* Breadcrumb */}
      <PageBreadcrumb>
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={() => onNavigate('main')}>
              Fleets
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{fleetDetails.name}</BreadcrumbItem>
        </Breadcrumb>
      </PageBreadcrumb>

      <PostRestoreBanners onNavigate={onNavigate} />

      {/* Header, Tabs and Content - Combined */}
      <PageSection variant="light">
        {/* Header */}
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }} style={{ marginBottom: '24px' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              {fleetDetails.name}
            </Title>
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
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  variant="primary"
                >
                  Actions
                </MenuToggle>
              )}
            >
              <DropdownList>
                <DropdownItem>Edit fleet</DropdownItem>
                <DropdownItem>Delete fleet</DropdownItem>
              </DropdownList>
            </Dropdown>
          </FlexItem>
        </Flex>

        {/* Tabs */}
        <Tabs
          activeKey={activeTabKey}
          onSelect={(_event, tabIndex) => setActiveTabKey(tabIndex)}
          usePageInsets
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} />
        </Tabs>
        <TabContent id="details" eventKey="details" activeKey={activeTabKey} hidden={activeTabKey !== 'details'}>
          <Grid hasGutter>
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
                        <div>{fleetDetails.created}</div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Up-to-date/devices</div>
                        <div>
                          <span style={{ color: fleetUpToDate === fleetTotal ? '#3e8635' : '#f0ab00' }}>
                            ⚠ {fleetUpToDate}
                          </span>
                          <span style={{ color: '#6a6e73' }}>/{fleetTotal}</span>
                        </div>
                      </div>
                    </GridItem>
                    <GridItem span={4}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Status</div>
                        <Label
                          variant='outline'
                          status={fleetDetails.status === 'Valid' ? 'success' : 'danger'}
                        >
                          {fleetDetails.status}
                        </Label>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Device selector</div>
                        <Label
                          variant="outline"
                        >
                          {fleetDetails.deviceSelector}
                        </Label>
                      </div>
                    </GridItem>
                    <GridItem span={4}>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>System image</div>
                        <div>{fleetDetails.systemImage}</div>
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Managed by</div>
                        <div>{fleetDetails.managedBy}</div>
                      </div>
                    </GridItem>
                  </Grid>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Sources ({fleetDetails.sources})</div>
                    <div>{fleetDetails.sources === 0 ? '-' : ''}</div>
                  </div>
                </CardBody>
              </Card>

              {/* Fleet Devices Charts */}
              <Card>
                <CardBody>
                  <Title headingLevel="h3" size="lg" style={{ marginBottom: '4px' }}>
                    Fleet devices
                  </Title>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6a6e73',
                    marginBottom: '24px'
                  }}>
                    {fleetDevices.length} {fleetDevices.length === 1 ? 'device' : 'devices'}
                  </div>

                  <Grid hasGutter>
                    <GridItem span={4}>
                      <DonutChart 
                        data={appStatusChartData} 
                        title="Application Status"
                        titlePopoverContent={statusDescriptions.applicationStatus}
                      />
                    </GridItem>

                    <GridItem span={4}>
                      <DonutChart 
                        data={deviceStatusChartData} 
                        title="Device Status"
                        titlePopoverContent={statusDescriptions.deviceStatus}
                      />
                    </GridItem>

                    <GridItem span={4}>
                      <DonutChart 
                        data={systemUpdateChartData} 
                        title="System Update Status"
                        titlePopoverContent={statusDescriptions.systemUpdateStatus}
                      />
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
                    {mockRollouts.map((rollout) => (
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
                        Warning
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

        <TabContent id="yaml" eventKey="yaml" activeKey={activeTabKey} hidden={activeTabKey !== 'yaml'}>
          <Card>
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
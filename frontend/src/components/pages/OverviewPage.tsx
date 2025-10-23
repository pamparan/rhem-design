import React, { useState } from "react";
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Stack,
  StackItem,
  CardHeader,
  Grid,
  GridItem,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import PostRestoreBanners from "../shared/PostRestoreBanners";
import LabelFleetFilter from "../shared/LabelFleetFilter";
import DonutChart from "../shared/DonutChart";
import { mockDevices, mockDevicesPendingApproval } from "../../data/mockData";
import { useDesignControls } from "../../hooks/useDesignControls";
import { useDeviceStatusesCount } from "../../hooks/useDeviceStatusesCount";
import { statusDescriptions } from "../../utils/fleetUtils";
import { NavigationItemId, NavigationParams, ViewType } from "../../types/app";

interface OverviewPageProps {
  onNavigate: (view: ViewType, activeItem?: NavigationItemId, params?: NavigationParams) => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
}) => {
  const { getSetting } = useDesignControls();
  const showDevicesPendingApproval = getSetting("showDevicesPendingApproval");
  const pendingDevicesCount = showDevicesPendingApproval ? mockDevicesPendingApproval.length : 0;
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Get chart data from the hook
  const { appStatusChartData, deviceStatusChartData, systemUpdateChartData } = 
    useDeviceStatusesCount(mockDevices);

  const handleAddFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
  };

  return (
    <>
      {/* Header */}
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Overview
        </Title>
      </PageSection>

      <PostRestoreBanners
        onNavigate={onNavigate}
      />

      {/* Main Overview Content */}
      <PageSection>
        <Grid hasGutter>
          <GridItem md={9}>
            <Grid hasGutter>
              <GridItem>
                {/* Status Section */}
                <Card>
            <CardHeader>
              <Title headingLevel="h3" size="lg">
                Status
              </Title>
            </CardHeader>
            <CardBody>
              <Stack hasGutter>
                <StackItem>
                  <LabelFleetFilter
                    selectedFilters={activeFilters}
                    onAddFilter={handleAddFilter}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAll}
                  />
                </StackItem>

                <StackItem>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      marginBottom: "24px",
                    }}
                  >
                    {mockDevices.length} devices
                  </div>
                </StackItem>
                <StackItem>
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
                </StackItem>
              </Stack>

              {/* Filter and Count */}

              {/* Charts Row */}
            </CardBody>
            </Card>
            </GridItem>
              
              {/* Tasks Section */}
              <GridItem md={9} lg={6}>
                <Card>
                  <CardBody>
                    <Title
                      headingLevel="h3"
                      size="lg"
                      style={{ marginBottom: "24px" }}
                    >
                      Tasks
                    </Title>

                    {pendingDevicesCount > 0 ? (
                      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                        <FlexItem>
                          <span>● {pendingDevicesCount} devices pending approval</span>
                        </FlexItem>
                        <FlexItem>
                          <Button
                            variant="link"
                            isInline
                            onClick={() => onNavigate('main', 'devices')}
                          >
                            Review pending devices
                          </Button>
                        </FlexItem>
                      </Flex>
                    ) : (
                      <div style={{ fontSize: "14px" }}>
                        All good!
                      </div>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
          
          {/* Alerts Section */}
          <GridItem md={3}>
            <Card>
              <CardBody>
                <Title
                  headingLevel="h3"
                  size="lg"
                  style={{ marginBottom: "24px" }}
                >
                  Alerts
                </Title>

                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ marginBottom: "24px" }}>
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 80 80"
                      style={{ color: "#9ca3af" }}
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        d="M65 65 L72 72"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <Title
                    headingLevel="h4"
                    size="md"
                    style={{ marginBottom: "16px" }}
                  >
                    There are no active Alerts at this time
                  </Title>

                  <p
                    style={{
                      color: "#6a6e73",
                      fontSize: "14px",
                      marginBottom: "24px",
                      lineHeight: "1.5",
                    }}
                  >
                    This area displays current notifications about your monitored
                    devices and fleets. Alerts will appear here if an issue is
                    detected.
                  </p>

                  <Button variant="link">View Devices</Button>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default OverviewPage;

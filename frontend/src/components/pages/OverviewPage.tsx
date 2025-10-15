import React, { useState } from "react";
import {
  PageSection,
  Title,
  Card,
  CardBody,
  Button,
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Label,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import SuspendedDevicesAlert from "../shared/SuspendedDevicesAlert";
import GlobalPostRestoreBanner from "../shared/GlobalPostRestoreBanner";
import { mockDevices, mockSystemState } from "../../data/mockData";
import {
  generateChartData,
  getSuspendedDevicesCount,
} from "../../utils/deviceUtils";

interface OverviewPageProps {
  onNavigateToSuspendedDevices?: () => void;
  showPostRestoreBanner?: boolean;
  onDismissPostRestoreBanner?: () => void;
  onNavigateToDevices?: () => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToSuspendedDevices = () =>
    console.log("Navigate to suspended devices"),
  showPostRestoreBanner = false,
  onDismissPostRestoreBanner = () => console.log("Dismiss banner"),
  onNavigateToDevices = () => console.log("Navigate to devices"),
}) => {
  const suspendedCount = getSuspendedDevicesCount(mockDevices);
  const deviceChartData = generateChartData(mockDevices);

  return (
    <>
      {/* Header */}
      <PageSection>
        <Title headingLevel="h1" size="2xl">
          Overview
        </Title>
      </PageSection>

      {/* Global Post-Restore Banner */}
      {showPostRestoreBanner && (
        <PageSection style={{ paddingTop: 0, paddingBottom: "16px" }}>
          <GlobalPostRestoreBanner
            isVisible={showPostRestoreBanner}
            onDismiss={onDismissPostRestoreBanner}
            onViewDevices={onNavigateToDevices}
          />
        </PageSection>
      )}

      {/* Suspended Devices Alert */}
      {suspendedCount > 0 && (
        <PageSection style={{ paddingTop: 0, paddingBottom: "16px" }}>
          <SuspendedDevicesAlert
            suspendedCount={suspendedCount}
            onViewSuspendedDevices={onNavigateToSuspendedDevices}
          />
        </PageSection>
      )}

      {/* Main Overview Content */}
      <PageSection>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
          }}
        >
          {/* Status Section */}
          <Card>
            <CardBody>
              {/* Filter and Count */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Select
                    isOpen={false}
                    selected="Filter"
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="secondary"
                        style={{ fontSize: "14px" }}
                      >
                        Filter
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="all">All</SelectOption>
                      <SelectOption value="global">Global</SelectOption>
                    </SelectList>
                  </Select>
                  <span style={{ fontSize: "14px", color: "#6a6e73" }}>
                    Category
                  </span>
                  <Label color="grey" style={{ fontSize: "12px" }}>
                    Global ✕
                  </Label>
                </div>
              </div>

              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "24px",
                }}
              >
                {mockDevices.length} devices
              </div>

              {/* Charts Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "40px",
                }}
              >
                {/* Application Status Chart */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginBottom: "20px",
                    }}
                  >
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray="326.73 408.41"
                        strokeDashoffset="0"
                        transform="rotate(-90 80 80)"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="10"
                        strokeDasharray="40.84 408.41"
                        strokeDashoffset="-326.73"
                        transform="rotate(-90 80 80)"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="10"
                        strokeDasharray="20.42 408.41"
                        strokeDashoffset="-367.57"
                        transform="rotate(-90 80 80)"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="10"
                        strokeDasharray="20.42 408.41"
                        strokeDashoffset="-387.99"
                        transform="rotate(-90 80 80)"
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#6a6e73",
                          textAlign: "center",
                        }}
                      >
                        Application Status
                      </div>
                    </div>
                  </div>

                  {/* Legend in clean horizontal rows */}
                  <div
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      maxWidth: "180px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#10b981",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#10b981", fontWeight: "500" }}>
                          80%
                        </span>
                        <span>Healthy</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#f59e0b",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#f59e0b", fontWeight: "500" }}>
                          10%
                        </span>
                        <span>Degraded</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#ef4444",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#ef4444", fontWeight: "500" }}>
                          5%
                        </span>
                        <span>Error</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#6b7280",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#6b7280", fontWeight: "500" }}>
                          5%
                        </span>
                        <span>Unknown</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Status Chart */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginBottom: "20px",
                    }}
                  >
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      {deviceChartData.map((data, index) => (
                        <circle
                          key={data.status}
                          cx="80"
                          cy="80"
                          r="65"
                          fill="none"
                          stroke={data.color}
                          strokeWidth="10"
                          strokeDasharray={data.strokeDasharray}
                          strokeDashoffset={data.strokeDashoffset}
                          transform="rotate(-90 80 80)"
                        />
                      ))}
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#6a6e73",
                          textAlign: "center",
                        }}
                      >
                        Device Status
                      </div>
                    </div>
                  </div>

                  {/* Legend in clean horizontal rows */}
                  <div
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      maxWidth: "220px",
                      margin: "0 auto",
                    }}
                  >
                    {Array.from(
                      { length: Math.ceil(deviceChartData.length / 2) },
                      (_, rowIndex) => (
                        <div
                          key={rowIndex}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "16px",
                          }}
                        >
                          {deviceChartData
                            .slice(rowIndex * 2, rowIndex * 2 + 2)
                            .map((data) => (
                              <div
                                key={data.status}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <span
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    backgroundColor: data.color,
                                    flexShrink: 0,
                                  }}
                                ></span>
                                <span
                                  style={{
                                    color: data.color,
                                    fontWeight: "500",
                                  }}
                                >
                                  {Math.round(data.percentage)}%
                                </span>
                                <span>{data.status}</span>
                              </div>
                            ))}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* System Update Status Chart */}
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      marginBottom: "20px",
                    }}
                  >
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray="306.31 408.41"
                        strokeDashoffset="0"
                        transform="rotate(-90 80 80)"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="10"
                        strokeDasharray="12.25 408.41"
                        strokeDashoffset="-306.31"
                        transform="rotate(-90 80 80)"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray="61.26 408.41"
                        strokeDashoffset="-318.56"
                        transform="rotate(-90 80 80)"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="10"
                        strokeDasharray="28.59 408.41"
                        strokeDashoffset="-379.82"
                        transform="rotate(-90 80 80)"
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#6a6e73",
                          textAlign: "center",
                        }}
                      >
                        <div>System Update</div>
                        <div>Status</div>
                      </div>
                    </div>
                  </div>

                  {/* Legend in clean horizontal rows */}
                  <div
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      maxWidth: "200px",
                      margin: "0 auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#10b981",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#10b981", fontWeight: "500" }}>
                          75%
                        </span>
                        <span>Up to date</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#f59e0b",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#f59e0b", fontWeight: "500" }}>
                          3%
                        </span>
                        <span>Out of date</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#3b82f6",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#3b82f6", fontWeight: "500" }}>
                          15%
                        </span>
                        <span>Updating</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#6b7280",
                            flexShrink: 0,
                          }}
                        ></span>
                        <span style={{ color: "#6b7280", fontWeight: "500" }}>
                          7%
                        </span>
                        <span>Unknown</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Alerts Section */}
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

                <Button variant="link" style={{ color: "#06c", padding: 0 }}>
                  View Devices
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </PageSection>
    </>
  );
};

export default OverviewPage;

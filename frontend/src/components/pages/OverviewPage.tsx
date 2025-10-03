import React, { useState } from 'react';
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
} from '@patternfly/react-core';
import {
  EllipsisVIcon
} from '@patternfly/react-icons';
import SuspendedDevicesAlert from '../shared/SuspendedDevicesAlert';
import GlobalPostRestoreBanner from '../shared/GlobalPostRestoreBanner';
import { mockDevices, mockSystemState } from '../../data/mockData';
import { generateChartData, getSuspendedDevicesCount } from '../../utils/deviceUtils';

interface OverviewPageProps {
  onNavigateToSuspendedDevices?: () => void;
  showPostRestoreBanner?: boolean;
  onDismissPostRestoreBanner?: () => void;
  onNavigateToDevices?: () => void;
}

const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToSuspendedDevices = () => console.log('Navigate to suspended devices'),
  showPostRestoreBanner = false,
  onDismissPostRestoreBanner = () => console.log('Dismiss banner'),
  onNavigateToDevices = () => console.log('Navigate to devices')
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
        <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
          <GlobalPostRestoreBanner
            isVisible={showPostRestoreBanner}
            onDismiss={onDismissPostRestoreBanner}
            onViewDevices={onNavigateToDevices}
          />
        </PageSection>
      )}

      {/* Suspended Devices Alert */}
      {suspendedCount > 0 && (
        <PageSection style={{ paddingTop: 0, paddingBottom: '16px' }}>
          <SuspendedDevicesAlert
            suspendedCount={suspendedCount}
            onViewSuspendedDevices={onNavigateToSuspendedDevices}
          />
        </PageSection>
      )}

      {/* Main Overview Content */}
      <PageSection>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Status Section */}
          <Card>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title headingLevel="h3" size="lg">Status</Title>
                <Button variant="plain">
                  <EllipsisVIcon />
                </Button>
              </div>

              {/* Filter and Count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Select
                    isOpen={false}
                    selected="Filter"
                    toggle={(toggleRef) => (
                      <MenuToggle ref={toggleRef} variant="secondary" style={{ fontSize: '14px' }}>
                        Filter
                      </MenuToggle>
                    )}
                  >
                    <SelectList>
                      <SelectOption value="all">All</SelectOption>
                      <SelectOption value="global">Global</SelectOption>
                    </SelectList>
                  </Select>
                  <span style={{ fontSize: '14px', color: '#6a6e73' }}>Category</span>
                  <Label color="grey" style={{ fontSize: '12px' }}>
                    Global ✕
                  </Label>
                </div>
              </div>

              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '24px' }}>
                {mockDevices.length} devices
              </div>

              {/* Charts Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
                {/* Application Status Chart */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="8"
                              strokeDasharray="251.3 314.2" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="8"
                              strokeDasharray="31.4 314.2" strokeDashoffset="-251.3" transform="rotate(-90 60 60)" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="8"
                              strokeDasharray="15.7 314.2" strokeDashoffset="-282.7" transform="rotate(-90 60 60)" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#6b7280" strokeWidth="8"
                              strokeDasharray="15.7 314.2" strokeDashoffset="-298.4" transform="rotate(-90 60 60)" />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <div style={{ fontSize: '12px', color: '#6a6e73' }}>Application Status</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                      <span>80% Healthy</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
                      <span>10% Degraded</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                      <span>5% Error</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#6b7280', borderRadius: '50%' }}></span>
                      <span>5% Unknown</span>
                    </div>
                  </div>
                </div>

                {/* Device Status Chart */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      {deviceChartData.map((data, index) => (
                        <circle
                          key={data.status}
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke={data.color}
                          strokeWidth="8"
                          strokeDasharray={data.strokeDasharray}
                          strokeDashoffset={data.strokeDashoffset}
                          transform="rotate(-90 60 60)"
                        />
                      ))}
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <div style={{ fontSize: '12px', color: '#6a6e73' }}>Device Status</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', textAlign: 'left' }}>
                    {deviceChartData.map((data) => (
                      <div key={data.status} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: data.color, borderRadius: '50%' }}></span>
                        <span>{Math.round(data.percentage)}% {data.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Update Status Chart */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="8"
                              strokeDasharray="235.6 314.2" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="8"
                              strokeDasharray="9.4 314.2" strokeDashoffset="-235.6" transform="rotate(-90 60 60)" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="8"
                              strokeDasharray="47.1 314.2" strokeDashoffset="-245.0" transform="rotate(-90 60 60)" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#9333ea" strokeWidth="8"
                              strokeDasharray="22.0 314.2" strokeDashoffset="-292.1" transform="rotate(-90 60 60)" />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      <div style={{ fontSize: '12px', color: '#6a6e73' }}>System Update Status</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                      <span>75% Up to date</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
                      <span>3% Out of date</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></span>
                      <span>15% Updating</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', backgroundColor: '#9333ea', borderRadius: '50%' }}></span>
                      <span>7% Unknown</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Alerts Section */}
          <Card>
            <CardBody>
              <Title headingLevel="h3" size="lg" style={{ marginBottom: '24px' }}>
                Alerts
              </Title>

              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" style={{ color: '#9ca3af' }}>
                    <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="3" />
                    <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path d="M65 65 L72 72" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <Title headingLevel="h4" size="md" style={{ marginBottom: '16px' }}>
                  There are no active Alerts at this time
                </Title>

                <p style={{ color: '#6a6e73', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
                  This area displays current notifications about your monitored devices and fleets. Alerts will appear here if an issue is detected.
                </p>

                <Button variant="link" style={{ color: '#06c', padding: 0 }}>
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
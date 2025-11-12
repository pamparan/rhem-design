import { ApplicationStatus, DeviceStatus, SystemUpdateStatus } from "../types/device";
import {
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
  ExclamationTriangleIcon,
  PowerOffIcon,
  InProgressIcon,
  TimesCircleIcon,
} from '@patternfly/react-icons';

export const deviceStatusItems: Record<DeviceStatus, { label: string, color: string, icon: any }> = {
    ERROR: { label: 'Error', color: '#c9190b', icon: TimesCircleIcon },
    SUSPENDED: { label: 'Suspended', color: '#ec7a08', icon: PauseCircleIcon },
    PENDING_SYNC: { label: 'Pending Sync', color: '#2b9af3', icon: ClockIcon },
    DEGRADED: { label: 'Degraded', color: '#f0ab00', icon: ExclamationTriangleIcon },
    UNKNOWN: { label: 'Unknown', color: '#6a6e73', icon: ExclamationTriangleIcon },
    REBOOTING: { label: 'Rebooting', color: '#147878', icon: InProgressIcon },
    POWERED_OFF: { label: 'Powered Off', color: '#2b9af3', icon: PowerOffIcon },
    ONLINE: { label: 'Online', color: '#3e8635', icon: CheckCircleIcon },
  };
  
export const applicationStatusItems: Record<ApplicationStatus, { label: string, color: string, icon: any }> = {
  ERROR: { label: 'Error', color: '#c9190b', icon: TimesCircleIcon },
  DEGRADED: { label: 'Degraded', color: '#f0ab00', icon: ExclamationTriangleIcon },
  UNKNOWN: { label: 'Unknown', color: '#6a6e73', icon: ExclamationTriangleIcon },
  HEALTHY: { label: 'Healthy', color: '#3e8635', icon: CheckCircleIcon },
};
  
export const systemUpdateStatusItems: Record<SystemUpdateStatus, { label: string, color: string, icon: any }> = {
  OUT_OF_DATE: { label: 'Out-of-date', color: '#f0ab00', icon: ExclamationTriangleIcon },
  UPDATING: { label: 'Updating', color: '#147878', icon: InProgressIcon },
  UNKNOWN: { label: 'Unknown', color: '#6a6e73', icon: ExclamationTriangleIcon },
  UP_TO_DATE: { label: 'Up-to-date', color: '#3e8635', icon: CheckCircleIcon },
};

export const statusDescriptions = {
  applicationStatus: 'Overall status of application workloads.',
  deviceStatus: 'Overall status of device hardware and operating system.',
  systemUpdateStatus: 'Current system configuration vs. latest system configuration.',
};

// Helper function to convert chart data to count map
export function createCountMap(chartData: { label: string; value: number }[]): Record<string, number> {
  return chartData.reduce((acc, item) => {
    acc[item.label] = item.value;
    return acc;
  }, {} as Record<string, number>);
}

// Helper function to generate filter options from status items and count data
export function generateFilterOptions<T extends string>(
  statusItems: Record<T, { label: string; color: string; icon: any }>,
  countMap: Record<string, number>
) {
  return (Object.entries(statusItems) as [string, { label: string; color: string; icon: any }][])
    .map(([value, item]) => ({
      value,
      label: item.label,
      count: countMap[item.label] || 0,
      color: item.color,
      icon: item.icon,
    }))
    .filter(option => option.count > 0);
}
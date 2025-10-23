import { ApplicationStatus, DeviceStatus, SystemUpdateStatus } from "../types/device";


export const deviceStatusItems: Record<DeviceStatus, { label: string, color: string }> = {
    ERROR: { label: 'Error', color: '#d9534f' },
    SUSPENDED: { label: 'Suspended', color: '#ff8c00' },
    PENDING_SYNC: { label: 'Pending Sync', color: '#6a6e73' },
    DEGRADED: { label: 'Degraded', color: '#f0ad4e' },
    UNKNOWN: { label: 'Unknown', color: '#6c757d' },
    REBOOTING: { label: 'Rebooting', color: '#337ab7' },
    POWERED_OFF: { label: 'Powered Off', color: '#333333' },
    ONLINE: { label: 'Online', color: '#5cb85c' },
  };
  
export const applicationStatusItems: Record<ApplicationStatus, { label: string, color: string }> = {
  ERROR: { label: 'Error', color: '#d9534f' },
  DEGRADED: { label: 'Degraded', color: '#f0ad4e' },
  UNKNOWN: { label: 'Unknown', color: '#6c757d' },
  HEALTHY: { label: 'Healthy', color: '#5cb85c' },
};
  
export const systemUpdateStatusItems: Record<SystemUpdateStatus, { label: string, color: string }> = {
  OUT_OF_DATE: { label: 'Out-of-date', color: '#f0ad4e' },
  UPDATING: { label: 'Updating', color: '#337ab7' },
  UNKNOWN: { label: 'Unknown', color: '#6c757d' },
  UP_TO_DATE: { label: 'Up-to-date', color: '#5cb85c' },
};

export const statusDescriptions = {
  applicationStatus: 'Overall status of application workloads.',
  deviceStatus: 'Overall status of device hardware and operating system.',
  systemUpdateStatus: 'Current system configuration vs. latest system configuration.',
};
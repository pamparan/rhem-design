export interface Device {
  id: string;
  name: string;
  alias?: string;
  status: DeviceStatus;
  applicationStatus: ApplicationStatus;
  systemUpdateStatus: SystemUpdateStatus;
  type: string;
  location: string;
  ip: string;
  firmware: string;
  fleet?: string;
  lastSeen: string;
  configVersion?: number;
}

export interface DevicePendingApproval {
  id: string;
  name: string;
  alias?: string;
  requestedAt: string;
}

export const DEVICE_STATUSES = [
  'ERROR',
  'SUSPENDED',
  'PENDING_SYNC',
  'DEGRADED',
  'UNKNOWN',
  'REBOOTING',
  'POWERED_OFF',
  'ONLINE'
] as const;

export const APPLICATION_STATUSES = [
  'ERROR',
  'DEGRADED',
  'UNKNOWN',
  'HEALTHY'
] as const;

export const SYSTEM_UPDATE_STATUSES = [
  'OUT_OF_DATE',
  'UPDATING',
  'UNKNOWN',
  'UP_TO_DATE'
] as const;

// Derive types from the constant arrays
export type DeviceStatus = typeof DEVICE_STATUSES[number];
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];
export type SystemUpdateStatus = typeof SYSTEM_UPDATE_STATUSES[number];

export interface DeviceStatusCount {
  status: DeviceStatus;
  count: number;
  color: string;
  label: string;
}

export interface SystemState {
  suspendedDeviceCount: number;
  pendingSyncDeviceCount: number;
}

export interface ChartData {
  status: string;
  count: number;
  percentage: number;
  color: string;
  strokeDasharray: string;
  strokeDashoffset: string;
}
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

export type DeviceStatus =
  | 'ONLINE'
  | 'OFFLINE'
  | 'ERROR'
  | 'DEGRADED'
  | 'UNKNOWN'
  | 'REBOOTING'
  | 'POWERED_OFF'
  | 'SUSPENDED'          // New state for devices with newer configs than server
  | 'PENDING_SYNC';      // New state for devices waiting to connect after restore

export type ApplicationStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'ERROR'
  | 'UNKNOWN';

export type SystemUpdateStatus =
  | 'UP_TO_DATE'
  | 'OUT_OF_DATE'
  | 'UPDATING'
  | 'FAILED'
  | 'ROLLING_BACK'
  | 'UNKNOWN';

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
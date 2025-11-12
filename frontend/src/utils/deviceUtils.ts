import React from 'react';
import { Device, DeviceStatus, DeviceStatusCount, ChartData, ApplicationStatus, SystemUpdateStatus } from '../types/device';
import {
  CheckCircleIcon,
  ClockIcon,
  PauseCircleIcon,
  ExclamationTriangleIcon,
  QuestionCircleIcon,
  PowerOffIcon,
  InProgressIcon,
  TimesCircleIcon
} from '@patternfly/react-icons';

export const getStatusColor = (status: DeviceStatus | ApplicationStatus | SystemUpdateStatus): string => {
  const statusColors: Record<string, string> = {
    // Device statuses - matching the exact colors from reference image
    ONLINE: '#5cb85c',           // Green - matches "Online" in image
    OFFLINE: '#999999',          // Gray - matches "Unknown" in image
    ERROR: '#d9534f',            // Red - matches "Error" in image
    DEGRADED: '#f0ad4e',         // Orange/Yellow - matches "Degraded" in image
    UNKNOWN: '#6c757d',          // Gray - matches "Unknown" in image
    REBOOTING: '#337ab7',        // Blue - matches "Rebooting" in image
    POWERED_OFF: '#333333',      // Black - matches "Powered off" in image
    SUSPENDED: '#ff8c00',        // Orange - matches "Suspended" in image
    PENDING_SYNC: '#5bc0de',     // Light blue - matches "Pending Sync" in image

    // Application statuses - matching dropdown filter colors exactly
    HEALTHY: '#5cb85c',          // Green for success

    // System update statuses - matching dropdown filter colors exactly
    UP_TO_DATE: '#5cb85c',       // Green for success
    OUT_OF_DATE: '#f0ad4e',      // Orange for warning
    UPDATING: '#147878',         // Teal for info/progress
    FAILED: '#d9534f',           // Red for error
    ROLLING_BACK: '#f0ad4e',     // Orange for warning
  };

  return statusColors[status] || '#6c757d';
};

export const getStatusLabelStyle = (status: DeviceStatus | ApplicationStatus | SystemUpdateStatus) => {
  const statusStyles: Record<string, { backgroundColor: string; color: string; borderColor: string }> = {
    // Device statuses - using PatternFly 6 outlined label status colors
    ONLINE: { backgroundColor: 'transparent', color: '#3d7317', borderColor: '#3d7317' }, // Success
    OFFLINE: { backgroundColor: 'transparent', color: '#6a6e73', borderColor: '#6a6e73' }, // Gray
    ERROR: { backgroundColor: 'transparent', color: '#b1380b', borderColor: '#b1380b' }, // Danger
    DEGRADED: { backgroundColor: 'transparent', color: '#dca614', borderColor: '#dca614' }, // Warning
    UNKNOWN: { backgroundColor: 'transparent', color: '#6a6e73', borderColor: '#6a6e73' }, // Gray
    REBOOTING: { backgroundColor: 'transparent', color: '#147878', borderColor: '#147878' }, // Info
    POWERED_OFF: { backgroundColor: 'transparent', color: '#147878', borderColor: '#147878' }, // Info
    SUSPENDED: { backgroundColor: 'transparent', color: '#dca614', borderColor: '#dca614' }, // Warning
    PENDING_SYNC: { backgroundColor: 'transparent', color: '#147878', borderColor: '#147878' }, // Info

    // Application statuses - using PatternFly 6 outlined label status colors
    HEALTHY: { backgroundColor: 'transparent', color: '#3d7317', borderColor: '#3d7317' }, // Success

    // System update statuses - using PatternFly 6 outlined label status colors
    UP_TO_DATE: { backgroundColor: 'transparent', color: '#3d7317', borderColor: '#3d7317' }, // Success
    OUT_OF_DATE: { backgroundColor: 'transparent', color: '#dca614', borderColor: '#dca614' }, // Warning
    UPDATING: { backgroundColor: 'transparent', color: '#147878', borderColor: '#147878' }, // Info
    FAILED: { backgroundColor: 'transparent', color: '#b1380b', borderColor: '#b1380b' }, // Danger
    ROLLING_BACK: { backgroundColor: 'transparent', color: '#dca614', borderColor: '#dca614' }, // Warning
  };

  return statusStyles[status] || { backgroundColor: 'transparent', color: '#6a6e73', borderColor: '#6a6e73' };
};

export const getStatusLabel = (status: DeviceStatus | ApplicationStatus | SystemUpdateStatus): string => {
  const statusLabels: Record<string, string> = {
    // Device statuses
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    ERROR: 'Error',
    DEGRADED: 'Degraded',
    UNKNOWN: 'Unknown',
    REBOOTING: 'Rebooting',
    POWERED_OFF: 'Powered off',
    SUSPENDED: 'Suspended',
    PENDING_SYNC: 'Pending Sync',

    // Application statuses
    HEALTHY: 'Healthy',

    // System update statuses
    UP_TO_DATE: 'Up-to-date',
    OUT_OF_DATE: 'Out-of-date',
    UPDATING: 'Updating',
    FAILED: 'Failed',
    ROLLING_BACK: 'Rolling Back',
  };

  return statusLabels[status] || 'Unknown';
};

export const getStatusIcon = (status: DeviceStatus | ApplicationStatus | SystemUpdateStatus): React.ComponentType<any> => {
  const statusIcons: Record<string, React.ComponentType<any>> = {
    // Device statuses - matching dropdown filter icons exactly
    ONLINE: CheckCircleIcon,
    OFFLINE: QuestionCircleIcon,
    ERROR: TimesCircleIcon,
    DEGRADED: ExclamationTriangleIcon,
    UNKNOWN: ExclamationTriangleIcon,
    REBOOTING: InProgressIcon,
    POWERED_OFF: PowerOffIcon,
    SUSPENDED: PauseCircleIcon,
    PENDING_SYNC: ClockIcon,

    // Application statuses - matching dropdown filter icons exactly
    HEALTHY: CheckCircleIcon,

    // System update statuses - matching dropdown filter icons exactly
    UP_TO_DATE: CheckCircleIcon,
    OUT_OF_DATE: ExclamationTriangleIcon,
    UPDATING: InProgressIcon,
    FAILED: TimesCircleIcon,
    ROLLING_BACK: ExclamationTriangleIcon,
  };

  return statusIcons[status] || QuestionCircleIcon;
};

export const countDevicesByStatus = (devices: Device[]): DeviceStatusCount[] => {
  const statusCounts: Record<DeviceStatus, number> = {
    ONLINE: 0,
    OFFLINE: 0,
    ERROR: 0,
    DEGRADED: 0,
    UNKNOWN: 0,
    REBOOTING: 0,
    POWERED_OFF: 0,
    SUSPENDED: 0,
    PENDING_SYNC: 0,
  };

  devices.forEach(device => {
    statusCounts[device.status]++;
  });

  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      status: status as DeviceStatus,
      count,
      color: getStatusColor(status as DeviceStatus),
      label: getStatusLabel(status as DeviceStatus),
    }))
    .filter(item => item.count > 0); // Only return statuses with devices
};

export const generateChartData = (devices: Device[]): ChartData[] => {
  const total = devices.length;
  if (total === 0) return [];

  const statusCounts = countDevicesByStatus(devices);
  const circumference = 2 * Math.PI * 65; // radius = 65 (updated to match chart size)
  let cumulativeOffset = 0;

  return statusCounts.map(({ count, color, label }) => {
    const percentage = (count / total) * 100;
    const strokeLength = (percentage / 100) * circumference;
    const strokeDasharray = `${strokeLength} ${circumference}`;
    const strokeDashoffset = `-${cumulativeOffset}`;

    cumulativeOffset += strokeLength;

    return {
      status: label,
      count,
      percentage,
      color,
      strokeDasharray,
      strokeDashoffset,
    };
  });
};

export const getSuspendedDevicesCount = (devices: Device[]): number => {
  return devices.filter(device => device.status === 'SUSPENDED').length;
};

export const getPendingSyncDevicesCount = (devices: Device[]): number => {
  return devices.filter(device => device.status === 'PENDING_SYNC').length;
};

export const isDeviceResumable = (device: Device): boolean => {
  return device.status === 'SUSPENDED';
};

export const getFilteredDevices = (
  devices: Device[],
  searchValue: string,
  statusFilter: DeviceStatus | ''
): Device[] => {
  return devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchValue.toLowerCase()) ||
                         (device.alias && device.alias.toLowerCase().includes(searchValue.toLowerCase()));
    const matchesStatus = !statusFilter || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};
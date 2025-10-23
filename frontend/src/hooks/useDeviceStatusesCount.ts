import { useMemo } from 'react';
import { DonutChartData } from '../components/shared/DonutChart';
import { ApplicationStatus, Device, DeviceStatus, SystemUpdateStatus } from '../types/device';
import {
  applicationStatusItems,
  deviceStatusItems,
  systemUpdateStatusItems,
} from '../utils/fleetUtils';

export const useDeviceStatusesCount = (devices: Device[]) => {
  return useMemo(() => {
    const { deviceStatusCounts, appStatusCounts, systemUpdateCounts } = devices.reduce(
      (acc, device) => {
        if (device.status in acc.deviceStatusCounts) {
          acc.deviceStatusCounts[device.status]++;
        }

        if (device.applicationStatus in acc.appStatusCounts) {
          acc.appStatusCounts[device.applicationStatus]++;
        }

        if (device.systemUpdateStatus in acc.systemUpdateCounts) {
          acc.systemUpdateCounts[device.systemUpdateStatus]++;
        }

        return acc;
      },
      {
        deviceStatusCounts: Object.keys(deviceStatusItems).reduce((acc, key) => {
          acc[key as DeviceStatus] = 0;
          return acc;
        }, {} as Record<DeviceStatus, number>),
        appStatusCounts: Object.keys(applicationStatusItems).reduce((acc, key) => {
          acc[key as ApplicationStatus] = 0;
          return acc;
        }, {} as Record<ApplicationStatus, number>),
        systemUpdateCounts: Object.keys(systemUpdateStatusItems).reduce((acc, key) => {
          acc[key as SystemUpdateStatus] = 0;
          return acc;
        }, {} as Record<SystemUpdateStatus, number>),
      }
    );

    // Prepare chart data
    const appStatusChartData: DonutChartData[] = Object.entries(applicationStatusItems).map(
      ([key, item]) => ({
        label: item.label,
        color: item.color,
        value: appStatusCounts[key as ApplicationStatus],
      })
    );

    const deviceStatusChartData: DonutChartData[] = Object.entries(deviceStatusItems).map(
      ([key, item]) => ({
        label: item.label,
        color: item.color,
        value: deviceStatusCounts[key as DeviceStatus],
      })
    );

    const systemUpdateChartData: DonutChartData[] = Object.entries(systemUpdateStatusItems).map(
      ([key, item]) => ({
        label: item.label,
        color: item.color,
        value: systemUpdateCounts[key as SystemUpdateStatus],
      })
    );


    return {
      appStatusChartData,
      deviceStatusChartData,
      systemUpdateChartData,
    };
  }, [devices]);
};


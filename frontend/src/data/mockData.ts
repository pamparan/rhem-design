import { Device, SystemState } from "../types/device";

export const mockDevices: Device[] = [
  {
    id: "1",
    name: "0A83BC2347AFE7F2",
    alias: "Just a friendly name here",
    status: "SUSPENDED",
    applicationStatus: "ERROR",
    systemUpdateStatus: "FAILED",
    type: "Gateway",
    location: "New York",
    ip: "192.168.1.10",
    firmware: "v2.1.3",
    fleet: "Fitting Room Devices",
    lastSeen: "4 days ago",
    configVersion: 125,
  },
  {
    id: "2",
    name: "0A83BC2347AFE7F3",
    alias: "Just a friendly name here",
    status: "SUSPENDED",
    applicationStatus: "HEALTHY",
    systemUpdateStatus: "UP_TO_DATE",
    type: "Sensor",
    location: "San Francisco",
    ip: "192.168.1.15",
    firmware: "v1.8.2",
    fleet: "Fitting Room Devices",
    lastSeen: "4 days ago",
    configVersion: 128,
  },
  {
    id: "3",
    name: "0A83BC2347AFE7F4",
    alias: "Just a friendly name here",
    status: "PENDING_SYNC",
    applicationStatus: "DEGRADED",
    systemUpdateStatus: "OUT_OF_DATE",
    type: "Compute",
    location: "Los Angeles",
    ip: "192.168.1.20",
    firmware: "v2.0.1",
    fleet: "Fitting Room Devices",
    lastSeen: "4 days ago",
  },
  {
    id: "4",
    name: "0A83BC2347AFE7F5",
    alias: "Just a friendly name here",
    status: "PENDING_SYNC",
    applicationStatus: "UNKNOWN",
    systemUpdateStatus: "UPDATING",
    type: "Router",
    location: "Chicago",
    ip: "192.168.1.25",
    firmware: "v1.9.5",
    fleet: "Fitting Room Devices",
    lastSeen: "4 days ago",
  },
  {
    id: "5",
    name: "0A83BC2347AFE7F6",
    alias: "Just a friendly name here",
    status: "ONLINE",
    applicationStatus: "HEALTHY",
    systemUpdateStatus: "UNKNOWN",
    type: "Storage",
    location: "Miami",
    ip: "192.168.1.30",
    firmware: "v2.2.0",
    fleet: "Fitting Room Devices",
    lastSeen: "4 days ago",
  },
  {
    id: "6",
    name: "0A83BC2347AFE7F7",
    alias: "Just a friendly name here",
    status: "SUSPENDED",
    applicationStatus: "HEALTHY",
    systemUpdateStatus: "ROLLING_BACK",
    type: "Gateway",
    location: "Boston",
    ip: "192.168.1.35",
    firmware: "v2.1.3",
    fleet: "Fitting Room Devices",
    lastSeen: "4 days ago",
    configVersion: 130,
  },
  // Add more devices for better demonstration
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `${i + 7}`,
    name: `0A83BC2347AFE7F${(i + 8).toString(16).toUpperCase()}`,
    alias: "Device alias here",
    status:
      i % 8 === 0
        ? ("SUSPENDED" as const)
        : i % 7 === 0
        ? ("PENDING_SYNC" as const)
        : i % 6 === 0
        ? ("ERROR" as const)
        : i % 5 === 0
        ? ("DEGRADED" as const)
        : i % 4 === 0
        ? ("REBOOTING" as const)
        : i % 3 === 0
        ? ("OFFLINE" as const)
        : ("ONLINE" as const),
    applicationStatus:
      i % 4 === 0
        ? ("ERROR" as const)
        : i % 3 === 0
        ? ("DEGRADED" as const)
        : i % 2 === 0
        ? ("UNKNOWN" as const)
        : ("HEALTHY" as const),
    systemUpdateStatus:
      i % 5 === 0
        ? ("FAILED" as const)
        : i % 4 === 0
        ? ("OUT_OF_DATE" as const)
        : i % 3 === 0
        ? ("UPDATING" as const)
        : i % 2 === 0
        ? ("ROLLING_BACK" as const)
        : ("UP_TO_DATE" as const),
    type: ["Gateway", "Sensor", "Compute", "Router", "Storage"][i % 5],
    location: [
      "New York",
      "San Francisco",
      "Los Angeles",
      "Chicago",
      "Miami",
      "Boston",
      "Seattle",
      "Denver",
    ][i % 8],
    ip: `192.168.1.${40 + i}`,
    firmware: `v${Math.floor(i / 10) + 1}.${i % 10}.${Math.floor(
      Math.random() * 10
    )}`,
    fleet: i % 3 === 0 ? undefined : "Fitting Room Devices",
    lastSeen: `${Math.floor(Math.random() * 7) + 1} days ago`,
    configVersion:
      i % 8 === 0 ? 120 + Math.floor(Math.random() * 20) : undefined,
  })),
];

export const mockSystemState: SystemState = {
  suspendedDeviceCount: mockDevices.filter((d) => d.status === "SUSPENDED")
    .length,
  pendingSyncDeviceCount: mockDevices.filter((d) => d.status === "PENDING_SYNC")
    .length,
  restoreCompleteTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
};

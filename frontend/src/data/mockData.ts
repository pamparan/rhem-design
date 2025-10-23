import { 
  Device, 
  SystemState, 
  DevicePendingApproval,
  DEVICE_STATUSES,
  APPLICATION_STATUSES,
  SYSTEM_UPDATE_STATUSES
} from "../types/device";

export interface Fleet {
  id: string;
  name: string;
  systemImage: string;
  status: 'Valid' | 'Invalid';
  created?: string;
  deviceSelector?: string;
  managedBy?: string;
  sources?: number;
}

const getMockFleet = (index: number): string | undefined => {
  if (index % 5 === 0) return 'Store Devices';
  if (index % 4 === 0) return 'Office Devices';
  return index % 3 > 0 ? 'Fitting Room Devices' : undefined;
};

/**
 * Generates a somewhat random status from the list of available values.
 * @param statuses - Array of statuses ordered from worst to best
 * @param index - The index to use for distribution
 * @returns A status from the array (better statuses occur more frequently)
 * 
 * Distribution: Each status gets weight based on position (pos + 1)
 * Example for 4 items: [10%, 20%, 30%, 40%] - better statuses are more common
 */
function randomizeStatus<T>(statuses: readonly T[], index: number): T {
  const length = statuses.length;
  const totalWeight = (length * (length + 1)) / 2;
  
  const value = index % totalWeight;
  
  let cumulativeWeight = 0;
  for (let i = 0; i < length; i++) {
    const weight = i + 1; // Position 0 gets weight 1, position 1 gets weight 2, etc.
    cumulativeWeight += weight;
    if (value < cumulativeWeight) {
      return statuses[i];
    }
  }
  
  // Fallback to last (best) status
  return statuses[length - 1];
}

export const mockDevices: Device[] = [
  {
    id: "1",
    name: "0A83BC2347AFE7F2",
    alias: "Just a friendly name here",
    status: "SUSPENDED",
    applicationStatus: "ERROR",
    systemUpdateStatus: "OUT_OF_DATE",
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
    fleet: "Store Devices",
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
    fleet: "",
    lastSeen: "4 days ago",
  },
  {
    id: "6",
    name: "0A83BC2347AFE7F7",
    alias: "Just a friendly name here",
    status: "ONLINE",
    applicationStatus: "UNKNOWN",
    systemUpdateStatus: "UPDATING",
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
    alias: i % 5 === 0 ? 'my-device-alias' : undefined,
    status: randomizeStatus(DEVICE_STATUSES, i),
    applicationStatus: randomizeStatus(APPLICATION_STATUSES, i),
    systemUpdateStatus: randomizeStatus(SYSTEM_UPDATE_STATUSES, i),
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
    fleet: getMockFleet(i),
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
};

export const mockDevicesPendingApproval: DevicePendingApproval[] = [
  {
    id: "pending-1",
    name: "B4F9CD3458AFE8A1",
    requestedAt: "2 minutes ago",
  },
  {
    id: "pending-2",
    name: "C5A0DE4569BFE9B2",
    alias: "pos-0104-ny",
    requestedAt: "15 minutes ago",
  },
  {
    id: "pending-3",
    name: "D6B1EF5670CFE0C3",
    alias: "pos-0105-ny",
    requestedAt: "1 hour ago",
  },
];

export const mockFleets: Fleet[] = [
  { 
    id: '1', 
    name: 'Fitting Room Devices', 
    systemImage: 'github.com/flightctl/flightctl-demos @ main', 
    status: 'Valid',
    created: '30 January 2025',
    deviceSelector: 'type=fitting-room',
    managedBy: '-',
    sources: 0
  },
  { 
    id: '2', 
    name: 'Warehouse name', 
    systemImage: 'Local', 
    status: 'Invalid',
    created: '15 February 2025',
    deviceSelector: 'location=warehouse',
    managedBy: '-',
    sources: 2
  },
  { 
    id: '3', 
    name: 'Store Devices', 
    systemImage: 'github.com/flightctl/flightctl-demos @ main', 
    status: 'Valid',
    created: '10 March 2025',
    deviceSelector: 'type=store',
    managedBy: '-',
    sources: 1
  },
  { 
    id: '4', 
    name: 'Office Devices', 
    systemImage: 'github.com/flightctl/flightctl-demos @ main', 
    status: 'Valid',
    created: '20 March 2025',
    deviceSelector: 'type=office',
    managedBy: '-',
    sources: 0
  },
];

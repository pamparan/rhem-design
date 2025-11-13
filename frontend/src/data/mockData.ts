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
  if (index % 5 === 0) return 'store-devices';
  if (index % 4 === 0) return 'office-devices';
  return index % 3 > 0 ? 'fitting-room-devices' : undefined;
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
    name: "gbp0sn6574270a1f",
    alias: "madrid-fitting-room-01",
    status: "SUSPENDED",
    applicationStatus: "ERROR",
    systemUpdateStatus: "OUT_OF_DATE",
    type: "Gateway",
    location: "Madrid, Spain",
    ip: "192.168.122.93",
    firmware: "v2.1.3",
    fleet: "fitting-room-devices",
    lastSeen: "4 days ago",
    configVersion: 125,
  },
  {
    id: "2",
    name: "gbp0sn6574270b2g",
    alias: "barcelona-fitting-room-02",
    status: "SUSPENDED",
    applicationStatus: "HEALTHY",
    systemUpdateStatus: "UP_TO_DATE",
    type: "Sensor",
    location: "Barcelona, Spain",
    ip: "192.168.122.94",
    firmware: "v1.8.2",
    fleet: "fitting-room-devices",
    lastSeen: "2 days ago",
    configVersion: 128,
  },
  {
    id: "3",
    name: "gbp0sn6574270c3h",
    alias: "valencia-store-scanner",
    status: "PENDING_SYNC",
    applicationStatus: "DEGRADED",
    systemUpdateStatus: "OUT_OF_DATE",
    type: "Compute",
    location: "Valencia, Spain",
    ip: "192.168.122.95",
    firmware: "v2.0.1",
    fleet: "store-devices",
    lastSeen: "1 day ago",
  },
  {
    id: "4",
    name: "gbp0sn6574270d4i",
    alias: "sevilla-network-hub",
    status: "PENDING_SYNC",
    applicationStatus: "UNKNOWN",
    systemUpdateStatus: "UPDATING",
    type: "Router",
    location: "Sevilla, Spain",
    ip: "192.168.122.96",
    firmware: "v1.9.5",
    fleet: "store-devices",
    lastSeen: "3 hours ago",
  },
  {
    id: "5",
    name: "gbp0sn6574270e5j",
    alias: "bilbao-storage-unit",
    status: "ONLINE",
    applicationStatus: "HEALTHY",
    systemUpdateStatus: "UP_TO_DATE",
    type: "Storage",
    location: "Bilbao, Spain",
    ip: "192.168.122.97",
    firmware: "v2.2.0",
    fleet: "warehouse-devices",
    lastSeen: "12 minutes ago",
  },
  {
    id: "6",
    name: "gbp0sn6574270f6k",
    alias: "granada-office-gateway",
    status: "ONLINE",
    applicationStatus: "HEALTHY",
    systemUpdateStatus: "UP_TO_DATE",
    type: "Gateway",
    location: "Granada, Spain",
    ip: "192.168.122.98",
    firmware: "v2.1.3",
    fleet: "office-devices",
    lastSeen: "5 minutes ago",
    configVersion: 130,
  },
  // Add more devices for better demonstration
  ...Array.from({ length: 35 }, (_, i) => {
    const spanishCities = [
      "Madrid, Spain",
      "Barcelona, Spain",
      "Valencia, Spain",
      "Sevilla, Spain",
      "Zaragoza, Spain",
      "Málaga, Spain",
      "Murcia, Spain",
      "Palma, Spain",
      "Las Palmas, Spain",
      "Bilbao, Spain",
      "Alicante, Spain",
      "Córdoba, Spain",
      "Valladolid, Spain",
      "Vigo, Spain",
      "Gijón, Spain",
      "L'Hospitalet, Spain"
    ];

    const deviceTypes = ["Gateway", "Sensor", "Compute", "Router", "Storage"];
    const cityIndex = i % spanishCities.length;
    const cityName = spanishCities[cityIndex].split(",")[0].toLowerCase();
    const deviceType = deviceTypes[i % 5].toLowerCase();

    return {
      id: `${i + 7}`,
      name: `gbp0sn6574270${(i + 8).toString(16).toLowerCase().padStart(3, '0')}`,
      alias: i % 3 === 0 ? `${cityName}-${deviceType}-${String(i + 1).padStart(2, '0')}` : undefined,
      status: randomizeStatus(DEVICE_STATUSES, i),
      applicationStatus: randomizeStatus(APPLICATION_STATUSES, i),
      systemUpdateStatus: randomizeStatus(SYSTEM_UPDATE_STATUSES, i),
      type: deviceTypes[i % 5],
      location: spanishCities[cityIndex],
      ip: `192.168.122.${99 + i}`,
      firmware: `v2.${i % 5}.${i % 10}`,
      fleet: getMockFleet(i),
      lastSeen: i < 5 ? `${i + 1} minutes ago` :
                i < 15 ? `${Math.floor(i / 3)} hours ago` :
                `${Math.floor(i / 10)} days ago`,
      configVersion: i % 6 === 0 ? 120 + (i % 20) : undefined,
    };
  }),
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
    name: "b4f9cd3458afe8a1",
    requestedAt: "2 minutes ago",
  },
  {
    id: "pending-2",
    name: "c5a0de4569bfe9b2",
    alias: "pos-0104-ny",
    requestedAt: "15 minutes ago",
  },
  {
    id: "pending-3",
    name: "d6b1ef5670cfe0c3",
    alias: "pos-0105-ny",
    requestedAt: "1 hour ago",
  },
];

export const mockFleets: Fleet[] = [
  {
    id: '1',
    name: 'fitting-room-devices',
    systemImage: 'github.com/flightctl/flightctl-demos @ main',
    status: 'Valid',
    created: '15 September 2024',
    deviceSelector: 'location=fitting-room',
    managedBy: 'Fleet Automation',
    sources: 2
  },
  {
    id: '2',
    name: 'warehouse-devices',
    systemImage: 'quay.io/redhat/rhde:9.3',
    status: 'Invalid',
    created: '20 August 2024',
    deviceSelector: 'location=warehouse',
    managedBy: 'Fleet Automation',
    sources: 1
  },
  {
    id: '3',
    name: 'store-devices',
    systemImage: 'github.com/flightctl/flightctl-demos @ main',
    status: 'Valid',
    created: '5 October 2024',
    deviceSelector: 'location=store',
    managedBy: 'Fleet Automation',
    sources: 3
  },
  {
    id: '4',
    name: 'office-devices',
    systemImage: 'quay.io/redhat/rhde:9.3',
    status: 'Valid',
    created: '12 November 2024',
    deviceSelector: 'location=office',
    managedBy: 'Fleet Automation',
    sources: 1
  },
];

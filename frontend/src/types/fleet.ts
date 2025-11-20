export interface FleetFormData {
  // General Info
  fleetName: string;
  fleetLabels: Array<{ key: string; value: string }>;
  deviceSelector: Array<{ key: string; value: string }>;

  // Device Template
  systemImage: string;
  hostConfigurations: Array<{
    name: string;
    sourceType: string;
    repository: string;
    branch: string;
    path: string;
  }>;
  applicationWorkloads: Array<{
    name: string;
    type: string;
    image: string;
    files: Array<{
      path: string;
      content: string;
      isBase64: boolean;
    }>;
    variables: Array<{ name: string; value: string }>;
  }>;
  systemdServices: string[];

  // Updates
  useBasicConfigurations: boolean;
  rolloutPolicies: {
    enabled: boolean;
    batchSequencing: boolean;
    updateTimeout: number;
    batches: Array<{
      id: number;
      labels: Array<{ key: string; value: string }>;
      subsetType: 'percentage' | 'count';
      subsetValue: number;
      successThreshold: number;
    }>;
  };
  disruptionBudget: {
    enabled: boolean;
    groupByLabelKey: string;
    minAvailable: number;
    maxUnavailable: number;
  };
  updatePolicies: {
    enabled: boolean;
    useDifferentSchedules: boolean;
    useDeviceTimezoneDownloading: boolean;
    useDeviceTimezoneInstalling: boolean;
    downloadingSchedule: {
      startTime: string;
      endTime: string;
      frequency: 'daily' | 'weekly';
      timezone: string;
      daysOfWeek?: string[];
    };
    installingSchedule: {
      startTime: string;
      endTime: string;
      frequency: 'daily' | 'weekly';
      timezone: string;
      daysOfWeek?: string[];
    };
  };
}
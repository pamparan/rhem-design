export type ViewType = 'main' | 'devices' | 'suspended-devices' | 'device-details' | 'fleet-details' | 'login' | 'system-settings' | 'cli-auth' | 'kubernetes-token-login';
export type NavigationItemId = 'overview' | 'devices' | 'fleets' | 'repositories';

export interface NavigationParams {
  fleetId?: string;
  deviceId?: string;
}
